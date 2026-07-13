(function () {
  "use strict";

  const ids = window.PancreAIUtils?.ids;
  const foodMatcher = window.PancreAIRecognition?.foodMatcher;
  const nutritionDatabase = window.PancreAIData?.nutritionDatabase;
  const hiddenIngredientsService = window.PancreAIServices?.hiddenIngredientsService;
  const DEFAULT_ENDPOINT = "/api/analyze-meal";
  const DEFAULT_TIMEOUT_MS = 58000;
  const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
  const USAGE_CONTEXT = "responsible_adult";
  let endpointOverride = null;

  class MealAnalysisError extends Error {
    constructor(message, code, status, details) {
      super(message);
      this.name = "MealAnalysisError";
      this.code = code || "ANALYSIS_FAILED";
      this.status = status || null;
      this.details = details || null;
    }
  }

  function getEndpoint(options = {}) {
    const metaEndpoint = document
      .querySelector('meta[name="pancreai-analysis-endpoint"]')
      ?.getAttribute("content")
      ?.trim();
    return options.endpoint || endpointOverride ||
      window.PancreAIConfig?.mealAnalysisEndpoint || metaEndpoint || DEFAULT_ENDPOINT;
  }

  function setEndpoint(endpoint) {
    endpointOverride = String(endpoint || "").trim() || null;
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

  function safeFilename(image, blob) {
    const supplied = image?.name || image?.filename || image?.file?.name;
    if (supplied) return String(supplied);
    const extension = String(blob?.type || "image/jpeg").split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    return `refeicao-${Date.now()}.${extension}`;
  }

  function safeText(value, fallback = "", maxLength = 160) {
    const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
    return (normalized || fallback).slice(0, maxLength);
  }

  function normalizePhotoQuality(value) {
    const input = value && typeof value === "object" ? value : { label: value };
    const level = safeText(input.level || input.value, "unknown", 24).toLowerCase();
    return {
      label: safeText(input.label || input.message, "Qualidade da foto analisada", 80),
      level,
      value: safeText(input.value || level, level, 24),
      message: safeText(input.message, "", 180)
    };
  }

  function normalizeWarning(warning) {
    const value = typeof warning === "string"
      ? warning
      : warning?.message || warning?.label || warning?.code;
    return safeText(value, "Revise a análise antes de continuar.", 220);
  }

  function normalizePayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new MealAnalysisError("O serviço retornou uma resposta inválida.", "INVALID_RESPONSE");
    }
    if (!foodMatcher?.normalizeDetectedItems) {
      throw new MealAnalysisError("O banco nutricional não foi carregado.", "FOOD_MATCHER_UNAVAILABLE");
    }

    const sourceItems = payload.detectedItems || payload.foods || payload.items || [];
    const mapped = foodMatcher.normalizeDetectedItems(Array.isArray(sourceItems) ? sourceItems.slice(0, 12) : []);
    const backendUnknown = payload.unknownItems || payload.unknownFoods || [];
    const remainingSlots = Math.max(0, 12 - mapped.detectedItems.length - mapped.unknownItems.length);
    const preservedUnknown = Array.isArray(backendUnknown)
      ? backendUnknown.slice(0, remainingSlots).map((item, index) => {
          const label = safeText(item?.label || item?.name || item?.foodName, "Alimento não identificado", 120);
          return {
            id: safeText(item?.id, ids?.createId?.("unknown") || `unknown_api_${Date.now()}_${index}`, 100),
            label,
            originalLabel: label,
            quantityGrams: foodMatcher.normalizeGrams(item?.quantityGrams ?? item?.portionGrams ?? item?.grams),
            confidence: foodMatcher.normalizeConfidence(item?.confidence ?? item?.score),
            reason: safeText(item?.reason, "gemini-unknown", 80),
            source: "ai-unmatched"
          };
        })
      : [];
    const unknownItems = [...mapped.unknownItems, ...preservedUnknown];
    const itemConfidences = [...mapped.detectedItems, ...unknownItems]
      .map((item) => Number(item.confidence))
      .filter(Number.isFinite);
    const averageConfidence = itemConfidences.length
      ? Math.round(itemConfidences.reduce((sum, value) => sum + value, 0) / itemConfidences.length)
      : 0;
    const confidence = foodMatcher.normalizeConfidence(
      payload.confidence ?? payload.overallConfidence,
      averageConfidence
    );
    const photoQuality = normalizePhotoQuality(payload.photoQuality || payload.imageQuality);
    const warnings = (Array.isArray(payload.warnings) ? payload.warnings.slice(0, 10) : []).map(normalizeWarning);
    if (mapped.detectedItems.some((item) => item.missingQuantity)) {
      warnings.push("Confirme a quantidade dos alimentos sem porção estimada.");
    }
    if (unknownItems.length) warnings.push("Há alimentos que precisam ser identificados manualmente.");

    const packaging = safeText(payload.packaging?.label || payload.packaging, "", 100) || null;
    const mealName = safeText(payload.mealName || payload.meal?.name, "Refeição analisada", 120);
    const category = safeText(payload.category || payload.meal?.category, "refeicao", 60);
    const hiddenFats = hiddenIngredientsService?.getSuggestedSelections?.({
      possibleHiddenIngredients: payload.possibleHiddenIngredients,
      hiddenIngredientSuggestions: payload.hiddenIngredientSuggestions,
      hiddenFats: payload.hiddenFats,
      mealName,
      category,
      foods: mapped.foods
    }) || [];
    return {
      id: safeText(payload.id, ids?.createId?.("gemini_analysis") || `gemini_analysis_${Date.now()}`, 100),
      provider: safeText(payload.provider, "gemini", 60),
      providerLabel: safeText(payload.providerLabel, "Gemini 2.5 Flash", 80),
      isSimulated: false,
      mealName,
      category,
      confidence,
      photoQuality,
      photoQualityDetails: photoQuality,
      detectedItems: mapped.detectedItems,
      warnings: [...new Set(warnings)].slice(0, 12),
      unknownItems,
      unknownFood: unknownItems[0] || null,
      packagingDetected: Boolean(payload.packagingDetected || packaging),
      packaging,
      foods: mapped.foods,
      qualityWarning: ["low", "poor", "bad", "medium"].includes(String(photoQuality.level).toLowerCase()),
      hiddenFats,
      rawMetadata: payload.metadata && typeof payload.metadata === "object"
        ? {
            requestId: safeText(payload.metadata.requestId, "", 100) || null,
            model: safeText(payload.metadata.model, "", 80) || null
          }
        : null
    };
  }

  async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const isJson = /(^|[+/])json\b/i.test(contentType);
    let payload = null;
    try {
      payload = isJson ? await response.json() : null;
    } catch (_) {
      payload = null;
    }

    if (!response.ok) {
      const backendMessage = isJson
        ? safeText(payload?.error?.message || payload?.message, "", 220)
        : "";
      const safeMessage = response.status === 404
        ? "O serviço de análise não foi encontrado. Confira a configuração da hospedagem."
        : response.status === 403
          ? backendMessage || "Este endereço do app não tem permissão para usar a análise."
          : response.status === 429
            ? "O limite gratuito de análises foi atingido. Tente novamente em alguns minutos."
            : response.status >= 500
              ? backendMessage || "O serviço de análise está temporariamente indisponível."
              : backendMessage || "Não foi possível analisar esta imagem.";
      throw new MealAnalysisError(
        safeMessage,
        payload?.code || payload?.error?.code || `HTTP_${response.status}`,
        response.status
      );
    }
    if (!isJson || !payload) {
      throw new MealAnalysisError("O serviço retornou uma resposta inválida.", "INVALID_RESPONSE", response.status);
    }
    return payload;
  }

  async function analyze(image, options = {}) {
    if (String(options.usageContext || "").trim() !== USAGE_CONTEXT) {
      throw new MealAnalysisError(
        "Confirme o uso por um responsável adulto antes de analisar a foto.",
        "ADULT_CONSENT_REQUIRED",
        403
      );
    }
    const blob = await imageToBlob(image);
    if (!String(blob.type || "").startsWith("image/")) {
      throw new MealAnalysisError("O arquivo selecionado não é uma imagem.", "UNSUPPORTED_FILE_TYPE");
    }
    if (blob.size > Number(options.maxBytes || MAX_IMAGE_BYTES)) {
      throw new MealAnalysisError("A imagem é muito grande. Escolha um arquivo de até 3 MB.", "IMAGE_TOO_LARGE");
    }

    const formData = new FormData();
    formData.append("image", blob, safeFilename(image, blob));
    formData.append("locale", String(options.locale || document.documentElement.lang || "pt-BR"));
    formData.append("usageContext", String(options.usageContext).trim());
    const catalog = (nutritionDatabase?.foods || []).slice(0, 250).map((food) => ({ id: food.id, name: food.name }));
    formData.append("catalog", JSON.stringify(catalog));

    const controller = new AbortController();
    const externalSignal = options.signal;
    let timedOut = false;
    const abortFromExternalSignal = () => controller.abort(externalSignal?.reason);
    if (externalSignal?.aborted) abortFromExternalSignal();
    else externalSignal?.addEventListener?.("abort", abortFromExternalSignal, { once: true });
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, Number(options.timeoutMs || DEFAULT_TIMEOUT_MS));

    try {
      const response = await fetch(getEndpoint(options), {
        method: "POST",
        body: formData,
        signal: controller.signal,
        credentials: options.credentials || "same-origin",
        headers: { Accept: "application/json", ...(options.headers || {}) }
      });
      return normalizePayload(await parseResponse(response));
    } catch (error) {
      if (error instanceof MealAnalysisError) throw error;
      if (externalSignal?.aborted) throw new MealAnalysisError("A análise foi cancelada.", "ANALYSIS_ABORTED");
      if (timedOut || error?.name === "AbortError") {
        throw new MealAnalysisError("A análise demorou demais. Tente novamente.", "ANALYSIS_TIMEOUT");
      }
      throw new MealAnalysisError("Não foi possível conectar ao serviço de análise.", "NETWORK_ERROR");
    } finally {
      window.clearTimeout(timeout);
      externalSignal?.removeEventListener?.("abort", abortFromExternalSignal);
    }
  }

  async function healthCheck(options = {}) {
    const endpoint = options.endpoint || getEndpoint(options).replace(/\/analyze-meal\/?$/, "/health");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), Number(options.timeoutMs || 5000));
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
        credentials: options.credentials || "same-origin"
      });
      return response.ok;
    } catch (_) {
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function isAvailable() {
    return Boolean(window.fetch && window.FormData && window.Blob && foodMatcher?.normalizeDetectedItems);
  }

  const provider = {
    analyze,
    healthCheck,
    isAvailable,
    getEndpoint,
    setEndpoint,
    normalizePayload,
    MealAnalysisError,
    _private: { parseResponse, imageToBlob, USAGE_CONTEXT }
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
