const test = require("node:test");
const assert = require("node:assert/strict");

const analyzeHandler = require("../../api/analyze-meal");
const healthHandler = require("../../api/health");

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

test("rate limit básico bloqueia excesso por IP", () => {
  const previous = process.env.MAX_REQUESTS_PER_MINUTE;
  process.env.MAX_REQUESTS_PER_MINUTE = "2";
  const request = { headers: { "x-forwarded-for": `203.0.113.${Date.now() % 200}` } };
  const now = Date.now();
  assert.equal(analyzeHandler._private.enforceRateLimit(request, now).remaining, 1);
  assert.equal(analyzeHandler._private.enforceRateLimit(request, now + 1).remaining, 0);
  assert.throws(
    () => analyzeHandler._private.enforceRateLimit(request, now + 2),
    (error) => error?.code === "analysis_rate_limited" && error?.status === 429
  );
  if (previous == null) delete process.env.MAX_REQUESTS_PER_MINUTE;
  else process.env.MAX_REQUESTS_PER_MINUTE = previous;
});

test("health informa configuração sem revelar a chave", () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = "https://rafaelfrancis09.github.io";

  delete process.env.OPENAI_API_KEY;
  const unavailableResponse = createResponse();
  healthHandler({ method: "GET", headers: { origin: "https://rafaelfrancis09.github.io" } }, unavailableResponse);
  assert.equal(unavailableResponse.statusCode, 503);
  const unavailable = JSON.parse(unavailableResponse.body);
  assert.equal(unavailable.ok, false);
  assert.equal(unavailable.configured, false);
  assert.equal("apiKey" in unavailable, false);

  process.env.OPENAI_API_KEY = "test-secret-not-returned";
  const readyResponse = createResponse();
  healthHandler({ method: "GET", headers: { origin: "https://rafaelfrancis09.github.io" } }, readyResponse);
  assert.equal(readyResponse.statusCode, 200);
  const ready = JSON.parse(readyResponse.body);
  assert.equal(ready.ok, true);
  assert.equal(ready.configured, true);
  assert.equal(readyResponse.body.includes("test-secret-not-returned"), false);

  if (previousKey == null) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previousKey;
  if (previousOrigins == null) delete process.env.ALLOWED_ORIGINS;
  else process.env.ALLOWED_ORIGINS = previousOrigins;
});
