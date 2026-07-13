const { randomUUID } = require("node:crypto");
const {
  ApiError,
  RESPONSIBLE_ADULT_CONTEXT,
  createGeminiRequest,
  isOriginAllowed,
  parseAllowedOrigins,
  parseAndNormalizeGeminiResponse,
  readImageRequest
} = require("./_lib/meal-analysis");

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";
const LEGACY_FLASH_MODEL = "gemini-2.5-flash";
const LEGACY_FLASH_LITE_MODEL = "gemini-2.5-flash-lite";
const GEMINI_TIMEOUT_MS = 50_000;
const GEMINI_TRANSIENT_RETRY_LIMIT = 1;
const GEMINI_TRANSIENT_RETRY_DELAY_MS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestBuckets = new Map();

function getHeader(req, name) {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : String(value || "");
}

function allowedOriginsForRequest(req) {
  const allowed = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
  const host = getHeader(req, "x-forwarded-host") || getHeader(req, "host");
  const protocol = (getHeader(req, "x-forwarded-proto") || "https").split(",")[0].trim();
  if (host && ["http", "https"].includes(protocol)) allowed.add(`${protocol}://${host}`);
  return allowed;
}

function applyBaseHeaders(res, requestId) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Request-Id", requestId);
}

function applyCorsHeaders(req, res, allowedOrigins) {
  const origin = getHeader(req, "origin");
  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.has("*") ? "*" : new URL(origin).origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "600");
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

function safeApiError(error) {
  if (error instanceof ApiError) return error;
  if (error?.name === "AbortError") {
    return new ApiError(504, "analysis_timeout", "A análise demorou demais. Tente novamente.");
  }
  return new ApiError(500, "internal_error", "Não foi possível analisar a imagem agora.");
}

function safeProviderText(value, maxLength = 240) {
  return String(value || "")
    .replace(/AIza[\w-]+/g, "[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

async function readUpstreamError(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  return {
    status: Number(response.status) || 502,
    providerCode: safeProviderText(payload?.error?.status || payload?.error?.code, 80).toUpperCase(),
    providerMessage: safeProviderText(payload?.error?.message, 240)
  };
}

function makeUpstreamError(details, status, code, message) {
  const error = new ApiError(status, code, message);
  error.upstreamStatus = Number(details.status) || null;
  error.upstreamCode = safeProviderText(details.providerCode, 80) || null;
  return error;
}

function upstreamError(input) {
  const details = typeof input === "number" ? { status: input } : (input || {});
  const status = Number(details.status) || 502;
  const providerCode = safeProviderText(details.providerCode, 80).toUpperCase();
  const providerMessage = safeProviderText(details.providerMessage, 240);
  const invalidCredentials = ["API_KEY_INVALID", "UNAUTHENTICATED", "PERMISSION_DENIED"].includes(providerCode) ||
    /api key.*(invalid|not valid)|invalid api key|permission denied/i.test(providerMessage);

  if (invalidCredentials || status === 401 || status === 403) {
    return makeUpstreamError(
      details,
      503,
      "analysis_credentials_invalid",
      "A chave do Gemini precisa ser corrigida na configuração da Vercel."
    );
  }
  if (status === 404 || providerCode === "NOT_FOUND") {
    return makeUpstreamError(
      details,
      503,
      "analysis_model_unavailable",
      "Nenhum modelo Gemini compatível foi encontrado para esta chave."
    );
  }
  if (status === 429 || providerCode === "RESOURCE_EXHAUSTED") {
    return makeUpstreamError(
      details,
      429,
      "analysis_rate_limited",
      "O limite temporário do serviço de análise foi atingido. Aguarde e tente novamente."
    );
  }
  if (status >= 500) {
    return makeUpstreamError(
      details,
      503,
      "analysis_unavailable",
      "O serviço de análise está temporariamente indisponível."
    );
  }
  return makeUpstreamError(
    details,
    502,
    "analysis_failed",
    "A imagem não pôde ser analisada. Tente outra foto."
  );
}

function shouldRetryWithoutSchema(details) {
  return Number(details?.status) === 400 &&
    safeProviderText(details?.providerCode, 80).toUpperCase() === "INVALID_ARGUMENT" &&
    /schema|responseJsonSchema|response_json_schema|generationConfig/i.test(
      safeProviderText(details?.providerMessage, 240)
    );
}

function isTransientUpstreamFailure(details) {
  const status = Number(details?.status) || 0;
  const providerCode = safeProviderText(details?.providerCode, 80).toUpperCase();
  return [500, 502, 503, 504].includes(status) ||
    ["INTERNAL", "UNAVAILABLE", "DEADLINE_EXCEEDED"].includes(providerCode);
}

function waitForRetry(delayMs, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      reject(error);
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      reject(error);
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener?.("abort", onAbort);
      resolve();
    }, delayMs);
    signal?.addEventListener?.("abort", onAbort, { once: true });
  });
}

