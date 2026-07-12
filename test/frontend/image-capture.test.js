const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "services", "realImageCaptureService.js"),
  "utf8"
);

function createService() {
  const context = { Blob, console, window: { PancreAIServices: {} } };
  vm.runInNewContext(source, context, { filename: "realImageCaptureService.js" });
  return context.window.PancreAIServices.realImageCaptureService;
}

test("captura aceita somente formatos suportados pela análise local", () => {
  const service = createService();
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.equal(service.validateImageFile(new Blob(["image"], { type })), true);
  }
  assert.throws(
    () => service.validateImageFile(new Blob(["<svg></svg>"], { type: "image/svg+xml" })),
    (error) => error?.code === "UNSUPPORTED_TYPE"
  );
});

test("captura rejeita arquivos vazios e entradas acima do limite", () => {
  const service = createService();
  assert.throws(
    () => service.validateImageFile(new Blob([], { type: "image/jpeg" })),
    (error) => error?.code === "EMPTY_FILE"
  );
  assert.throws(
    () => service.validateImageFile(new Blob(["123456"], { type: "image/jpeg" }), { maxInputBytes: 5 }),
    (error) => error?.code === "FILE_TOO_LARGE"
  );
});
