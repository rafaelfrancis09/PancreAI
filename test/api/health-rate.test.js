const test = require("node:test");
const assert = require("node:assert/strict");

const healthHandler = require("../../api/health");
const analyzeHandler = require("../../api/analyze-meal");

function runHealth(method = "GET") {
  const headers = {};
  return new Promise((resolve) => {
    const res = {
      statusCode: 0,
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      removeHeader(name) { delete headers[name.toLowerCase()]; },
      end(body = "") { resolve({ status: this.statusCode, headers, body: body ? JSON.parse(body) : null }); }
    };
    healthHandler({ method, headers: {} }, res);
  });
}

test("health só fica pronto quando GEMINI_API_KEY está configurada e não expõe a chave", async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  t.after(() => {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });

  delete process.env.GEMINI_API_KEY;
  const missing = await runHealth();
  assert.equal(missing.status, 503);
  assert.equal(missing.body.ok, false);
  assert.equal(missing.body.configured, false);

  process.env.GEMINI_API_KEY = "health-secret-value";
  const configured = await runHealth();
  assert.equal(configured.status, 200);
  assert.equal(configured.body.ok, true);
  assert.equal(configured.body.configured, true);
  assert.equal(configured.body.provider, "gemini");
  assert.equal(configured.body.service, "pancreai-gemini-vision");
  assert.equal(JSON.stringify(configured.body).includes("health-secret-value"), false);
});

test("rate limit bloqueia excesso por endereço sem depender da chamada externa", (t) => {
  const previousMaximum = process.env.MAX_REQUESTS_PER_MINUTE;
  process.env.MAX_REQUESTS_PER_MINUTE = "1";
  t.after(() => {
    if (previousMaximum === undefined) delete process.env.MAX_REQUESTS_PER_MINUTE;
    else process.env.MAX_REQUESTS_PER_MINUTE = previousMaximum;
  });
  const request = { headers: { "x-forwarded-for": `203.0.113.${Date.now() % 200}` } };
  assert.deepEqual(analyzeHandler._private.enforceRateLimit(request, 1000), { remaining: 0 });
  assert.throws(
    () => analyzeHandler._private.enforceRateLimit(request, 1001),
    (error) => error.status === 429 && error.code === "analysis_rate_limited"
  );
});
