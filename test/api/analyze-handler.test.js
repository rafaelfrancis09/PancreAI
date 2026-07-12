const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../../api/analyze-meal");

function runHandler(method) {
  const headers = {};
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      end(body = "") { resolve({ status: this.statusCode, headers, body: body ? JSON.parse(body) : null }); }
    };
    handler({ method, headers: {} }, res);
  });
}

test("rota antiga informa que a análise acontece no navegador", async () => {
  const response = await runHandler("GET");
  assert.equal(response.status, 200);
  assert.equal(response.body.execution, "browser");
  assert.equal(response.body.imageUpload, false);
  assert.equal(response.body.serverRequired, false);
});

test("rota antiga rejeita upload em vez de receber uma foto", async () => {
  const response = await runHandler("POST");
  assert.equal(response.status, 405);
  assert.equal(response.body.error.code, "local_analysis_only");
});
