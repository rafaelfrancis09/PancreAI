const { LOCAL_ANALYSIS_INFO } = require("./_lib/meal-analysis");

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(payload));
}

function handler(req, res) {
  const method = String(req.method || "GET").toUpperCase();
  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.end();
  }
  if (method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return sendJson(res, 405, {
      error: {
        code: "local_analysis_only",
        message: "A análise agora é executada no navegador; nenhuma foto deve ser enviada a este endpoint."
      },
      analysis: LOCAL_ANALYSIS_INFO
    });
  }
  return sendJson(res, 200, LOCAL_ANALYSIS_INFO);
}

module.exports = handler;