function enforceRateLimit(req, now = Date.now()) {
  const forwarded = getHeader(req, "x-forwarded-for");
  const key = forwarded.split(",")[0]?.trim() || getHeader(req, "x-real-ip") || "unknown";
  const maximum = Math.max(1, Math.min(60, Number(process.env.MAX_REQUESTS_PER_MINUTE || 10)));
  let bucket = requestBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) bucket = { startedAt: now, count: 0 };
  bucket.count += 1;
  requestBuckets.set(key, bucket);
  if (requestBuckets.size > 1000) {
    for (const [bucketKey, candidate] of requestBuckets.entries()) {
      if (now - candidate.startedAt >= RATE_LIMIT_WINDOW_MS) requestBuckets.delete(bucketKey);
    }
  }
  if (bucket.count > maximum) {
    throw new ApiError(429, "analysis_rate_limited", "Muitas análises foram solicitadas. Aguarde um minuto e tente novamente.");
  }
  return { remaining: Math.max(0, maximum - bucket.count) };
}

function normalizeModelName(value, fallback = DEFAULT_MODEL) {
  const normalized = String(value || "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^models\//i, "")
    .trim();
  return /^[a-z0-9._-]+$/i.test(normalized) ? normalized : fallback;
}

function modelCandidates(primary) {
  return [...new Set([
    normalizeModelName(primary),
    DEFAULT_MODEL,
    FALLBACK_MODEL,
    LEGACY_FLASH_MODEL,
    LEGACY_FLASH_LITE_MODEL
  ])];
}

function isModelNotFound(details) {
  return Number(details?.status) === 404 ||
    safeProviderText(details?.providerCode, 80).toUpperCase() === "NOT_FOUND";
}

function providerLabelForModel(model) {
  if (model === DEFAULT_MODEL) return "Gemini 3.5 Flash";
  if (model === FALLBACK_MODEL) return "Gemini 3.1 Flash Lite";
  if (model === LEGACY_FLASH_LITE_MODEL) return "Gemini 2.5 Flash Lite";
  if (model === LEGACY_FLASH_MODEL) return "Gemini 2.5 Flash";
  return "Gemini";
}

function transientRetryDelayMs(requestId, attempt = 0) {
  const seed = String(requestId || "pancreai");
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash * 31) + seed.charCodeAt(index)) >>> 0;
  }
  const base = GEMINI_TRANSIENT_RETRY_DELAY_MS * (2 ** Math.max(0, Number(attempt) || 0));
  const jitterRange = Math.max(1, Math.round(base * 0.25));
  return base - jitterRange + (hash % ((jitterRange * 2) + 1));
}

function requestForModel(request, model) {
  const generationConfig = { ...request.generationConfig };
  if (/^gemini-3(?:\.|-)/i.test(model)) {
    generationConfig.thinkingConfig = { thinkingLevel: "minimal" };
  }
  return { ...request, generationConfig };
}

function modelEndpoint(model) {
  return `${GEMINI_API_BASE_URL}/${encodeURIComponent(normalizeModelName(model))}:generateContent`;
}

