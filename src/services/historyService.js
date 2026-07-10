(function () {
  const core = window.PancreAICore;

  // O histórico permanece local nesta versão para evitar exposição de dados sensíveis de saúde.
  function getHistory() {
    return core?.getHistory ? core.getHistory() : [];
  }

  function saveHistory(items) {
    if (core?.saveHistory) {
      core.saveHistory(items);
    }
  }

  function saveMealRecord(record) {
    if (core?.saveMealRecord) {
      core.saveMealRecord({
        ...record,
        provider: record.provider || "mock"
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
