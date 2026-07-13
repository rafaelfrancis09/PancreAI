const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..", "..");
const bridgePath = path.join(root, "src", "services", "mitAppInventorBridge.js");
const homePath = path.join(root, "home.js");
const homeHtmlPath = path.join(root, "home.html");

function loadBridge() {
  assert.equal(
    fs.existsSync(bridgePath),
    true,
    "a ponte do MIT App Inventor deve existir em src/services/mitAppInventorBridge.js"
  );

  const source = fs.readFileSync(bridgePath, "utf8");
  const logs = [];
  const warnings = [];
  const window = { PancreAIServices: {} };
  const context = {
    window,
    Blob,
    File,
    Uint8Array,
    ArrayBuffer,
    Promise,
    URL,
    atob,
    btoa,
    setTimeout,
    clearTimeout,
    console: {
      log: (...values) => logs.push(values.map(String).join(" ")),
      warn: (...values) => warnings.push(values.map(String).join(" ")),
      error: (...values) => warnings.push(values.map(String).join(" "))
    }
  };
  context.globalThis = context;

  vm.runInNewContext(source, context, { filename: "mitAppInventorBridge.js" });

  const bridge = window.PancreAIServices.mitAppInventorBridge;
  assert.ok(bridge, "a ponte deve ser publicada em window.PancreAIServices");
  assert.equal(typeof window.PancreAIReceiveImageBase64, "function");
  assert.equal(typeof bridge.requestCamera, "function");
  assert.equal(typeof bridge.requestGallery, "function");
  assert.equal(typeof bridge.setImageReceiver, "function");

  return { bridge, window, logs, warnings, source };
}

async function receive(window, value, source) {
  return Promise.resolve(window.PancreAIReceiveImageBase64(value, source));
}

test("ponte emite os comandos exatos esperados pelos blocos do MIT", () => {
  const { bridge, logs } = loadBridge();

  bridge.requestCamera();
  bridge.requestGallery();

  assert.deepEqual(logs, ["abrirCamera", "abrirGaleria"]);
});

test("receptor global aceita data URL e Base64 puro", async () => {
  const { bridge, window } = loadBridge();
  const received = [];
  const onePixelPng =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  bridge.setImageReceiver((file, source) => {
    received.push({ file, source });
  });

  bridge.requestCamera();
  assert.equal(
    await receive(window, `data:image/png;base64,${onePixelPng}`, "camera"),
    true
  );

  bridge.requestGallery();
  assert.equal(await receive(window, onePixelPng, "gallery"), true);

  assert.equal(received.length, 2);
  for (const item of received) {
    assert.equal(item.file instanceof Blob, true);
    assert.equal(item.file.size > 0, true);
  }
  assert.equal(received[0].file.type, "image/png");
  assert.equal(received[0].source, "camera_native_mit");
  assert.equal(received[1].source, "gallery_native_mit");
});

test("Base64 inválido é recusado sem quebrar a WebView", async () => {
  const { bridge, window } = loadBridge();
  const received = [];
  bridge.setImageReceiver((file) => received.push(file));

  assert.equal(await receive(window, "%%%isto-nao-e-base64%%%", "camera"), false);
  assert.equal(await receive(window, "data:image/png;base64,", "gallery"), false);
  assert.equal(await receive(window, null, "gallery"), false);
  assert.deepEqual(received, []);
});

test("ponte limita imagens excessivas antes de entregá-las ao app", async () => {
  const { bridge, window } = loadBridge();
  let deliveryCount = 0;
  bridge.setImageReceiver(() => {
    deliveryCount += 1;
  });

  // Aproximadamente 24 MB decodificados: acima do limite de entrada do app.
  const oversizedBase64 = "A".repeat(32 * 1024 * 1024);
  assert.equal(await receive(window, oversizedBase64, "gallery"), false);
  assert.equal(deliveryCount, 0);
});

