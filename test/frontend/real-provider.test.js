const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const providerSource = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "services", "recognition", "realMealRecognitionProvider.js"),
  "utf8"
);

function createProvider(fetchImpl, metaEndpoint = "/api/analyze-meal") {
  let idCounter = 0;
  const catalog = {
    "Arroz branco": { id: "arroz", fat: 0.3, protein: 2.5, carbs: 28, calories: 130 },
    "Feijão carioca": { id: "feijao", fat: 0.5, protein: 4.8, carbs: 14, calories: 80 }
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
      for (const item of items) {
        const food = catalog[item.name];
        if (!food) {
          unknownItems.push({ label: item.name, confidence: item.confidence, quantityGrams: item.quantityGrams });
          continue;
        }
        const grams = Number(item.quantityGrams);
        const factor = grams / 100;
        detectedItems.push({
          foodId: food.id,
          name: item.name,
          originalName: item.name,
          quantityGrams: grams,
          confidence: Number(item.confidence),
          nutrients: {
            fat: food.fat * factor,
            protein: food.protein * factor,
            carbs: food.carbs * factor,
            calories: food.calories * factor
          }
        });
      }
      return {
        detectedItems,
        unknownItems,
        foods: detectedItems.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          grams: item.quantityGrams,
          ...item.nutrients
        }))
      };
    }
  };

  const document = {
    baseURI: "https://pancreai.test/",
    documentElement: { lang: "pt-BR" },
    querySelector(selector) {
      if (selector === 'meta[name="pancreai-analysis-endpoint"]') {
        return { getAttribute: () => metaEndpoint };
      }
      return null;
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
    document,
    fetch: fetchImpl,
    setTimeout
  };
  context.window = {
    Blob,
    FormData,
    PancreAIConfig: {},
    PancreAIData: { nutritionDatabase: { foods: Object.entries(catalog).map(([name, food]) => ({ id: food.id, name })) } },
    PancreAIUtils: { ids: { createId: (prefix) => `${prefix}_${++idCounter}` } },
    PancreAIRecognition: { foodMatcher },
    PancreAIServices: { hiddenIngredientsService: { getDefaultSelections: () => [] } },
    clearTimeout,
    fetch: fetchImpl,
    setTimeout
  };

  vm.runInNewContext(providerSource, context, { filename: "realMealRecognitionProvider.js" });
  return context.window.PancreAIServices.realMealRecognitionProvider;
}

function successfulPayload() {
  return {
    provider: "gemini",
    providerLabel: "Gemini 2.5 Flash",
    isSimulated: false,
    mealName: "Arroz e feijão",
    category: "Almoço",
    confidence: 91,
    photoQuality: { label: "Foto boa", level: "good", message: "Imagem nítida." },
    detectedItems: [
      { name: "Arroz branco", quantityGrams: 120, confidence: 94 },
      { name: "Feijão carioca", quantityGrams: 80, confidence: 88 }
    ],
    warnings: ["Confirme as porções."],
    unknownItems: []
  };
}

test("provider envia multipart ao endpoint configurado com contexto adulto e catálogo", async () => {
  let call;
  const provider = createProvider(async (url, options) => {
    call = { url, options };
    return new Response(JSON.stringify(successfulPayload()), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }, "https://api.pancreai.test/api/analyze-meal");

  const result = await provider.analyze(
    new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }),
    { locale: "pt-BR", usageContext: "responsible_adult" }
  );

  assert.equal(call.url, "https://api.pancreai.test/api/analyze-meal");
  assert.equal(call.options.method, "POST");
  assert.equal(call.options.headers.Accept, "application/json");
  assert.equal(call.options.headers["Content-Type"], undefined);
  assert.equal(call.options.body instanceof FormData, true);
  assert.equal(call.options.body.get("usageContext"), "responsible_adult");
  assert.equal(call.options.body.get("locale"), "pt-BR");
  assert.deepEqual(JSON.parse(call.options.body.get("catalog")), [
    { id: "arroz", name: "Arroz branco" },
    { id: "feijao", name: "Feijão carioca" }
  ]);
  assert.equal(call.options.body.get("image").type, "image/jpeg");
  assert.equal(result.provider, "gemini");
  assert.equal(result.providerLabel, "Gemini 2.5 Flash");
  assert.equal(result.isSimulated, false);
  assert.equal(result.foods.length, 2);
  assert.equal(result.foods[0].name, "Arroz branco");
  assert.equal(result.foods[0].grams, 120);
  assert.equal(result.foods[0].fat, 0.36);
  assert.equal(provider.getEndpoint(), "https://api.pancreai.test/api/analyze-meal");
  assert.equal(provider.isAvailable(), true);
});

test("provider exige confirmação do responsável antes de enviar a foto", async () => {
  let called = false;
  const provider = createProvider(async () => {
    called = true;
    throw new Error("não deveria chamar o backend");
  });

  await assert.rejects(
    () => provider.analyze(new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" })),
    (error) => error.code === "ADULT_CONSENT_REQUIRED" && error.status === 403
  );
  assert.equal(called, false);
});

test("endpoint pode ser sobrescrito sem colocar chave Gemini no navegador", async () => {
  let calledUrl;
  const provider = createProvider(async (url) => {
    calledUrl = url;
    return new Response(JSON.stringify(successfulPayload()), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  });
  provider.setEndpoint("https://functions.example.test/analyze");
  await provider.analyze(
    new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }),
    { usageContext: "responsible_adult" }
  );
  assert.equal(calledUrl, "https://functions.example.test/analyze");
  assert.equal(/GEMINI_API_KEY|x-goog-api-key/.test(providerSource), false);
});

test("erro HTML 404 vira mensagem segura e não vaza a página da hospedagem", async () => {
  const provider = createProvider(async () => new Response(
    "<html><body>SECRET HOSTING ERROR</body></html>",
    { status: 404, headers: { "content-type": "text/html" } }
  ));

  await assert.rejects(
    () => provider.analyze(
      new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }),
      { usageContext: "responsible_adult" }
    ),
    (error) => {
      assert.equal(error.code, "HTTP_404");
      assert.equal(error.status, 404);
      assert.match(error.message, /serviço de análise não foi encontrado/i);
      assert.equal(error.message.includes("SECRET HOSTING ERROR"), false);
      return true;
    }
  );
});

test("erro JSON do backend preserva apenas código próprio e mensagem segura", async () => {
  const provider = createProvider(async () => new Response(JSON.stringify({
    error: { code: "analysis_rate_limited", message: "Tente novamente em instantes." }
  }), { status: 429, headers: { "content-type": "application/json" } }));

  await assert.rejects(
    () => provider.analyze(
      new Blob([Buffer.from([0xff, 0xd8, 0xff])], { type: "image/jpeg" }),
      { usageContext: "responsible_adult" }
    ),
    (error) => error.code === "analysis_rate_limited" && error.status === 429 && /limite gratuito/i.test(error.message)
  );
});
