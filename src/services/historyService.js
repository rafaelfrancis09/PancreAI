(function () {
  const core = window.PancreAICore;

  // O histórico permanece local para evitar exposição desnecessária de dados sensíveis de saúde.
  function getHistory() {
    return core?.getHistory ? core.getHistory() : [];
  }

  function saveHistory(items) {
    if (core?.saveHistory) core.saveHistory(items);
  }

  function saveMealRecord(record) {
    if (core?.saveMealRecord) {
      core.saveMealRecord({
        ...record,
        provider: record.provider || "gemini",
        providerLabel: record.providerLabel || "Gemini 3.5 Flash",
        isSimulated: record.isSimulated ?? false
      });
    }
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    historyService: {
      getHistory,
      saveHistory,
      saveMealRecord
    }
  };
})();
