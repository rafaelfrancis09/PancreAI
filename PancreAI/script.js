const app = document.querySelector("#app");
const buttons = Array.from(document.querySelectorAll(".cta"));
const plate = document.querySelector(".plate");
const availableLanguageGrid = document.querySelector("#availableLanguageGrid");
const languageContinueBtn = document.querySelector("#languageContinueBtn");
const futureLanguageGrid = document.querySelector("#futureLanguageGrid");
const languageToast = document.querySelector("#languageToast");
const languageHeaderTitle = document.querySelector(".language-header h1");
const languageHeaderText = document.querySelector(".language-header p");
const availableLanguageTitle = document.querySelector("#availableLanguageTitle");
const futureLanguagesTitle = document.querySelector("#futureLanguagesTitle");
const futureLanguagesText = document.querySelector(".language-section--future .language-section__top p");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const INTRO_TRANSITION_KEY = "pancreaiIntroTransition";
const LANGUAGE_STORAGE_KEY = "pancreai_selected_language";
const LANGUAGE_SETTINGS_KEY = "pancreai_language_settings";
const i18n = window.PancreAII18n;
const pageQuery = new URLSearchParams(window.location.search);
const languageOnlyMode = pageQuery.get("language") === "1";
const languageReturnTarget = pageQuery.get("return") === "profile" ? "profile.html" : null;

const targetAfterIntro = hasRequiredSetup() ? "home.html" : "configuracao.html";
const explanationScreen = targetAfterIntro;

const autoAdvanceDelayByScene = {
  splash: prefersReducedMotion ? 600 : 2700
};

let timerId = null;
let sceneTransitionTimerId = null;
let languageToastTimerId = null;
let selectedLanguageCode = i18n?.getCurrentLanguage?.() || "pt-BR";

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function hasRequiredSetup() {
  const setupComplete = localStorage.getItem("pancreaiSetupComplete") === "true";
  const weight = Number(localStorage.getItem("pancreaiWeight") || 0);
  const lipaseDose = Number(localStorage.getItem("pancreaiLipaseDose") || 0);
  const treatmentStore = readJson("pancreai_treatment_settings", null);
  const treatment = treatmentStore?.treatment || treatmentStore;
  const lipaseUnits = Number(treatment?.lipaseUnitsPerUnit || localStorage.getItem("pancreaiCapsuleStrength") || 0);
  return setupComplete && weight > 0 && lipaseDose > 0 && lipaseUnits > 0;
}
function getStoredLanguageCode() {
  const settings = readJson(LANGUAGE_SETTINGS_KEY, null);
  return settings?.languageCode || localStorage.getItem(LANGUAGE_STORAGE_KEY) || null;
}

function hasSelectedLanguage() {
  return Boolean(getStoredLanguageCode());
}

function translate(key, params) {
  return i18n?.t?.(key, params) || key;
}

function setScene(scene) {
  app.dataset.scene = scene;
  window.PancreAIProgressDots?.scheduleRefresh?.(app);
}

function getNextScene(scene) {
  if (scene === "splash") return hasSelectedLanguage() ? "intro-1" : "language";
  if (scene === "language") return "intro-1";
  if (scene === "intro-1") return "intro-2";
  if (scene === "intro-2") return "intro-3";
  if (scene === "intro-3") return explanationScreen;
  return "intro-1";
}

function goToTarget() {
  sessionStorage.setItem(INTRO_TRANSITION_KEY, "intro-to-treatment");
  if (prefersReducedMotion) {
    window.location.href = explanationScreen;
    return;
  }
  app.dataset.leaving = "treatment";
  window.setTimeout(() => {
    window.location.href = explanationScreen;
  }, 260);
}

function transitionFromSplash(nextScene) {
  window.clearTimeout(sceneTransitionTimerId);
  if (prefersReducedMotion) {
    setScene(nextScene);
    return;
  }
  app.dataset.leaving = "splash";
  sceneTransitionTimerId = window.setTimeout(() => {
    setScene(nextScene);
    delete app.dataset.leaving;
    app.dataset.entering = "after-splash";
    sceneTransitionTimerId = window.setTimeout(() => {
      delete app.dataset.entering;
      sceneTransitionTimerId = null;
    }, 320);
  }, 340);
}

function scheduleAutoAdvance(scene) {
  const delay = autoAdvanceDelayByScene[scene];
  if (delay) {
    timerId = window.setTimeout(advance, delay);
  }
}

function advance() {
  const currentScene = app.dataset.scene;
  const nextScene = getNextScene(currentScene);
  if (nextScene === explanationScreen) {
    goToTarget();
    return;
  }

  if (currentScene === "splash") {
    transitionFromSplash(nextScene);
    return;
  }
  setScene(nextScene);
  scheduleAutoAdvance(nextScene);
}

function handleButtonClick() {
  const currentScene = app.dataset.scene;

  if (timerId) {
    window.clearTimeout(timerId);
    timerId = null;
  }

  const nextScene = getNextScene(currentScene);
  if (nextScene === explanationScreen) {
    goToTarget();
    return;
  }

  setScene(nextScene);
}

function languageBadge(language) {
  return language.status === "available"
    ? translate("common.availableNow")
    : translate("common.comingSoon");
}

