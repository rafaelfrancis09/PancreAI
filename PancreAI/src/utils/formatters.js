(function () {
  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function roundTo(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round(toNumber(value) * factor) / factor;
  }

  function formatUnits(value) {
    return Math.round(toNumber(value)).toLocaleString("pt-BR");
  }

  window.PancreAIUtils = {
    ...(window.PancreAIUtils || {}),
    formatters: {
      toNumber,
      roundTo,
      formatUnits
    }
  };
})();
