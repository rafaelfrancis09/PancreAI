const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const homeHtml = fs.readFileSync(path.join(root, "home.html"), "utf8");
const homeJs = fs.readFileSync(path.join(root, "home.js"), "utf8");
const providerJs = fs.readFileSync(
  path.join(root, "src", "services", "recognition", "realMealRecognitionProvider.js"),
  "utf8"
);
const i18nJs = fs.readFileSync(path.join(root, "i18n.js"), "utf8");

test("home não contém ids duplicados e possui todos os elementos consultados", () => {
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

test("endpoint e provider Gemini carregam sem expor segredo no navegador", () => {
  const expectedOrder = [
    "src/data/nutritionDatabase.js",
    "src/services/realImageCaptureService.js",
    "src/services/recognition/foodMatcher.js",
    "src/services/recognition/realMealRecognitionProvider.js",
    "home.js"
  ];
  const positions = expectedOrder.map((reference) => homeHtml.indexOf(reference));
  assert.equal(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((left, right) => left - right), positions);
  assert.match(homeHtml, /<meta[^>]+name=["']pancreai-analysis-endpoint["'][^>]+content=["'][^"']*\/api\/analyze-meal["']/i);

  const browserSources = `${homeHtml}\n${homeJs}\n${providerJs}`;
  assert.equal(/GEMINI_API_KEY|x-goog-api-key/i.test(browserSources), false);
  assert.equal(/foodRecognitionWorker\.js|transformersjs-food101|swin-finetuned-food101/i.test(browserSources), false);
});

test("fluxo ativo não oferece modo demonstração nem desvia fotos da galeria para simulação", () => {
  const activeSource = `${homeHtml}\n${homeJs}`;
  assert.equal(/id=["']analysisDemoBtn["']|id=["']analysisSourceNote["']/i.test(homeHtml), false);
  assert.equal(/usar modo demonstra[cç][aã]o|gallery_demo|startDemoFallback|usePreparedDemo|useDemoFallback/i.test(activeSource), false);
  assert.match(homeJs, /realMealRecognitionProvider/);
});

test("fluxo exige confirmação do responsável antes de enviar a foto", () => {
  assert.match(homeHtml, /id=["']responsibleConsentModal["']/);
  assert.match(homeHtml, /id=["']responsibleConsentConfirm["']/);
  assert.match(homeJs, /await ensureResponsibleAdultConsent\(\)/);
  assert.match(homeJs, /usageContext:\s*RESPONSIBLE_ADULT_CONTEXT/);
  assert.match(providerJs, /ADULT_CONSENT_REQUIRED/);
});

test("confirmação do responsável possui texto nos seis idiomas ativos", () => {
  assert.equal([...i18nJs.matchAll(/"analysis\.adultConsentTitle"/g)].length, 6);
  assert.equal([...i18nJs.matchAll(/"analysis\.adultConsentMessage"/g)].length, 6);
  assert.equal([...i18nJs.matchAll(/"analysis\.adultConsentConfirm"/g)].length, 6);
});
test("erro de análise cancela a mensagem de progresso pendente", () => {
  assert.match(homeJs, /const softMessageTimers = new WeakMap\(\)/);
  assert.match(homeJs, /function clearAnalysisTimer\(\)[\s\S]*?cancelSoftMessage\(analysisMessage\)/);
  assert.match(homeJs, /setSoftMessage\(analysisMessage, message, \{ immediate: true \}\)/);
  assert.match(homeJs, /analysisPanel\?\.classList\.add\("is-error"\)/);
});
test("botões de galeria abrem diretamente as fotos do dispositivo", () => {
  assert.match(homeJs, /function openDeviceGallery\(\)[\s\S]*?galleryFileInput\.click\(\)/);
  assert.match(homeJs, /galleryBtn\.addEventListener\("click", openDeviceGallery\)/);
  assert.match(homeJs, /cameraSwitchBtn\.addEventListener\("click", openDeviceGallery\)/);
  assert.doesNotMatch(homeJs, /galleryBtn\.addEventListener\("click", openGallery\)/);
  assert.doesNotMatch(homeJs, /cameraSwitchBtn\.addEventListener\("click", openGallery\)/);
});