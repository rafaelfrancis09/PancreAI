import {
  env,
  pipeline
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

const MODEL_ID = "onnx-community/swin-finetuned-food101-ONNX";
let classifierPromise = null;

env.allowLocalModels = false;
env.useBrowserCache = true;

function getClassifier() {
  if (!classifierPromise) {
    classifierPromise = pipeline("image-classification", MODEL_ID, {
      dtype: "q4",
      progress_callback: (event) => {
        self.postMessage({ type: "progress", event });
      }
    }).catch((error) => {
      classifierPromise = null;
      throw error;
    });
  }
  return classifierPromise;
}

self.addEventListener("message", async (message) => {
  const { id, source, options } = message.data || {};
  if (!id || !source) return;
  try {
    const classifier = await getClassifier();
    const output = await classifier(source, options || { topk: 5 });
    self.postMessage({ type: "result", id, output });
  } catch (error) {
    self.postMessage({
      type: "error",
      id,
      error: {
        name: String(error?.name || "Error"),
        message: String(error?.message || "Falha ao executar a IA local.")
      }
    });
  }
});
