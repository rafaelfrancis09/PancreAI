const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ApiError,
  MEAL_ANALYSIS_SCHEMA,
  RESPONSIBLE_ADULT_CONTEXT,
  createGeminiRequest,
  extractGeminiResponseText,
  normalizeAnalysis,
  parseJsonImagePayload,
  parseMultipartBuffer,
  readImageRequest
} = require("../../api/_lib/meal-analysis");

const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43]);

async function encodeMultipart(fields = {}) {
  const form = new FormData();
  form.append("image", new Blob([JPEG_BYTES], { type: "image/jpeg" }), "prato.jpg");
  form.append("locale", fields.locale || "pt-BR");
  form.append("usageContext", fields.usageContext || RESPONSIBLE_ADULT_CONTEXT);
  form.append("catalog", JSON.stringify(fields.catalog || [{ id: "arroz", name: "Arroz branco" }]));
  const request = new Request("https://pancreai.test/api/analyze-meal", { method: "POST", body: form });
  return {
    body: Buffer.from(await request.arrayBuffer()),
    contentType: request.headers.get("content-type")
  };
}

test("JSON e multipart preservam imagem, catálogo e contexto de uso adulto", async () => {
  const json = parseJsonImagePayload({
    image: `data:image/jpeg;base64,${JPEG_BYTES.toString("base64")}`,
    locale: "pt-BR",
    usageContext: RESPONSIBLE_ADULT_CONTEXT,
    catalog: [{ id: "arroz", name: "Arroz branco" }]
  });
  assert.equal(json.mimeType, "image/jpeg");
  assert.deepEqual(json.buffer, JPEG_BYTES);
  assert.equal(json.usageContext, "responsible_adult");
  assert.deepEqual(json.catalog, [{ id: "arroz", name: "Arroz branco" }]);

  const encoded = await encodeMultipart({ locale: "en", usageContext: "responsible_adult" });
  const multipart = await parseMultipartBuffer(encoded.body, encoded.contentType);
  assert.equal(multipart.mimeType, "image/jpeg");
  assert.deepEqual(multipart.buffer, JPEG_BYTES);
  assert.equal(multipart.locale, "en");
  assert.equal(multipart.usageContext, "responsible_adult");
  assert.deepEqual(multipart.catalog, [{ id: "arroz", name: "Arroz branco" }]);
});

test("JSON malformado é tratado como erro de entrada", async () => {
  const request = {
    headers: { "content-type": "application/json" },
    get body() {
      throw new SyntaxError("JSON malformado");
    }
  };

  await assert.rejects(
    () => readImageRequest(request),
    (error) => error instanceof ApiError && error.status === 400 && error.code === "invalid_json"
  );
});

test("requisição Gemini usa inlineData Base64 e saída JSON estruturada", () => {
  const request = createGeminiRequest({
    image: { buffer: JPEG_BYTES, mimeType: "image/jpeg" },
    locale: "pt-BR",
    catalog: [{ id: "arroz", name: "Arroz branco" }]
  });

  const parts = request.contents[0].parts;
  assert.equal(parts[1].inlineData.mimeType, "image/jpeg");
  assert.equal(parts[1].inlineData.data, JPEG_BYTES.toString("base64"));
  assert.match(parts[0].text, /Arroz branco/);
  assert.equal(request.generationConfig.responseMimeType, "application/json");
  assert.deepEqual(request.generationConfig.responseJsonSchema, MEAL_ANALYSIS_SCHEMA);
  assert.equal(request.generationConfig.responseJsonSchema.additionalProperties, false);
  assert.match(request.systemInstruction.parts[0].text, /não (?:calcule|faça)/i);
});

test("extrai texto dos candidates e rejeita bloqueios ou resposta truncada", () => {
  assert.equal(extractGeminiResponseText({
    candidates: [{ finishReason: "STOP", content: { parts: [{ text: "{\"mealName\":" }, { text: "\"Prato\"}" }] } }]
  }), '{"mealName":"Prato"}');

  assert.throws(
    () => extractGeminiResponseText({ promptFeedback: { blockReason: "SAFETY" } }),
    (error) => error instanceof ApiError && error.status === 422 && error.code === "analysis_refused"
  );
  assert.throws(
    () => extractGeminiResponseText({ candidates: [{ finishReason: "MAX_TOKENS", content: { parts: [{ text: "{}" }] } }] }),
    (error) => error instanceof ApiError && error.status === 502 && error.code === "incomplete_analysis"
  );
  assert.throws(
    () => extractGeminiResponseText({ candidates: [{ finishReason: "SAFETY", content: { parts: [] } }] }),
    (error) => error instanceof ApiError && error.code === "analysis_refused"
  );
});

test("normalizador identifica Gemini, aplica catálogo e descarta dados clínicos", () => {
  let id = 0;
  const result = normalizeAnalysis({
    mealName: "Arroz com acompanhamento",
    category: "Almoço",
    confidence: 91,
    photoQuality: { level: "good" },
    detectedItems: [
      { name: "arroz branco", quantityGrams: 120, confidence: 94 },
      { name: "Comida inventada", quantityGrams: 80, confidence: 40 }
    ],
    warnings: [
      "Parte do prato está encoberta.",
      "Dose de lipase sugerida: 20.000 unidades.",
      "Calorias estimadas: 400."
    ],
    unknownItems: [{ label: "Molho não identificado", confidence: 36 }],
    dose: 20000,
    nutrients: { fat: 30 }
  }, [{ id: "arroz", name: "Arroz branco" }], () => `id${++id}`);

  assert.equal(result.provider, "gemini");
  assert.equal(result.providerLabel, "Gemini 2.5 Flash");
  assert.equal(result.isSimulated, false);
  assert.deepEqual(result.detectedItems, [{ name: "Arroz branco", quantityGrams: 120, confidence: 94 }]);
  assert.equal(result.unknownItems.some((item) => item.label === "Comida inventada"), true);
  assert.equal(result.unknownItems.some((item) => item.label === "Molho não identificado"), true);
  assert.equal(result.warnings.includes("Parte do prato está encoberta."), true);
  assert.equal(result.warnings.some((warning) => /lipase|caloria/i.test(warning)), false);
  assert.equal("dose" in result, false);
  assert.equal("nutrients" in result, false);
  assert.equal(result.packaging, null);
});

test("normalizador limita a revisão a doze itens sem perda silenciosa no frontend", () => {
  let id = 0;
  const result = normalizeAnalysis({
    mealName: "Prato complexo",
    category: "Refeição",
    confidence: 80,
    photoQuality: { level: "good" },
    detectedItems: Array.from({ length: 12 }, (_, index) => ({
      name: `Alimento ${index + 1}`,
      quantityGrams: 50,
      confidence: 80
    })),
    warnings: [],
    unknownItems: Array.from({ length: 12 }, (_, index) => ({
      label: `Item incerto ${index + 1}`,
      confidence: 40
    }))
  }, [], () => `limit${++id}`);

  assert.equal(result.detectedItems.length + result.unknownItems.length, 12);
});
