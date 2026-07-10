(function () {
  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function createId(prefix) {
    const safePrefix = slugify(prefix || "item") || "item";
    return `${safePrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  window.PancreAIUtils = {
    ...(window.PancreAIUtils || {}),
    ids: {
      slugify,
      createId
    }
  };
})();
