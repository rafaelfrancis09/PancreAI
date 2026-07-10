/* Animated progress indicators for PancreAI onboarding/tutorial dots. */
(function () {
  const CONTAINER_SELECTOR = ".pager, .tutorial-dots, .pagination-indicator";
  const ACTIVE_SELECTOR = ".pager__dot--active, .dot-btn.is-active, .pagination-dot--active, [aria-current='step']";

  function ensureIndicator(container) {
    let indicator = container.querySelector(":scope > .progress-dots-active");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "progress-dots-active";
      indicator.setAttribute("aria-hidden", "true");
      container.appendChild(indicator);
    }
    container.classList.add("progress-dots-animated");
    return indicator;
  }

  function refresh(container) {
    if (!container || !container.isConnected) return;
    const active = container.querySelector(ACTIVE_SELECTOR);
    const indicator = ensureIndicator(container);
    if (!active) {
      indicator.style.opacity = "0";
      return;
    }
    const containerBox = container.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const left = activeBox.left - containerBox.left;
    const top = activeBox.top - containerBox.top;
    indicator.style.opacity = "1";
    indicator.style.width = activeBox.width + "px";
    indicator.style.height = activeBox.height + "px";
    indicator.style.transform = "translate3d(" + left + "px, " + top + "px, 0)";
  }

  function refreshAll(root) {
    const target = root && root.querySelectorAll ? root : document;
    if (target.matches?.(CONTAINER_SELECTOR)) refresh(target);
    target.querySelectorAll(CONTAINER_SELECTOR).forEach(refresh);
  }

  function scheduleRefresh(root) {
    const target = root || document;
    window.requestAnimationFrame(function () {
      refreshAll(target);
      window.setTimeout(function () { refreshAll(target); }, 140);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { scheduleRefresh(document); });
  } else {
    scheduleRefresh(document);
  }

  window.addEventListener("resize", function () { scheduleRefresh(document); });
  window.addEventListener("pancreai:languagechange", function () { scheduleRefresh(document); });

  window.PancreAIProgressDots = {
    refresh,
    refreshAll,
    scheduleRefresh
  };
})();
