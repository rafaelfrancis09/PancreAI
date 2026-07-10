(function () {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
  let toastTimerId = null;

  function playPopAnimation(element) {
    if (!element || prefersReducedMotion) {
      return;
    }
    element.classList.remove("ui-pop");
    void element.offsetWidth;
    element.classList.add("ui-pop");
    window.setTimeout(() => element.classList.remove("ui-pop"), 280);
  }

  function animateRemoveElement(element, callback) {
    if (!element || prefersReducedMotion) {
      callback?.();
      return;
    }
    element.classList.add("ui-removing");
    window.setTimeout(() => callback?.(), 230);
  }

  function highlight(element) {
    if (!element || prefersReducedMotion) {
      return;
    }
    element.classList.remove("ui-highlight");
    void element.offsetWidth;
    element.classList.add("ui-highlight");
    window.setTimeout(() => element.classList.remove("ui-highlight"), 780);
  }

  function showToast(message) {
    if (!message) {
      return;
    }
    let toast = document.querySelector(".pa-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "pa-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    window.clearTimeout(toastTimerId);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    toastTimerId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function triggerSoftHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }
  }

  window.PancreAIPolish = {
    animateRemoveElement,
    highlight,
    playPopAnimation,
    showToast,
    triggerSoftHaptic
  };
})();