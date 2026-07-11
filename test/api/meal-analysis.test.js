const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ApiError,
  MAX_CATALOG_ITEMS,
  MAX_IMAGE_BYTES,
  createOpenAIRequest,
  extractResponseText,
  isOriginAllowed,
  normalizeAnalysis,
  parseAllowedOrigins,
  parseCatalog,
  parseDataUrl,
  parseJsonImagePayload,
  parseMultipartBuffer,
  validateImageBuffer
} = require("../../api/_lib/meal-analysis");

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const jpegDataUrl = `data:image/jpeg;base64,${jpeg.toString("base64")}`;

function expectApiError(fn, code) {
  assert.throws(fn, (error) => error instanceof ApiError && error.code === code);
}

test("CORS aceita apenas origens configuradas e normalizadas", () => {
  const allowed = parseAllowedOrigins("https://rafaelfrancis09.github.io/PancreAI, http://localhost:8017, arquivo-invalido");
  assert.equal(allowed.has("https://rafaelfrancis09.github.io"), true);
  assert.equal(isOriginAllowed("https://rafaelfrancis09.github.io", allowed), true);
  assert.equal(isOriginAllowed("http://localhost:8017", allowed), true);
  assert.equal(isOriginAllowed("https://exemplo.com", allowed), false);
  assert.equal(isOriginAllowed("origem inválida", allowed), false);
  assert.equal(isOriginAllowed("", allowed), true);
});

test("CORS permite wildcard somente quando configurado explicitamente", () => {
  assert.equal(isOriginAllowed("https://qualquer.example", parseAllowedOrigins("*")), true);
});

test("Data URL JPEG válida é normalizada", () => {
  const image = parseDataUrl(jpegDataUrl);
  assert.equal(image.mimeType, "image/jpeg");
  assert.deepEqual(image.buffer, jpeg);
  assert.equal(image.dataUrl, jpegDataUrl);
});

test("Base64 inválido e MIME forjado são rejeitados", () => {
  expectApiError(() => parseDataUrl("data:image/jpeg;base64,%%%="), "invalid_image");
  expectApiError(() => validateImageBuffer(jpeg, "image/png"), "invalid_image");
  expectApiError(() => validateImageBuffer(jpeg, "image/gif"), "unsupported_image_type");
});

test("imagem acima de 3 MB é rejeitada antes do envio", () => {
  const oversized = Buffer.alloc(MAX_IMAGE_BYTES + 1);
  jpeg.copy(oversized, 0, 0, 3);
  expectApiError(() => validateImageBuffer(oversized, "image/jpeg"), "image_too_large");
});

test("payload JSON aceita Data URL, catálogo e locale", () => {
  const parsed = parseJsonImagePayload({
    image: jpegDataUrl,
    locale: "pt-BR",
    catalog: [{ id: "arroz", name: "Arroz branco" }]
  });
  assert.equal(parsed.mimeType, "image/jpeg");
  assert.equal(parsed.locale, "pt-BR");
  assert.deepEqual(parsed.catalog, [{ id: "arroz", name: "Arroz branco" }]);
});

test("catálogo é limitado, limpo e sem nomes duplicados", () => {
  assert.deepEqual(parseCatalog([
    { id: "  arroz  ", name: "  Arroz branco  " },
    { id: "outro", name: "arroz branco" },
    { id: "sem_nome" },
    null
  ]), [{ id: "arroz", name: "Arroz branco" }]);

  const tooLarge = Array.from({ length: MAX_CATALOG_ITEMS + 1 }, (_, index) => ({ id: String(index), name: `Alimento ${index}` }));
  expectApiError(() => parseCatalog(tooLarge), "catalog_too_large");
  expectApiError(() => parseCatalog("não é json"), "invalid_catalog");
});