test("integração preserva as alternativas de câmera e galeria do navegador", () => {
  const homeJs = fs.readFileSync(homePath, "utf8");
  const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");

  assert.match(
    homeJs,
    /function openCamera\(\)[\s\S]*?realCaptureService\.startCamera\(\)/,
    "a câmera web deve continuar disponível fora do MIT"
  );
  assert.match(
    homeJs,
    /function openDeviceGallery\(\)[\s\S]*?galleryFileInput\.click\(\)/,
    "o seletor de arquivos deve continuar disponível fora do MIT"
  );
  assert.match(homeHtml, /id=["']cameraFileInput["'][^>]+type=["']file["']/);
  assert.match(homeHtml, /id=["']galleryFileInput["'][^>]+type=["']file["']/);
  assert.match(homeHtml, /src=["']src\/services\/mitAppInventorBridge\.js(?:\?[^"']*)?["']/);
});

test("home registra o receptor e encaminha a imagem nativa para a prévia real", () => {
  const homeJs = fs.readFileSync(homePath, "utf8");
  const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
  const handlerStart = homeJs.indexOf("async function handleMitAppInventorImage(file, source)");
  const handlerEnd = homeJs.indexOf("function showPreviewImageError", handlerStart);
  assert.notEqual(handlerStart, -1);
  assert.notEqual(handlerEnd, -1);

  const handlerFlow = homeJs.slice(handlerStart, handlerEnd);
  assert.match(
    handlerFlow,
    /const fromCamera = String\(source \|\| ""\)\.includes\("camera"\)/
  );
  assert.match(
    handlerFlow,
    /const captureSource = fromCamera \? "camera_native_mit" : "gallery_native_mit"/
  );
  assert.match(handlerFlow, /await showRealCapturePreview\(file, captureSource\)/);
  assert.match(
    handlerFlow,
    /mitAppInventorBridge\?\.setImageReceiver\?\.\(handleMitAppInventorImage\)/
  );

  assert.equal(
    homeHtml.indexOf("src/services/mitAppInventorBridge.js") < homeHtml.indexOf("home.js?"),
    true,
    "a ponte deve carregar antes do código que registra o receptor"
  );
});

test("cliques usam a ponte nativa e mantêm os fallbacks do navegador", () => {
  const homeJs = fs.readFileSync(homePath, "utf8");

  const galleryStart = homeJs.indexOf("function openDeviceGallery()");
  const galleryEnd = homeJs.indexOf("function openGallery()", galleryStart);
  const galleryFlow = homeJs.slice(galleryStart, galleryEnd);
  assert.match(
    galleryFlow,
    /if \(mitAppInventorBridge\?\.requestGallery\?\.\(\)\) \{[\s\S]*?return;[\s\S]*?galleryFileInput\.click\(\)/
  );

  const captureStart = homeJs.indexOf("async function captureFromCamera()");
  const captureEnd = homeJs.indexOf("function openPortionModal", captureStart);
  const captureFlow = homeJs.slice(captureStart, captureEnd);
  assert.match(
    captureFlow,
    /if \(!cameraStream \|\| !cameraVideo \|\| cameraVideo\.readyState < 2\) \{[\s\S]*?requestCamera\?\.\(\)[\s\S]*?return;[\s\S]*?cameraFileInput\.click\(\)/
  );

  const cameraClickStart = homeJs.indexOf('cameraBtn.addEventListener("click"');
  const cameraClickEnd = homeJs.indexOf('galleryBtn.addEventListener("click"', cameraClickStart);
  const cameraClickFlow = homeJs.slice(cameraClickStart, cameraClickEnd);
  assert.match(
    cameraClickFlow,
    /requestCamera\?\.\(\)[\s\S]*?return;[\s\S]*?openCamera\(\)/
  );

  assert.match(homeJs, /galleryBtn\.addEventListener\("click", openDeviceGallery\)/);
  assert.match(homeJs, /deviceGalleryBtn\.addEventListener\("click", openDeviceGallery\)/);
  assert.match(homeJs, /cameraSwitchBtn\.addEventListener\("click", openDeviceGallery\)/);
});
