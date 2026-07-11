const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const homeHtml = fs.readFileSync(path.join(root, "home.html"), "utf8");
const homeJs = fs.readFileSync(path.join(root, "home.js"), "utf8");

test("home não contém ids duplicados e possui todos os elementos usados pelo fluxo", () => {
  const ids = [...homeHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], []);

  const queriedIds = [...homeJs.matchAll(/querySelector\(["']#([A-Za-z][\w:-]*)["']\)/g)]
    .map((match) => match[1]);
  const missing = [...new Set(queriedIds)].filter((id) => !ids.includes(id));
  assert.deepEqual(missing, []);
});

test("todos os scripts e estilos locais referenciados por home existem", () => {
  const references = [
    ...homeHtml.matchAll(/<script[^>]+src=["']([^"']+)["']/g),
    ...homeHtml.matchAll(/<link[^>]+href=["']([^"']+)["']/g)
  ].map((match) => match[1].split("?")[0]);

  const missing = references
    .filter((reference) => !/^(?:https?:|data:|\/\/)/i.test(reference))
    .filter((reference) => !fs.existsSync(path.join(root, reference)));
  assert.deepEqual(missing, []);
});

test("dependências da análise real carregam antes do controlador da tela", () => {
  const expectedOrder = [
    "src/data/nutritionDatabase.js",
    "src/services/realImageCaptureService.js",
    "src/services/recognition/foodMatcher.js",
    "src/services/recognition/realMealRecognitionProvider.js",
    "home.js"
  ];
  const positions = expectedOrder.map((reference) => homeHtml.indexOf(reference));
  assert.equal(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(homeHtml, /meta name="pancreai-analysis-endpoint" content="\/api\/analyze-meal"/);
  assert.equal(homeHtml.includes("OPENAI_API_KEY"), false);
});
