const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { LOCAL_ANALYSIS_INFO } = require("../../api/_lib/meal-analysis");

test("metadados descrevem o modelo aberto executado localmente", () => {
  assert.equal(LOCAL_ANALYSIS_INFO.provider, "transformersjs-food101");
  assert.equal(LOCAL_ANALYSIS_INFO.model, "onnx-community/swin-finetuned-food101-ONNX");
  assert.equal(LOCAL_ANALYSIS_INFO.imageUpload, false);
});

test("arquivos ativos do backend não contêm segredo de provedor", () => {
  const apiRoot = path.join(__dirname, "..", "..", "api");
  const activeSource = ["analyze-meal.js", "health.js", path.join("_lib", "meal-analysis.js")]
    .map((file) => fs.readFileSync(path.join(apiRoot, file), "utf8"))
    .join("\n");
  assert.equal(/api[_-]?key|authorization\s*:/i.test(activeSource), false);
});
