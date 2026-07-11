const test = require("node:test");
const assert = require("node:assert/strict");

const handler = require("../../api/analyze-meal");

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

function createResponse() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: "",
    setHeader(name, value) { headers.set(String(name).toLowerCase(), String(value)); },
    removeHeader(name) { headers.delete(String(name).toLowerCase()); },
    getHeader(name) { return headers.get(String(name).toLowerCase()); },
    end(value = "") { this.body = String(value); return this; }
  };
}

async function multipartRequest() {
  const form = new FormData();
  form.set("image", new Blob([jpeg], { type: "image/jpeg" }), "refeicao.jpg");
  form.set("locale", "pt-BR");
  form.set("catalog", JSON.stringify([
    { id: "arroz_branco", name: "Arroz branco" },
    { id: "feijao_preto", name: "Feijão preto" }
  ]));
  const webRequest = new Request("https://pancreai.test/api/analyze-meal", { method: "POST", body: form });
  return {
    method: "POST",
    headers: {
      origin: "https://rafaelfrancis09.github.io",
      host: "pancreai.test",
      "content-type": webRequest.headers.get("content-type"),
      "x-forwarded-for": `198.51.100.${Date.now() % 200}`
    },
    body: Buffer.from(await webRequest.arrayBuffer())
  };
}

test("handler completo analisa multipart e devolve somente visão", async () => {
  const previous = {
    key: process.env.OPENAI_API_KEY,
    origins: process.env.ALLOWED_ORIGINS,
    model: process.env.OPENAI_MODEL
  };
  process.env.OPENAI_API_KEY = "test-key";
  process.env.ALLOWED_ORIGINS = "https://rafaelfrancis09.github.io";
  process.env.OPENAI_MODEL = "test-vision-model";

  const originalFetch = global.fetch;
  let upstreamBody;
  global.fetch = async (_url, options) => {
    upstreamBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      output: [{
        type: "message",
        content: [{
          type: "output_text",
          text: JSON.stringify({
            mealName: "Arroz e feijão",
            category: "Almoço",
            confidence: 89,
            photoQuality: { level: "good" },
            detectedItems: [
              { name: "Arroz branco", quantityGrams: 120, confidence: 93 },
              { name: "Feijão preto", quantityGrams: 90, confidence: 87 }
            ],
            warnings: [],
            unknownItems: []
          })
        }]
      }]
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const req = await multipartRequest();
    const res = createResponse();
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    const result = JSON.parse(res.body);
    assert.equal(result.provider, "openai");
    assert.equal(result.isSimulated, false);
    assert.equal(result.detectedItems.length, 2);
    assert.equal(result.detectedItems[0].name, "Arroz branco");
    assert.equal("fat" in result.detectedItems[0], false);
    assert.equal("dose" in result, false);
    assert.equal(upstreamBody.model, "test-vision-model");
    assert.equal(upstreamBody.store, false);
    assert.equal(upstreamBody.input[1].content[1].type, "input_image");
    assert.equal(upstreamBody.text.format.strict, true);
  } finally {
    global.fetch = originalFetch;
    if (previous.key == null) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previous.key;
    if (previous.origins == null) delete process.env.ALLOWED_ORIGINS; else process.env.ALLOWED_ORIGINS = previous.origins;
    if (previous.model == null) delete process.env.OPENAI_MODEL; else process.env.OPENAI_MODEL = previous.model;
  }
});

test("handler informa quando a chave ainda não foi configurada", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  delete process.env.OPENAI_API_KEY;
  process.env.ALLOWED_ORIGINS = "https://rafaelfrancis09.github.io";
  const req = await multipartRequest();
  const res = createResponse();
  await handler(req, res);
  assert.equal(res.statusCode, 503);
  assert.equal(JSON.parse(res.body).error.code, "service_not_configured");
  if (previousKey != null) process.env.OPENAI_API_KEY = previousKey;
  if (previousOrigins == null) delete process.env.ALLOWED_ORIGINS; else process.env.ALLOWED_ORIGINS = previousOrigins;
});
