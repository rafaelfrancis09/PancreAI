const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const providerSource = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "services", "recognition", "realMealRecognitionProvider.js"),
  "utf8"
);

function createProvider(fetchImplementation = global.fetch) {
  let idCounter = 0;
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
      const detectedItems = items.map((item) => ({
        foodId: "arroz_branco",
        name: "Arroz branco",
        originalName: item.name,
        quantityGrams: Number(item.quantityGrams),
        confidence: Number(item.confidence),
        nutrients: { fat: 0.4, protein: 3, carbs: 34, calories: 156 }
      }));
      return {
        detectedItems,
        unknownItems: [],
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
    FormData,
    Response,
    Uint8Array,
    URL,
    atob,
    clearTimeout,
    console,
    document: {
      querySelector(selector) {
        assert.equal(selector, 'meta[name="pancreai-analysis-endpoint"]');
        return { getAttribute: () => "https://api.pancreai.test/api/analyze-meal" };
      }
    },
    fetch: fetchImplementation,
    setTimeout
  };
  context.window = {
    Blob,
    FormData,
    PancreAIUtils: { ids: { createId: (prefix) => `${prefix}_${++idCounter}` } },
    PancreAIRecognition: { foodMatcher },
    PancreAIData: {
      nutritionDatabase: { foods: [{ id: "arroz_branco", name: "Arroz branco" }] }
    },
    PancreAIServices: {
      hiddenIngredientsService: { getDefaultSelections: () => [] }
    },
    clearTimeout,
    fetch: fetchImplementation,
    setTimeout
  };

  vm.runInNewContext(providerSource, context, { filename: "realMealRecognitionProvider.js" });
  return context.window.PancreAIServices.realMealRecognitionProvider;
}

test("provider lê o endpoint público configurável sem expor segredo", () => {
  const provider = createProvider();
  assert.equal(provider.getEndpoint(), "https://api.pancreai.test/api/analyze-meal");
});

test("provider envia imagem e catálogo e normaliza o resultado para o banco local", async () => {
  let requestedUrl;
  let submittedCatalog;
  const provider = createProvider(async (url, options) => {
    requestedUrl = url;
    submittedCatalog = JSON.parse(options.body.get("catalog"));
    assert.equal(options.method, "POST");
    assert.equal(options.body.get("locale"), "pt-BR");
    assert.equal(options.body.get("image") instanceof Blob, true);
    return new Response(JSON.stringify({
      id: "analysis_1",
      provider: "openai",
      providerLabel: "OpenAI Vision",
      isSimulated: false,
      mealName: "Arroz",
      category: "Almoço",
      confidence: 91,
      photoQuality: { level: "good", label: "Foto boa" },
      detectedItems: [{ name: "Arroz branco", quantityGrams: 120, confidence: 94 }],
      warnings: [],
      unknownItems: []
    }), { status: 200, headers: { "content-type": "application/json" } });
  });

  const result = await provider.analyze(new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }), {
    locale: "pt-BR"
  });

  assert.equal(requestedUrl, "https://api.pancreai.test/api/analyze-meal");
  assert.deepEqual(submittedCatalog, [{ id: "arroz_branco", name: "Arroz branco" }]);
  assert.equal(result.isSimulated, false);
  assert.equal(result.foods[0].name, "Arroz branco");
  assert.equal(result.foods[0].fat, 0.4);
});

test("provider não exibe HTML devolvido por um endpoint configurado incorretamente", async () => {
  const provider = createProvider();
  const response = new Response("<html><body>not found</body></html>", {
    status: 404,
    headers: { "content-type": "text/html" }
  });

  await assert.rejects(
    () => provider._private.parseResponse(response),
    (error) => error?.code === "HTTP_404" &&
      error?.message.includes("configuração da hospedagem") &&
      !error?.message.includes("<html>")
  );
});
