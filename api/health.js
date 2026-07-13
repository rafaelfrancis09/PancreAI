const { randomUUID } = require("node:crypto");
const { isOriginAllowed, parseAllowedOrigins } = require("./_lib/meal-analysis");

function header(req, name) {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : String(value || "");
}

function allowedOrigins(req) {
  const allowed = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
  const host = header(req, "x-forwarded-host") || header(req, "host");
  const protocol = (header(req, "x-forwarded-proto") || "https").split(",")[0].trim();
  if (host && ["http", "https"].includes(protocol)) allowed.add(`${protocol}://${host}`);
  return allowed;
}

module.exports = function health(req, res) {
  const requestId = randomUUID();
  const method = String(req.method || "GET").toUpperCase();
  const origin = header(req, "origin");
  const allowed = allowedOrigins(req);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Request-Id", requestId);

  if (!isOriginAllowed(origin, allowed)) {
    res.statusCode = 403;
    return res.end(JSON.stringify({ ok: false, configured: false, error: "origin_not_allowed", requestId }));
  }
  if (origin) res.setHeader("Access-Control-Allow-Origin", allowed.has("*") ? "*" : new URL(origin).origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.removeHeader("Content-Type");
    return res.end();
  }
  if (method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, configured: false, error: "method_not_allowed", requestId }));
  }

  const configured = Boolean(String(process.env.GEMINI_API_KEY || "").trim());
  res.statusCode = configured ? 200 : 503;
  return res.end(JSON.stringify({
    ok: configured,
    configured,
    service: "pancreai-gemini-vision",
    provider: "gemini",
    version: "2026-07-13-mit-bridge1",
    requestId
  }));
};
