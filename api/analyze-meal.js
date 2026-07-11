const { randomUUID } = require("node:crypto");
const {
  ApiError,
  createOpenAIRequest,
  isOriginAllowed,
  parseAllowedOrigins,
  parseAndNormalizeOpenAIResponse,
  readImageRequest
} = require("./_lib/meal-analysis");

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";
const OPENAI_TIMEOUT_MS = 25_000;
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

function upstreamError(status) {
  if (status === 429) {
    return new ApiError(429, "analysis_rate_limited", "O serviço de análise está ocupado. Aguarde um momento e tente novamente.");
  }
  if (status === 401 || status === 403) {
    return new ApiError(503, "analysis_unavailable", "O serviço de análise ainda não está disponível.");
  }
  if (status >= 500) {
    return new ApiError(503, "analysis_unavailable", "O serviço de análise está temporariamente indisponível.");
  }
  return new ApiError(502, "analysis_failed", "A imagem não pôde ser analisada. Tente outra foto.");
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

async function callOpenAI({ apiKey, model, image, requestId }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Client-Request-Id": requestId
      },
      body: JSON.stringify(createOpenAIRequest({
        model,
        dataUrl: image.dataUrl,
        catalog: image.catalog,
        locale: image.locale
      })),
      signal: controller.signal
    });

    if (!response.ok) throw upstreamError(response.status);

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError(502, "invalid_ai_response", "A IA retornou uma resposta inesperada.");
    }
    return parseAndNormalizeOpenAIResponse(payload, image.catalog);
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

  if (String(req.method || "GET").toUpperCase() === "OPTIONS") {
    res.statusCode = 204;
    res.removeHeader("Content-Type");
    return res.end();
  }
  if (String(req.method || "GET").toUpperCase() !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, {
      error: { code: "method_not_allowed", message: "Use o método POST para analisar uma refeição.", requestId }
    });
  }

  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return sendJson(res, 503, {
      error: { code: "service_not_configured", message: "O serviço de análise ainda não foi configurado.", requestId }
    });
  }

  try {
    enforceRateLimit(req);
    const image = await readImageRequest(req);
    const result = await callOpenAI({
      apiKey,
      model: String(process.env.OPENAI_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL,
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
      errorType: error?.name || "Error"
    });
    return sendJson(res, safeError.status, {
      error: { code: safeError.code, message: safeError.message, requestId }
    });
  }
}

module.exports = handler;
module.exports._private = {
  DEFAULT_MODEL,
  OPENAI_TIMEOUT_MS,
  allowedOriginsForRequest,
  callOpenAI,
  enforceRateLimit,
  upstreamError
};
