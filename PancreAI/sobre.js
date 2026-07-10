const topbar = document.querySelector("#topbar");
const backBtn = document.querySelector("#backBtn");
const continueBtn = document.querySelector("#continueBtn");
const app = document.querySelector("#app");
const core = window.PancreAICore;
const query = new URLSearchParams(window.location.search);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const INTRO_TRANSITION_KEY = "pancreaiIntroTransition";

const source = query.get("source") || "intro";
const nextFromQuery = query.get("next");

function isSafeInternalRoute(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]+\.html$/.test(value);
}

function getNextRoute() {
  if (isSafeInternalRoute(nextFromQuery)) {
    return nextFromQuery;
  }
  if (!core.isSetupComplete()) {
    return "configuracao.html";
  }
  return "home.html";
}

if (source === "profile") {
  topbar.hidden = false;
  continueBtn.textContent = "Voltar ao perfil";
}

const transitionSource = sessionStorage.getItem(INTRO_TRANSITION_KEY);
if (source === "intro" && transitionSource === "intro-to-about" && !prefersReducedMotion) {
  app.dataset.enter = "intro";
  sessionStorage.removeItem(INTRO_TRANSITION_KEY);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      app.dataset.enter = "ready";
    });
  });
} else {
  sessionStorage.removeItem(INTRO_TRANSITION_KEY);
}

backBtn.addEventListener("click", () => {
  window.location.href = source === "profile" ? "profile.html" : "index.html";
});

continueBtn.addEventListener("click", () => {
  window.location.href = source === "profile" ? "profile.html" : getNextRoute();
});

core.applyGlobalPreferences();