function renderAvailableLanguages() {
  if (!availableLanguageGrid || !i18n) return;

  const languages = i18n.getAvailableLanguages();
  availableLanguageGrid.innerHTML = languages.map((language) => {
    const selected = i18n.normalizeLanguageCode(language.code) === i18n.normalizeLanguageCode(selectedLanguageCode);
    return `
      <button class="language-option language-option--available${selected ? " is-selected" : ""}" type="button" data-language="${language.code}" data-country="${language.countryCode}" aria-pressed="${selected ? "true" : "false"}">
        <span class="language-option__flag" data-flag-code="${language.countryCode}" data-flag-size="32"></span>
        <span class="language-option__text">
          <strong dir="auto">${language.nativeLabel} <span class="language-code-pill">${language.short}</span></strong>
          <small>${language.description}</small>
        </span>
        <span class="language-option__badge">${languageBadge(language)}</span>
        <span class="language-option__check" aria-hidden="true">✓</span>
      </button>
    `;
  }).join("");

  window.PancreAIFlags?.mount(availableLanguageGrid);
}

function renderFutureLanguages() {
  if (!futureLanguageGrid || !i18n) return;

  futureLanguageGrid.innerHTML = i18n.getComingSoonLanguages().map((language) => `
    <button class="language-option language-option--future" type="button" data-language="${language.code}" aria-disabled="true">
      <span class="language-option__flag" data-flag-code="${language.countryCode}" data-flag-size="28"></span>
      <span class="language-option__text">
        <strong dir="${language.dir || "auto"}">${language.label} <span class="language-code-pill">${language.short}</span></strong>
      </span>
      <span class="language-option__badge language-option__badge--soon">${translate("common.comingSoon")}</span>
      <span class="language-option__lock" aria-hidden="true"></span>
    </button>
  `).join("");

  window.PancreAIFlags?.mount(futureLanguageGrid);
}

function applyLanguageCopy() {
  if (languageHeaderTitle) languageHeaderTitle.textContent = translate("language.title");
  if (languageHeaderText) languageHeaderText.textContent = translate("language.description");
  if (availableLanguageTitle) availableLanguageTitle.textContent = translate("language.availableTitle");
  if (futureLanguagesTitle) futureLanguagesTitle.textContent = translate("language.futureTitle");
  if (futureLanguagesText) futureLanguagesText.textContent = translate("language.futureDescription");
  if (languageContinueBtn) languageContinueBtn.textContent = translate("language.continue");
  if (languageToast) languageToast.textContent = translate("language.toastFuture");

  const introCopy = [
    [".scene--intro-1", "intro.welcomeTitle", "intro.welcomeText", "common.next"],
    [".scene--intro-2", "intro.reviewTitle", "intro.reviewText", "common.next"],
    [".scene--intro-3", "intro.setupTitle", "intro.setupText", "common.continue"]
  ];

  introCopy.forEach(([selector, titleKey, textKey, buttonKey]) => {
    const scene = document.querySelector(selector);
    const title = scene?.querySelector(".card__copy h1");
    const text = scene?.querySelector(".card__copy p");
    const button = scene?.querySelector(".cta");
    if (title) title.textContent = translate(titleKey);
    if (text) text.textContent = translate(textKey);
    if (button) button.textContent = translate(buttonKey);
  });
}

function refreshLanguageScreen() {
  applyLanguageCopy();
  renderAvailableLanguages();
  renderFutureLanguages();
}

function showLanguageToast() {
  if (!languageToast) return;

  languageToast.textContent = translate("language.toastFuture");
  languageToast.classList.add("is-visible");
  if (languageToastTimerId) {
    window.clearTimeout(languageToastTimerId);
  }
  languageToastTimerId = window.setTimeout(() => {
    languageToast.classList.remove("is-visible");
  }, 2300);
}

function selectLanguage(languageCode) {
  selectedLanguageCode = i18n?.normalizeLanguageCode?.(languageCode) || languageCode;
  const language = i18n?.getAvailableLanguages?.().find((item) => {
    return i18n.normalizeLanguageCode(item.code) === i18n.normalizeLanguageCode(selectedLanguageCode);
  });
  i18n?.setCurrentLanguage?.(selectedLanguageCode, language?.countryCode);
  refreshLanguageScreen();
  if (languageContinueBtn) {
    languageContinueBtn.disabled = false;
  }
}

function continueWithSelectedLanguage() {
  const language = i18n?.getAvailableLanguages?.().find((item) => {
    return i18n.normalizeLanguageCode(item.code) === i18n.normalizeLanguageCode(selectedLanguageCode);
  });

  i18n?.setCurrentLanguage?.(selectedLanguageCode, language?.countryCode);
  applyLanguageCopy();

  if (languageReturnTarget) {
    window.location.href = languageReturnTarget;
    return;
  }

  setScene("intro-1");
}

buttons.forEach((button) => button.addEventListener("click", handleButtonClick));

availableLanguageGrid?.addEventListener("click", (event) => {
  const availableButton = event.target.closest(".language-option--available");
  if (!availableButton) return;
  selectLanguage(availableButton.dataset.language);
});

languageContinueBtn?.addEventListener("click", continueWithSelectedLanguage);

futureLanguageGrid?.addEventListener("click", (event) => {
  const futureButton = event.target.closest(".language-option--future");
  if (!futureButton) return;
  futureButton.classList.add("is-tapped");
  window.setTimeout(() => futureButton.classList.remove("is-tapped"), 180);
  showLanguageToast();
});

function enablePlateFallback() {
  app.dataset.pratoFallback = "true";
}

if (plate) {
  plate.addEventListener("error", enablePlateFallback);
  plate.addEventListener("load", () => {
    delete app.dataset.pratoFallback;
  });

  if (plate.complete && plate.naturalWidth === 0) {
    enablePlateFallback();
  }
}

refreshLanguageScreen();
window.PancreAIFlags?.mount(document);

if (languageOnlyMode) {
  setScene("language");
} else {
  scheduleAutoAdvance("splash");
}