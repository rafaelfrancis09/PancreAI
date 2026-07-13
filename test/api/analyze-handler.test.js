const test = require("node:test");
const assert = require("node:assert/strict");

const handler = require("../../api/analyze-meal");

const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43]);
let requestCounter = 0;

function jsonRequest(overrides = {}) {
  requestCounter += 1;
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${requestCounter}`
    },
    body: {
      image: `data:image/jpeg;base64,${JPEG_BYTES.toString("base64")}`,
      locale: "pt-BR",
      usageContext: "responsible_adult",
      catalog: [{ id: "arroz", name: "Arroz branco" }],
      ...overrides
    }
  };
}

function runHandler(req) {
  const headers = {};
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      removeHeader(name) { delete headers[name.toLowerCase()]; },
      end(body = "") {
        try {
          resolve({ status: this.statusCode, headers, body: body ? JSON.parse(body) : null });
        } catch (error) {
          reject(error);
        }
      }
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

function geminiPayload() {
  return {
    candidates: [{
      finishReason: "STOP",
      content: {
        parts: [{ text: JSON.stringify({
          mealName: "Arroz",
          category: "Almoço",
          confidence: 92,
          photoQuality: { level: "good" },
          detectedItems: [{ name: "Arroz branco", quantityGrams: 120, confidence: 93 }],
          warnings: [],
          unknownItems: []
        }) }]
      }
    }]
  };
}

test("POST chama Gemini 2.5 Flash com chave apenas no header", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  const secret = "test-secret-must-never-be-in-body";
  process.env.GEMINI_API_KEY = secret;
  delete process.env.GEMINI_MODEL;
  let upstream;
  global.fetch = async (url, options) => {
    upstream = { url: String(url), options };
    return new Response(JSON.stringify(geminiPayload()), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 200);
  assert.equal(response.body.provider, "gemini");
  assert.equal(response.body.providerLabel, "Gemini 2.5 Flash");
  assert.equal(response.body.isSimulated, false);
  assert.match(upstream.url, /\/models\/gemini-2\.5-flash:generateContent$/);
  assert.equal(upstream.options.method, "POST");
  assert.equal(upstream.options.headers["x-goog-api-key"], secret);
  assert.equal(upstream.options.headers.Authorization, undefined);
  assert.equal(upstream.options.body.includes(secret), false);
  const body = JSON.parse(upstream.options.body);
  assert.equal(body.contents[0].parts[1].inlineData.data, JPEG_BYTES.toString("base64"));
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.equal(body.generationConfig.responseJsonSchema.additionalProperties, false);
});

test("sem GEMINI_API_KEY responde configuração ausente sem chamar a rede", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = global.fetch;
  delete process.env.GEMINI_API_KEY;
  global.fetch = async () => { throw new Error("não deveria chamar Gemini"); };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, "service_not_configured");
  assert.equal(JSON.stringify(response.body).includes("GEMINI_API_KEY"), false);
});

test("contexto de responsável adulto é obrigatório antes de enviar imagem à IA", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  let called = false;
  global.fetch = async () => { called = true; throw new Error("não deveria chamar Gemini"); };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  const response = await runHandler(jsonRequest({ usageContext: "" }));
  assert.equal(response.status, 403);
  assert.equal(response.body.error.code, "adult_context_required");
  assert.equal(called, false);
});

test("CORS bloqueia origem não autorizada antes da análise", async (t) => {
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = "https://allowed.example";
  t.after(() => {
    if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previousOrigins;
  });

  const request = jsonRequest();
  request.headers.origin = "https://blocked.example";
  const response = await runHandler(request);
  assert.equal(response.status, 403);
  assert.equal(response.body.error.code, "origin_not_allowed");
  assert.equal(response.headers["access-control-allow-origin"], undefined);
});

test("preflight CORS autoriza somente a origem configurada", async (t) => {
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = "https://allowed.example";
  t.after(() => {
    if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previousOrigins;
  });

  const response = await runHandler({
    method: "OPTIONS",
    headers: { origin: "https://allowed.example" }
  });
  assert.equal(response.status, 204);
  assert.equal(response.body, null);
  assert.equal(response.headers["access-control-allow-origin"], "https://allowed.example");
  assert.match(response.headers["access-control-allow-methods"], /POST/);
});

test("métodos inválidos não iniciam uma análise", async () => {
  const response = await runHandler({ method: "GET", headers: {} });
  assert.equal(response.status, 405);
  assert.equal(response.body.error.code, "method_not_allowed");
  assert.match(response.headers.allow, /POST/);
});
test("repete uma vez sem schema quando o Gemini rejeita responseJsonSchema", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  const requests = [];
  global.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    if (requests.length === 1) {
      return new Response(JSON.stringify({
        error: {
          status: "INVALID_ARGUMENT",
          message: "Invalid responseJsonSchema: schema is not supported"
        }
      }), { status: 400, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify(geminiPayload()), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 200);
  assert.equal(requests.length, 2);
  assert.equal(Object.hasOwn(requests[0].generationConfig, "responseJsonSchema"), true);
  assert.equal(Object.hasOwn(requests[1].generationConfig, "responseJsonSchema"), false);
  assert.equal(requests[1].generationConfig.responseMimeType, "application/json");
});

test("classifica credencial e modelo inválidos sem vazar a mensagem externa", () => {
  const credentials = handler._private.upstreamError({
    status: 400,
    providerCode: "INVALID_ARGUMENT",
    providerMessage: "API key not valid: secret-value"
  });
  assert.equal(credentials.status, 503);
  assert.equal(credentials.code, "analysis_credentials_invalid");
  assert.equal(credentials.message.includes("secret-value"), false);

  const model = handler._private.upstreamError({
    status: 404,
    providerCode: "NOT_FOUND",
    providerMessage: "models/wrong not found"
  });
  assert.equal(model.status, 503);
  assert.equal(model.code, "analysis_model_unavailable");
  assert.equal(handler._private.GEMINI_TIMEOUT_MS, 50000);
});
test("usa Gemini 2.5 Flash Lite quando o modelo principal não está disponível", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), signal: options.signal });
    if (calls.length === 1) {
      return new Response(JSON.stringify({
        error: { status: "NOT_FOUND", message: "Model was not found" }
      }), { status: 404, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify(geminiPayload()), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 200);
  assert.equal(response.body.providerLabel, "Gemini 2.5 Flash Lite");
  assert.equal(response.body.metadata.model, "gemini-2.5-flash-lite");
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /gemini-2\.5-flash:generateContent$/);
  assert.match(calls[1].url, /gemini-2\.5-flash-lite:generateContent$/);
  assert.equal(calls[0].signal, calls[1].signal);
});

test("não troca de modelo quando a chave do Gemini é inválida", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "invalid-test-key";
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({
      error: { status: "INVALID_ARGUMENT", message: "API key not valid" }
    }), { status: 400, headers: { "content-type": "application/json" } });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, "analysis_credentials_invalid");
  assert.equal(calls, 1);
});

test("retorna erro após tentar exatamente os dois modelos compatíveis", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    return new Response(JSON.stringify({
      error: { status: "NOT_FOUND", message: "Model was not found" }
    }), { status: 404, headers: { "content-type": "application/json" } });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, "analysis_model_unavailable");
  assert.equal(urls.length, 2);
});