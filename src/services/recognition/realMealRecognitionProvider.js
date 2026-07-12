(function () {
  "use strict";

  const ids = window.PancreAIUtils?.ids;
  const foodMatcher = window.PancreAIRecognition?.foodMatcher;
  const hiddenIngredientsService = window.PancreAIServices?.hiddenIngredientsService;

  const MODEL_ID = "onnx-community/swin-finetuned-food101-ONNX";
  const DEFAULT_TIMEOUT_MS = 120000;
  const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

  let classifierPromise = null;
  let classifierOverride = null;
  let recognitionWorker = null;
  let workerRequestCounter = 0;
  const workerRequests = new Map();
  const progressListeners = new Set();

  class MealAnalysisError extends Error {
    constructor(message, code, status, details) {
      super(message);
      this.name = "MealAnalysisError";
      this.code = code || "ANALYSIS_FAILED";
      this.status = status || null;
      this.details = details || null;
    }
  }

  // Food-101 recognizes complete dishes. This conservative map only connects
  // labels that have a clear equivalent in the local PancreAI catalog.
  const MODEL_LABEL_MAPPINGS = {
    "chocolate mousse": [{ name: "Mousse de chocolate", factor: 1 }],
    "falafel": [{ name: "Falafel assado", factor: 1 }],
    "filet mignon": [{ name: "Bife grelhado", factor: 1 }],
    "french fries": [{ name: "Batata frita", factor: 1 }],
    "fried rice": [{ name: "Arroz com legumes", factor: 1 }],
    "frozen yogurt": [{ name: "Iogurte grego", factor: 1 }],
    "gnocchi": [{ name: "Nhoque ao sugo", factor: 1 }],
    "greek salad": [{ name: "Salada verde", factor: 1 }],
    "grilled salmon": [{ name: "Salmão grelhado", factor: 1 }],
    "guacamole": [{ name: "Guacamole", factor: 1 }],
    "gyoza": [{ name: "Guioza grelhado", factor: 1 }],
    "hamburger": [
      { name: "Hambúrguer bovino", factor: 0.5 },
      { name: "Pão de hambúrguer", factor: 0.35 },
      { name: "Queijo cheddar", factor: 0.15 }
    ],
    "hummus": [{ name: "Homus", factor: 1 }],
    "lasagna": [{ name: "Lasanha à bolonhesa", factor: 1 }],
    "omelette": [{ name: "Omelete de queijo", factor: 1 }],
    "pancakes": [{ name: "Panqueca americana", factor: 1 }],
    "pork chop": [{ name: "Lombo suíno assado", factor: 1 }],
    "risotto": [{ name: "Risoto de legumes", factor: 1 }],
    "sashimi": [{ name: "Sashimi de salmão", factor: 1 }],
    "spaghetti bolognese": [{ name: "Macarrão à bolonhesa", factor: 1 }],
    "steak": [{ name: "Bife grelhado", factor: 1 }],
    "sushi": [{ name: "Sushi combinado", factor: 1 }],
    "tacos": [{ name: "Taco de carne", factor: 1 }],
    "waffles": [{ name: "Waffle", factor: 1 }]
  };

  function safeText(value, fallback = "", maxLength = 160) {
    const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
    return (normalized || fallback).slice(0, maxLength);
  }

  function normalizeModelLabel(value) {
    return safeText(value, "", 100).replace(/_/g, " ").toLowerCase();
  }

  function humanizeModelLabel(value) {
    const normalized = normalizeModelLabel(value);
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "Alimento não identificado";
  }

  function normalizePhotoQuality(value) {
    const level = safeText(value?.level || value, "medium", 24).toLowerCase();
    const copy = {
      excellent: ["Foto excelente", "A refeição está bem enquadrada e iluminada."],
      good: ["Foto boa", "A imagem permite uma análise visual adequada."],
      medium: ["Qualidade moderada", "Alguns detalhes podem exigir mais atenção na revisão."],
      low: ["Foto inadequada", "A iluminação ou o contraste dificultam a identificação."]
    }[level] || ["Qualidade moderada", "Revise as sugestões com atenção."];
    return { label: copy[0], level, value: level, message: copy[1] };
  }

  function isBlob(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
  }

  function dataUrlToBlob(dataUrl) {
    const match = String(dataUrl).match(/^data:([^;,]+)?(;base64)?,(.*)$/s);
    if (!match) throw new MealAnalysisError("Imagem em formato inválido.", "INVALID_IMAGE");
    const mimeType = match[1] || "image/jpeg";
    const bytes = match[2] ? atob(match[3]) : decodeURIComponent(match[3]);
    const buffer = new Uint8Array(bytes.length);
    for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
    return new Blob([buffer], { type: mimeType });
  }

  async function imageToBlob(image) {
    if (isBlob(image)) return image;
    if (isBlob(image?.file)) return image.file;
    if (isBlob(image?.blob)) return image.blob;
    const reference = image?.dataUrl || image?.imageData || image?.url || image?.src || image;
    if (typeof reference !== "string" || !reference.trim()) {
      throw new MealAnalysisError("Selecione uma imagem para analisar.", "IMAGE_REQUIRED");
    }
    if (reference.startsWith("data:")) return dataUrlToBlob(reference);
    try {
      const response = await fetch(reference, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.blob();
    } catch (error) {
      throw new MealAnalysisError("Não foi possível preparar a imagem.", "IMAGE_READ_FAILED", null, error?.message);
    }
  }

  function blobToDataUrl(blob) {
    if (typeof FileReader === "undefined") {
      const objectUrl = URL.createObjectURL(blob);
      return Promise.resolve({ source: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) });
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new MealAnalysisError("Não foi possível ler a imagem.", "IMAGE_READ_FAILED"));
      reader.onload = () => resolve({ source: String(reader.result), revoke: () => {} });
      reader.readAsDataURL(blob);
    });
  }

  function notifyProgress(payload) {
    progressListeners.forEach((listener) => {
      try { listener(payload); } catch (_) { /* the screen may already be closed */ }
    });
  }

  function normalizeDownloadProgress(event) {
    const raw = Number(event?.progress);
    const percent = Number.isFinite(raw) ? Math.round(raw <= 1 ? raw * 100 : raw) : null;
    return {
      phase: "model",
      percent: percent == null ? null : Math.max(0, Math.min(100, percent)),
      status: event?.status || "loading"
    };
  }

  function rejectWorkerRequests(error) {
    workerRequests.forEach(({ reject }) => reject(error));
    workerRequests.clear();
  }

  function resetRecognitionWorker(error) {
    recognitionWorker?.terminate?.();
    recognitionWorker = null;
    classifierPromise = null;
    if (error) rejectWorkerRequests(error);
  }

  function getRecognitionWorker() {
    if (recognitionWorker) return recognitionWorker;
    const workerUrl = new URL("src/workers/foodRecognitionWorker.js", document.baseURI);
    recognitionWorker = new Worker(workerUrl, { type: "module", name: "pancreai-food-recognition" });
    recognitionWorker.addEventListener("message", (message) => {
      const payload = message.data || {};
      if (payload.type === "progress") {
        notifyProgress(normalizeDownloadProgress(payload.event));
        return;
      }
      const pending = workerRequests.get(payload.id);
      if (!pending) return;
      workerRequests.delete(payload.id);
      if (payload.type === "result") {
        pending.resolve(payload.output);
        return;
      }
      pending.reject(new MealAnalysisError(
        "Não foi possível executar a IA local.",
        "LOCAL_AI_FAILED",
        null,
        payload.error?.message
      ));
    });
    recognitionWorker.addEventListener("error", (event) => {
      resetRecognitionWorker(new MealAnalysisError(
        "Não foi possível carregar a IA local. Verifique a internet e tente novamente.",
        "MODEL_LOAD_FAILED",
        null,
        event?.message
      ));
    });
    return recognitionWorker;
  }

  function classifyInWorker(source, options) {
    const worker = getRecognitionWorker();
    const id = `food_recognition_${Date.now()}_${++workerRequestCounter}`;
    return new Promise((resolve, reject) => {
      workerRequests.set(id, { resolve, reject });
      worker.postMessage({ id, source, options });
    });
  }

  async function getClassifier() {
    if (classifierOverride) return classifierOverride;
    if (!classifierPromise) {
      classifierPromise = Promise.resolve((source, options) => classifyInWorker(source, options));
    }
    return classifierPromise;
  }
  function drawCover(context, image, region) {
    const outputSize = context.canvas.width;
    const sourceRatio = region.width / region.height;
    let sourceWidth = region.width;
    let sourceHeight = region.height;
    let sourceX = region.x;
    let sourceY = region.y;
    if (sourceRatio > 1) {
      sourceWidth = region.height;
      sourceX += (region.width - sourceWidth) / 2;
    } else {
      sourceHeight = region.width;
      sourceY += (region.height - sourceHeight) / 2;
    }
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputSize, outputSize);
  }

  function measurePhotoQuality(context) {
    let pixels;
    try {
      pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
    } catch (_) {
      return "medium";
    }
    let count = 0;
    let sum = 0;
    let sumSquares = 0;
    for (let index = 0; index < pixels.length; index += 64) {
      const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
      count += 1;
      sum += luminance;
      sumSquares += luminance * luminance;
    }
    const mean = sum / Math.max(1, count);
    const contrast = Math.sqrt(Math.max(0, sumSquares / Math.max(1, count) - mean * mean));
    if (mean < 42 || mean > 232 || contrast < 14) return "low";
    if (mean < 62 || mean > 218 || contrast < 25) return "medium";
    if (mean > 78 && mean < 205 && contrast > 42) return "excellent";
    return "good";
  }

  async function prepareImageVariants(blob) {
    const original = await blobToDataUrl(blob);
    const fallback = {
      variants: [{ source: original.source, region: "whole", grams: 220, weight: 1 }],
      quality: "medium",
      cleanup: original.revoke
    };
    if (typeof createImageBitmap !== "function" || !document?.createElement) return fallback;
    let bitmap;
    try {
      bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      const width = bitmap.width;
      const height = bitmap.height;
      if (!width || !height) return fallback;
      const definitions = [
        { region: "whole", x: 0, y: 0, width, height, grams: 220, weight: 1 },
        { region: "top-left", x: 0, y: 0, width: width * 0.62, height: height * 0.62, grams: 100, weight: 0.9 },
        { region: "top-right", x: width * 0.38, y: 0, width: width * 0.62, height: height * 0.62, grams: 100, weight: 0.9 },
        { region: "bottom-left", x: 0, y: height * 0.38, width: width * 0.62, height: height * 0.62, grams: 100, weight: 0.9 },
        { region: "bottom-right", x: width * 0.38, y: height * 0.38, width: width * 0.62, height: height * 0.62, grams: 100, weight: 0.9 }
      ];
      const variants = [];
      let quality = "medium";
      definitions.forEach((definition, index) => {
        const canvas = document.createElement("canvas");
        canvas.width = 224;
        canvas.height = 224;
        const context = canvas.getContext("2d", { willReadFrequently: index === 0 });
        if (!context) return;
        drawCover(context, bitmap, definition);
        if (index === 0) quality = measurePhotoQuality(context);
        variants.push({
          source: canvas.toDataURL("image/jpeg", 0.86),
          region: definition.region,
          grams: definition.grams,
          weight: definition.weight
        });
      });
      return { variants: variants.length ? variants : fallback.variants, quality, cleanup: original.revoke };
    } catch (_) {
      return fallback;
    } finally {
      bitmap?.close?.();
    }
  }

  function normalizePredictions(output) {
    const list = Array.isArray(output?.[0]) ? output[0] : output;
    return (Array.isArray(list) ? list : [])
      .map((item) => ({ label: normalizeModelLabel(item?.label), score: Number(item?.score) }))
      .filter((item) => item.label && Number.isFinite(item.score))
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);
  }

  function addMappedPrediction(map, prediction, variant) {
    const mappings = MODEL_LABEL_MAPPINGS[prediction.label];
    if (!mappings) return false;
    const confidence = Math.round(Math.max(1, Math.min(99, prediction.score * variant.weight * 100)));
    mappings.forEach((mapping) => {
      const quantityGrams = Math.max(15, Math.round(variant.grams * mapping.factor));
      const previous = map.get(mapping.name);
      if (!previous || confidence > previous.confidence) {
        map.set(mapping.name, { name: mapping.name, quantityGrams, confidence });
      }
    });
    return true;
  }

  async function classifyVariants(classifier, prepared, onProgress) {
    const detected = new Map();
    let bestUnknown = null;
    for (let index = 0; index < prepared.variants.length; index += 1) {
      const variant = prepared.variants[index];
      onProgress?.({ phase: "inference", current: index + 1, total: prepared.variants.length });
      const predictions = normalizePredictions(await classifier(variant.source, { topk: 5 }));
      predictions.forEach((prediction) => {
        if (!bestUnknown || prediction.score > bestUnknown.score) bestUnknown = prediction;
      });
      const threshold = variant.region === "whole" ? 0.12 : 0.2;
      const mapped = predictions.find((prediction) => prediction.score >= threshold && MODEL_LABEL_MAPPINGS[prediction.label]);
      if (mapped) addMappedPrediction(detected, mapped, variant);
    }
    return { detectedItems: [...detected.values()].slice(0, 6), bestUnknown };
  }

  function normalizeWarning(warning) {
    const value = typeof warning === "string" ? warning : warning?.message || warning?.label || warning?.code;
    return safeText(value, "Revise a análise antes de continuar.", 220);
  }

  function normalizePayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new MealAnalysisError("A IA local retornou uma resposta inválida.", "INVALID_RESPONSE");
    }
    if (!foodMatcher?.normalizeDetectedItems) {
      throw new MealAnalysisError("O banco nutricional não foi carregado.", "FOOD_MATCHER_UNAVAILABLE");
    }
    const rawItems = Array.isArray(payload.detectedItems) ? payload.detectedItems.slice(0, 12) : [];
    const mapped = foodMatcher.normalizeDetectedItems(rawItems);
    const providedUnknown = Array.isArray(payload.unknownItems) ? payload.unknownItems : [];
    const unknownItems = [...mapped.unknownItems, ...providedUnknown].slice(0, 6).map((item, index) => ({
      id: safeText(item?.id, ids?.createId?.("unknown") || `unknown_local_${Date.now()}_${index}`, 100),
      label: safeText(item?.label || item?.name, "Alimento não identificado", 120),
      originalLabel: safeText(item?.originalLabel || item?.label || item?.name, "Alimento não identificado", 120),
      quantityGrams: foodMatcher.normalizeGrams(item?.quantityGrams),
      confidence: foodMatcher.normalizeConfidence(item?.confidence),
      reason: safeText(item?.reason, "local-model-unmatched", 80),
      source: "local-ai-unmatched"
    }));
    const itemConfidences = [...mapped.detectedItems, ...unknownItems]
      .map((item) => Number(item.confidence))
      .filter(Number.isFinite);
    const averageConfidence = itemConfidences.length
      ? Math.round(itemConfidences.reduce((sum, value) => sum + value, 0) / itemConfidences.length)
      : 0;
    const confidence = foodMatcher.normalizeConfidence(payload.confidence, averageConfidence);
    const photoQuality = normalizePhotoQuality(payload.photoQuality);
    const warnings = (Array.isArray(payload.warnings) ? payload.warnings : []).map(normalizeWarning);
    if (mapped.detectedItems.some((item) => item.missingQuantity)) warnings.push("Confirme a quantidade dos alimentos sem porção estimada.");
    if (unknownItems.length) warnings.push("Há alimentos que precisam ser identificados manualmente.");
    return {
      id: safeText(payload.id, ids?.createId?.("local_ai_analysis") || `local_ai_analysis_${Date.now()}`, 100),
      provider: "transformersjs-food101",
      providerLabel: "IA local Food-101",
      isSimulated: false,
      mealName: safeText(payload.mealName, "Refeição analisada", 120),
      category: safeText(payload.category, "Refeição", 60),
      confidence,
      photoQuality,
      photoQualityDetails: photoQuality,
      detectedItems: mapped.detectedItems,
      warnings: [...new Set(warnings)].slice(0, 12),
      unknownItems,
      unknownFood: unknownItems[0] || null,
      packagingDetected: false,
      packaging: null,
      foods: mapped.foods,
      qualityWarning: ["low", "medium"].includes(photoQuality.level),
      hiddenFats: hiddenIngredientsService?.getDefaultSelections?.() || [],
      rawMetadata: { model: MODEL_ID, execution: "browser" }
    };
  }

  async function analyze(image, options = {}) {
    const blob = await imageToBlob(image);
    if (!String(blob.type || "").startsWith("image/")) {
      throw new MealAnalysisError("O arquivo selecionado não é uma imagem.", "UNSUPPORTED_FILE_TYPE");
    }
    if (blob.size > Number(options.maxBytes || MAX_IMAGE_BYTES)) {
      throw new MealAnalysisError("A imagem é muito grande. Escolha um arquivo de até 3 MB.", "IMAGE_TOO_LARGE");
    }
    const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;
    if (onProgress) progressListeners.add(onProgress);
    let timeoutId = null;
    let prepared = null;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new MealAnalysisError(
          "A IA local demorou demais para carregar. Tente novamente.",
          "ANALYSIS_TIMEOUT"
        )), Number(options.timeoutMs || DEFAULT_TIMEOUT_MS));
      });
      const analysisPromise = (async () => {
        options.signal?.throwIfAborted?.();
        onProgress?.({ phase: "prepare" });
        prepared = await prepareImageVariants(blob);
        const classifier = await getClassifier();
        options.signal?.throwIfAborted?.();
        const recognition = await classifyVariants(classifier, prepared, onProgress);
        options.signal?.throwIfAborted?.();
        const unknownItems = recognition.detectedItems.length || !recognition.bestUnknown
          ? []
          : [{
              label: humanizeModelLabel(recognition.bestUnknown.label),
              confidence: Math.round(recognition.bestUnknown.score * 100),
              reason: "food101-label-without-local-match"
            }];
        const confidences = recognition.detectedItems.map((item) => item.confidence);
        const confidence = confidences.length
          ? Math.round(confidences.reduce((sum, value) => sum + value, 0) / confidences.length)
          : Math.round((recognition.bestUnknown?.score || 0) * 100);
        const names = recognition.detectedItems.map((item) => item.name);
        return normalizePayload({
          mealName: names.length ? names.slice(0, 2).join(" e ") : "Refeição para revisar",
          category: "Refeição",
          confidence,
          photoQuality: { level: prepared.quality },
          detectedItems: recognition.detectedItems,
          unknownItems,
          warnings: [
            "A identificação foi feita no aparelho por uma IA de categorias alimentares.",
            "Confirme todos os alimentos e as porções antes de continuar."
          ]
        });
      })();
      return await Promise.race([analysisPromise, timeoutPromise]);
    } catch (error) {
      if (error instanceof MealAnalysisError) {
        if (error.code === "ANALYSIS_TIMEOUT") resetRecognitionWorker(error);
        throw error;
      }
      if (options.signal?.aborted || error?.name === "AbortError") {
        throw new MealAnalysisError("A análise foi cancelada.", "ANALYSIS_ABORTED");
      }
      throw new MealAnalysisError("Não foi possível executar a IA local.", "LOCAL_AI_FAILED", null, error?.message);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      prepared?.cleanup?.();
      if (onProgress) progressListeners.delete(onProgress);
    }
  }

  async function healthCheck() {
    return isAvailable();
  }

  function isAvailable() {
    return Boolean(window.fetch && window.Blob && window.WebAssembly && window.Worker && foodMatcher?.normalizeDetectedItems);
  }

  function setClassifierForTests(classifier) {
    classifierOverride = classifier || null;
    classifierPromise = null;
  }

  const provider = {
    analyze,
    healthCheck,
    isAvailable,
    normalizePayload,
    MealAnalysisError,
    modelId: MODEL_ID,
    execution: "browser",
    _private: {
      classifyVariants,
      humanizeModelLabel,
      normalizePredictions,
      prepareImageVariants,
      setClassifierForTests
    }
  };

  window.PancreAIRecognition = {
    ...(window.PancreAIRecognition || {}),
    realMealRecognitionProvider: provider
  };
  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    realMealRecognitionProvider: provider
  };
})();
