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
          unknownItems: [],
          possibleHiddenIngredients: [{ id: "oleo", relatedItem: "Arroz branco" }]
        }) }]
      }
    }]
  };
}

test("POST usa Gemini 3.5 Flash por padrão com chave apenas no header", async (t) => {
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
  assert.equal(response.body.providerLabel, "Gemini 3.5 Flash");
  assert.equal(response.body.isSimulated, false);
  assert.deepEqual(response.body.possibleHiddenIngredients, [
    { id: "oleo", relatedItem: "Arroz branco" }
  ]);
  assert.match(upstream.url, /\/models\/gemini-3\.5-flash:generateContent$/);
  assert.equal(upstream.options.method, "POST");
  assert.equal(upstream.options.headers["x-goog-api-key"], secret);
  assert.equal(upstream.options.headers.Authorization, undefined);
  assert.equal(upstream.options.body.includes(secret), false);
  const body = JSON.parse(upstream.options.body);
  assert.equal(body.contents[0].parts[1].inlineData.data, JPEG_BYTES.toString("base64"));
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.equal(body.generationConfig.responseJsonSchema.additionalProperties, false);
  assert.equal(body.generationConfig.responseJsonSchema.properties.possibleHiddenIngredients.maxItems, 4);
  assert.equal(body.generationConfig.responseJsonSchema.required.includes("possibleHiddenIngredients"), true);
  assert.deepEqual(body.generationConfig.thinkingConfig, { thinkingLevel: "minimal" });
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

test("após dois 503 no Gemini 3.5 avança e conclui no Gemini 3.1", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    if (urls.length <= 2) {
      return new Response(JSON.stringify({
        error: { status: "UNAVAILABLE", message: "Service temporarily unavailable" }
      }), { status: 503, headers: { "content-type": "application/json" } });
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
  assert.equal(response.body.providerLabel, "Gemini 3.1 Flash Lite");
  assert.equal(response.body.metadata.model, "gemini-3.1-flash-lite");
  assert.equal(urls.length, 3);
  assert.match(urls[0], /gemini-3\.5-flash:generateContent$/);
  assert.equal(urls[0], urls[1]);
  assert.match(urls[2], /gemini-3\.1-flash-lite:generateContent$/);
});

test("limita falhas transitórias persistentes a seis chamadas entre os modelos", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    return new Response(JSON.stringify({
      error: { status: "INTERNAL", message: "Temporary backend error" }
    }), { status: 500, headers: { "content-type": "application/json" } });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, "analysis_unavailable");
  assert.equal(urls.length, 6);
  assert.match(urls[0], /gemini-3\.5-flash:generateContent$/);
  assert.equal(urls[0], urls[1]);
  assert.match(urls[2], /gemini-3\.1-flash-lite:generateContent$/);
  assert.equal(urls[2], urls[3]);
  assert.match(urls[4], /gemini-2\.5-flash:generateContent$/);
  assert.match(urls[5], /gemini-2\.5-flash-lite:generateContent$/);
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
  assert.equal(handler._private.GEMINI_TRANSIENT_RETRY_LIMIT, 1);
  assert.equal(handler._private.GEMINI_TRANSIENT_RETRY_DELAY_MS, 800);
  assert.equal(handler._private.isTransientUpstreamFailure({ status: 503, providerCode: "UNAVAILABLE" }), true);
  assert.equal(handler._private.isTransientUpstreamFailure({ status: 429, providerCode: "RESOURCE_EXHAUSTED" }), false);
});
test("404 no Gemini 3.5 avança imediatamente para o Gemini 3.1", async (t) => {
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
  assert.equal(response.body.providerLabel, "Gemini 3.1 Flash Lite");
  assert.equal(response.body.metadata.model, "gemini-3.1-flash-lite");
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /gemini-3\.5-flash:generateContent$/);
  assert.match(calls[1].url, /gemini-3\.1-flash-lite:generateContent$/);
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

test("retorna erro após tentar exatamente os quatro modelos compatíveis", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
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
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 503);
  assert.equal(response.body.error.code, "analysis_model_unavailable");
  assert.equal(urls.length, 4);
  assert.match(urls[0], /gemini-3\.5-flash:generateContent$/);
  assert.match(urls[1], /gemini-3\.1-flash-lite:generateContent$/);
  assert.match(urls[2], /gemini-2\.5-flash:generateContent$/);
  assert.match(urls[3], /gemini-2\.5-flash-lite:generateContent$/);
});

test("429 não repete nem troca de modelo", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    return new Response(JSON.stringify({
      error: { status: "RESOURCE_EXHAUSTED", message: "Quota exceeded" }
    }), { status: 429, headers: { "content-type": "application/json" } });
  };
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  });

  const response = await runHandler(jsonRequest());
  assert.equal(response.status, 429);
  assert.equal(response.body.error.code, "analysis_rate_limited");
  assert.equal(urls.length, 1);
  assert.match(urls[0], /gemini-3\.5-flash:generateContent$/);
});
test("modelo de reserva repete uma vez após 503 antes de avançar", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    if (urls.length === 1) {
      return new Response(JSON.stringify({
        error: { status: "NOT_FOUND", message: "Model was not found" }
      }), { status: 404, headers: { "content-type": "application/json" } });
    }
    if (urls.length === 2) {
      return new Response(JSON.stringify({
        error: { status: "UNAVAILABLE", message: "Temporary capacity error" }
      }), { status: 503, headers: { "content-type": "application/json" } });
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
  assert.equal(response.body.metadata.model, "gemini-3.1-flash-lite");
  assert.equal(urls.length, 3);
  assert.match(urls[0], /gemini-3\.5-flash:generateContent$/);
  assert.match(urls[1], /gemini-3\.1-flash-lite:generateContent$/);
  assert.equal(urls[1], urls[2]);
});

test("configuração antiga ainda mantém os modelos atuais na lista de reserva", () => {
  assert.deepEqual(handler._private.modelCandidates("gemini-2.5-flash"), [
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite"
  ]);
});

test("falha temporária de conexão é repetida sem expor erro interno", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousFetch = global.fetch;
  process.env.GEMINI_API_KEY = "configured-test-key";
  delete process.env.GEMINI_MODEL;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    if (calls === 1) throw new TypeError("fetch failed: private network detail");
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
  assert.equal(calls, 2);
  assert.equal(response.body.providerLabel, "Gemini 3.5 Flash");
});
