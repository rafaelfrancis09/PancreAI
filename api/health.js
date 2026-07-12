const { LOCAL_ANALYSIS_INFO } = require("./_lib/meal-analysis");

module.exports = function handler(_req, res) {
  res.statusCode = 200;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify({
    ok: true,
    configured: true,
    serverRequired: false,
    provider: LOCAL_ANALYSIS_INFO.provider,
    execution: LOCAL_ANALYSIS_INFO.execution
  }));
};