async function callGemini({ apiKey, model, image, requestId }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  const request = createGeminiRequest({
    image,
    catalog: image.catalog,
    locale: image.locale
  });
  const candidates = modelCandidates(model);
  const send = (activeModel, body) => fetch(modelEndpoint(activeModel), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "X-Client-Request-Id": requestId
    },
    body: JSON.stringify(body),
    signal: controller.signal
  });
  const sendWithTransientRetry = async (activeModel, body, maximumAttempts) => {
    let response;
    let details = null;
    let attempts = 0;
    while (attempts < maximumAttempts) {
      try {
        response = await send(activeModel, body);
      } catch (error) {
        if (error?.name === "AbortError") throw error;
        details = {
          status: 503,
          providerCode: "NETWORK_ERROR",
          providerMessage: "Temporary connection failure"
        };
        attempts += 1;
        if (attempts >= maximumAttempts) break;
        await waitForRetry(transientRetryDelayMs(requestId, attempts - 1), controller.signal);
        continue;
      }
      attempts += 1;
      if (response.ok) return { response, details: null, attempts };
      details = await readUpstreamError(response);
      if (!isTransientUpstreamFailure(details) || attempts >= maximumAttempts) break;
      console.warn("[PancreAI analyze-meal transient-retry]", {
        requestId,
        model: activeModel,
        attempt: attempts,
        upstreamStatus: details.status,
        upstreamCode: details.providerCode || undefined
      });
      await waitForRetry(transientRetryDelayMs(requestId, attempts - 1), controller.signal);
    }
    return { response, details, attempts };
  };

  try {
    let lastDetails = null;
    for (let index = 0; index < candidates.length; index += 1) {
      const activeModel = candidates[index];
      const modelRequest = requestForModel(request, activeModel);
      const isCurrentCapacityModel = activeModel === DEFAULT_MODEL || activeModel === FALLBACK_MODEL;
      const maximumAttempts = index === 0 || isCurrentCapacityModel
        ? GEMINI_TRANSIENT_RETRY_LIMIT + 1
        : 1;
      let upstream = await sendWithTransientRetry(activeModel, modelRequest, maximumAttempts);

      let response = upstream.response;
      if (!response || !response.ok) {
        let details = upstream.details;
        if (shouldRetryWithoutSchema(details)) {
          const schemaFallbackRequest = {
            ...modelRequest,
            generationConfig: { ...modelRequest.generationConfig }
          };
          delete schemaFallbackRequest.generationConfig.responseJsonSchema;
          upstream = await sendWithTransientRetry(activeModel, schemaFallbackRequest, 1);

          response = upstream.response;
          if (!response || !response.ok) details = upstream.details;
        }
        if (!response || !response.ok) {
          lastDetails = details;
          const nextModel = candidates[index + 1];
          if (nextModel && (
            isModelNotFound(details) ||
            isTransientUpstreamFailure(details) ||
            shouldRetryWithoutSchema(details)
          )) {
            console.warn("[PancreAI analyze-meal model-fallback]", {
              requestId,
              fromModel: activeModel,
              toModel: nextModel,
              upstreamStatus: details.status,
              upstreamCode: details.providerCode || undefined
            });
            continue;
          }
          throw upstreamError(details);
        }
      }

      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new ApiError(502, "invalid_ai_response", "A IA retornou uma resposta inesperada.");
      }
      return {
        ...parseAndNormalizeGeminiResponse(payload, image.catalog),
        providerLabel: providerLabelForModel(activeModel),
        metadata: { model: activeModel }
      };
    }
    throw upstreamError(lastDetails || { status: 404, providerCode: "NOT_FOUND" });
  } catch (error) {
    if (controller.signal.aborted && !(error instanceof ApiError)) {
      throw new ApiError(504, "analysis_timeout", "A análise demorou demais. Tente novamente.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function handler(req, res) {
  const requestId = randomUUID();
  const allowedOrigins = allowedOriginsForRequest(req);
  const origin = getHeader(req, "origin");
  applyBaseHeaders(res, requestId);

  if (!isOriginAllowed(origin, allowedOrigins)) {
    return sendJson(res, 403, {
      error: { code: "origin_not_allowed", message: "Esta origem não tem permissão para usar a análise.", requestId }
    });
  }
  applyCorsHeaders(req, res, allowedOrigins);

  const method = String(req.method || "GET").toUpperCase();
  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.removeHeader("Content-Type");
    return res.end();
  }
  if (method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, {
      error: { code: "method_not_allowed", message: "Use o método POST para analisar uma refeição.", requestId }
    });
  }

  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return sendJson(res, 503, {
      error: { code: "service_not_configured", message: "O serviço de análise ainda não foi configurado.", requestId }
    });
  }

  try {
    enforceRateLimit(req);
    const image = await readImageRequest(req);
    if (image.usageContext !== RESPONSIBLE_ADULT_CONTEXT) {
      throw new ApiError(403, "adult_context_required", "A análise deve ser iniciada por um responsável adulto.");
    }
    const result = await callGemini({
      apiKey,
      model: normalizeModelName(process.env.GEMINI_MODEL, DEFAULT_MODEL),
      image,
      requestId
    });
    return sendJson(res, 200, result);
  } catch (error) {
    const safeError = safeApiError(error);
    console.error("[PancreAI analyze-meal]", {
      requestId,
      code: safeError.code,
      status: safeError.status,
      errorType: error?.name || "Error",
      upstreamStatus: error?.upstreamStatus || undefined,
      upstreamCode: error?.upstreamCode || undefined
    });
    return sendJson(res, safeError.status, {
      error: { code: safeError.code, message: safeError.message, requestId }
    });
  }
}

module.exports = handler;
module.exports._private = {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
  LEGACY_FLASH_MODEL,
  LEGACY_FLASH_LITE_MODEL,
  GEMINI_TIMEOUT_MS,
  GEMINI_TRANSIENT_RETRY_DELAY_MS,
  GEMINI_TRANSIENT_RETRY_LIMIT,
  allowedOriginsForRequest,
  callGemini,
  enforceRateLimit,
  isModelNotFound,
  isTransientUpstreamFailure,
  modelCandidates,
  modelEndpoint,
  normalizeModelName,
  providerLabelForModel,
  readUpstreamError,
  requestForModel,
  shouldRetryWithoutSchema,
  transientRetryDelayMs,
  upstreamError
};
