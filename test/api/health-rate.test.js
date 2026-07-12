const test = require("node:test");
const assert = require("node:assert/strict");
const healthHandler = require("../../api/health");

test("health confirma que a IA local não depende de chave", async () => {
  const response = await new Promise((resolve) => {
    const res = {
      statusCode: 0,
      setHeader() {},
      end(body) { resolve({ status: this.statusCode, body: JSON.parse(body) }); }
    };
    healthHandler({ method: "GET" }, res);
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.configured, true);
  assert.equal(response.body.serverRequired, false);
  assert.equal(response.body.execution, "browser");
});