test("multipart aceita image, catalog e locale sem biblioteca externa", async () => {
  const form = new FormData();
  form.set("image", new Blob([jpeg], { type: "image/jpeg" }), "refeicao.jpg");
  form.set("catalog", JSON.stringify([{ id: "feijao", name: "Feijão preto" }]));
  form.set("locale", "pt-BR");
  const request = new Request("http://localhost/api/analyze-meal", { method: "POST", body: form });
  const body = Buffer.from(await request.arrayBuffer());
  const parsed = await parseMultipartBuffer(body, request.headers.get("content-type"));
  assert.equal(parsed.mimeType, "image/jpeg");
  assert.deepEqual(parsed.catalog, [{ id: "feijao", name: "Feijão preto" }]);
  assert.equal(parsed.locale, "pt-BR");
});

test("requisição OpenAI usa Responses, visão e Structured Outputs estritos", () => {
  const request = createOpenAIRequest({
    model: "modelo-de-teste",
    dataUrl: jpegDataUrl,
    locale: "pt-BR",
    catalog: [{ id: "arroz", name: "Arroz branco" }]
  });
  assert.equal(request.model, "modelo-de-teste");
  assert.equal(request.store, false);
  assert.equal(request.input[1].content[1].type, "input_image");
  assert.equal(request.input[1].content[1].image_url, jpegDataUrl);
  assert.equal(request.text.format.type, "json_schema");
  assert.equal(request.text.format.strict, true);
  assert.equal(request.text.format.schema.additionalProperties, false);
  assert.deepEqual(Object.keys(request.text.format.schema.properties).sort(), [
    "category", "confidence", "detectedItems", "mealName", "photoQuality", "unknownItems", "warnings"
  ]);
  assert.match(request.input[1].content[0].text, /Arroz branco/);
});

test("texto é extraído da resposta REST e recusas são tratadas", () => {
  const text = extractResponseText({
    output: [{ type: "message", content: [{ type: "output_text", text: "{\"ok\":true}" }] }]
  });
  assert.equal(text, "{\"ok\":true}");
  expectApiError(() => extractResponseText({ output: [{ content: [{ type: "refusal", refusal: "não" }] }] }), "analysis_refused");
  expectApiError(() => extractResponseText({ status: "incomplete", output: [] }), "incomplete_analysis");
});

test("normalizador impõe catálogo, combina duplicatas e remove conteúdo clínico", () => {
  let id = 0;
  const result = normalizeAnalysis({
    mealName: "Prato feito",
    category: "Almoço",
    confidence: 106,
    photoQuality: { level: "good" },
    detectedItems: [
      { name: "arroz branco", quantityGrams: 100, confidence: 88 },
      { name: "ARROZ BRANCO", quantityGrams: 50, confidence: 92 },
      { name: "Molho especial", quantityGrams: 20, confidence: 45 }
    ],
    warnings: ["Imagem parcialmente cortada", "A dose seria incerta", "Estimated fat is uncertain"],
    unknownItems: [{ label: "Folha desconhecida", confidence: -5 }]
  }, [{ id: "arroz", name: "Arroz branco" }], () => String(++id));

  assert.equal(result.provider, "openai");
  assert.equal(result.isSimulated, false);
  assert.equal(result.confidence, 100);
  assert.deepEqual(result.detectedItems, [{ name: "Arroz branco", quantityGrams: 150, confidence: 92 }]);
  assert.equal(result.unknownItems.length, 2);
  assert.equal(result.unknownItems[0].label, "Molho especial");
  assert.equal(result.unknownItems[1].confidence, 0);
  assert.equal(result.warnings.includes("A dose seria incerta"), false);
  assert.equal(result.warnings.includes("Estimated fat is uncertain"), false);
  assert.equal(result.warnings.includes("Imagem parcialmente cortada"), true);
  assert.equal(result.packaging, null);
  assert.deepEqual(Object.keys(result.detectedItems[0]).sort(), ["confidence", "name", "quantityGrams"]);
});

test("análise sem alimento confirmado não pode manter confiança alta", () => {
  const result = normalizeAnalysis({
    mealName: "",
    category: "",
    confidence: 99,
    photoQuality: { level: "low" },
    detectedItems: [],
    warnings: [],
    unknownItems: []
  }, [], () => "id");
  assert.equal(result.confidence, 40);
  assert.equal(result.mealName, "Refeição não identificada");
  assert.equal(result.photoQuality.level, "low");
});
