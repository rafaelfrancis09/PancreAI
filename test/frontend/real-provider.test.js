const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const providerSource = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "services", "recognition", "realMealRecognitionProvider.js"),
  "utf8"
);

function createProvider() {
  let idCounter = 0;
  const catalog = {
    "Macarrão à bolonhesa": { id: "macarrao_bolonhesa", fat: 8, protein: 12, carbs: 34, calories: 260 },
    "Bife grelhado": { id: "bife_grelhado", fat: 10, protein: 26, carbs: 0, calories: 210 }
  };
  const foodMatcher = {
    normalizeGrams(value) {
      const numeric = Number(value);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
    },
    normalizeConfidence(value, fallback = null) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : fallback;
    },
    normalizeDetectedItems(items) {
      const detectedItems = [];
      const unknownItems = [];
      items.forEach((item) => {
        const food = catalog[item.name];
        if (!food) {
          unknownItems.push({ label: item.name, confidence: item.confidence, quantityGrams: item.quantityGrams });
          return;
        }
        const factor = Number(item.quantityGrams) / 100;
        detectedItems.push({
          foodId: food.id,
          name: item.name,
          originalName: item.name,
          quantityGrams: Number(item.quantityGrams),
          confidence: Number(item.confidence),
          nutrients: {
            fat: food.fat * factor,
            protein: food.protein * factor,
            carbs: food.carbs * factor,
            calories: food.calories * factor
          }
        });
      });
      return {
        detectedItems,
        unknownItems,
        foods: detectedItems.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          grams: item.quantityGrams,
          fat: item.nutrients.fat,
          protein: item.nutrients.protein,
          carbs: item.nutrients.carbs,
          calories: item.nutrients.calories
        }))
      };
    }
  };

  const context = {
    AbortController,
    Blob,
    Uint8Array,
    URL,
    atob,
    clearTimeout,
    console,
    document: { baseURI: "https://pancreai.test/" },
    fetch: async () => { throw new Error("A foto não deve ser enviada pela rede."); },
    setTimeout
  };
  context.window = {
    Blob,
    Worker: function Worker() {},
    WebAssembly,
    PancreAIUtils: { ids: { createId: (prefix) => `${prefix}_${++idCounter}` } },
    PancreAIRecognition: { foodMatcher },
    PancreAIServices: { hiddenIngredientsService: { getDefaultSelections: () => [] } },
    clearTimeout,
    fetch: context.fetch,
    setTimeout
  };

  vm.runInNewContext(providerSource, context, { filename: "realMealRecognitionProvider.js" });
  return context.window.PancreAIServices.realMealRecognitionProvider;
}

test("provider usa IA no navegador sem endpoint nem chave", () => {
  const provider = createProvider();
  assert.equal(provider.execution, "browser");
  assert.equal(provider.modelId, "onnx-community/swin-finetuned-food101-ONNX");
  assert.equal(provider.isAvailable(), true);
  assert.equal("getEndpoint" in provider, false);
});

test("classificação Food-101 é convertida para o banco nutricional local", async () => {
  const provider = createProvider();
  provider._private.setClassifierForTests(async () => [
    { label: "spaghetti_bolognese", score: 0.92 },
    { label: "steak", score: 0.04 }
  ]);
  const progress = [];
  const result = await provider.analyze(
    new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }),
    { onProgress: (event) => progress.push(event.phase) }
  );

  assert.equal(result.provider, "transformersjs-food101");
  assert.equal(result.providerLabel, "IA local Food-101");
  assert.equal(result.isSimulated, false);
  assert.equal(result.foods[0].name, "Macarrão à bolonhesa");
  assert.equal(result.foods[0].grams, 220);
  assert.equal(result.foods[0].fat, 17.6);
  assert.equal(progress.includes("prepare"), true);
  assert.equal(progress.includes("inference"), true);
});

test("rótulo sem correspondência fica desconhecido em vez de inventar nutrientes", async () => {
  const provider = createProvider();
  provider._private.setClassifierForTests(async () => [
    { label: "apple_pie", score: 0.81 }
  ]);
  const result = await provider.analyze(
    new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" })
  );

  assert.equal(result.foods.length, 0);
  assert.equal(result.unknownItems.length, 1);
  assert.equal(result.unknownItems[0].label, "Apple pie");
  assert.equal(result.warnings.some((warning) => warning.includes("manualmente")), true);
});
