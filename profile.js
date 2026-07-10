const homeNav = document.querySelector("#homeNav");
const remindersNav = document.querySelector("#remindersNav");
const aboutNav = document.querySelector("#aboutNav");
const termsNav = document.querySelector("#termsNav");
const configNav = document.querySelector("#configNav");
const languageNav = document.querySelector("#languageNav");
const unidadeNav = document.querySelector("#unidadeNav");
const favoritesNav = document.querySelector("#favoritesNav");
const tutorialNav = document.querySelector("#tutorialNav");
const reportNav = document.querySelector("#reportNav");
const historyNav = document.querySelector("#historyNav");
const medicalAlertsToggle = document.querySelector("#medicalAlertsToggle");
const childModeToggle = document.querySelector("#childModeToggle");
const responsibleEntryBtn = document.querySelector("#responsibleEntryBtn");
const profileModal = document.querySelector("#profileModal");
const profileModalTitle = document.querySelector("#profileModalTitle");
const profileModalText = document.querySelector("#profileModalText");
const profileModalCancel = document.querySelector("#profileModalCancel");
const profileModalConfirm = document.querySelector("#profileModalConfirm");
const profileModalCancelOverlay = document.querySelector("#profileModalCancelOverlay");
const core = window.PancreAICore;
const i18n = window.PancreAII18n;

let pendingModalConfirm = null;

function translate(key, params) {
  return i18n?.t?.(key, params) || key;
}

if (!core.isSetupComplete()) {
  localStorage.setItem("pancreaiReturnTo", "profile.html");
  window.location.replace("configuracao.html");
}

function disableTransitions() {
  const style = document.createElement("style");
  style.textContent = ".switch__track, .switch__track::after { transition: none !important; animation: none !important; }";
  document.head.appendChild(style);
  style.id = "temp-no-transition";
}

function enableTransitions() {
  const style = document.getElementById("temp-no-transition");
  if (style) style.remove();
}

function openProfileModal({ title, text, confirmText, cancelText = "Cancelar", onConfirm }) {
  pendingModalConfirm = onConfirm;
  profileModalTitle.textContent = title;
  profileModalText.textContent = text;
  profileModalCancel.textContent = cancelText;
  profileModalConfirm.textContent = confirmText;
  profileModal.hidden = false;
  profileModal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => profileModal.classList.add("is-open"));
  profileModalConfirm.focus();
}

function closeProfileModal() {
  profileModal.classList.remove("is-open");
  profileModal.setAttribute("aria-hidden", "true");
  pendingModalConfirm = null;
  window.setTimeout(() => {
    profileModal.hidden = true;
  }, 160);
  loadToggleState();
}

function confirmProfileModal() {
  const callback = pendingModalConfirm;
  pendingModalConfirm = null;
  profileModal.classList.remove("is-open");
  profileModal.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    profileModal.hidden = true;
  }, 160);
  if (callback) callback();
}

function applyProfileCopy() {
  const subtitle = document.querySelector(".profile-header p");
  const groupTitles = Array.from(document.querySelectorAll(".profile-group h2"));
  const rowLabels = {
    configNav: "treatment.title",
    languageNav: "nav.language",
    unidadeNav: "Unidade de medida",
    remindersNav: "profile.mealReminders",
    favoritesNav: "profile.favoriteMeals",
    tutorialNav: "profile.photoTutorial",
    reportNav: "profile.medicalReport",
    aboutNav: "profile.aboutFlow",
    termsNav: "nav.terms"
  };

  document.title = "PancreAI - " + translate("nav.profile");
  if (subtitle) subtitle.textContent = translate("profile.subtitle");
  if (groupTitles[0]) groupTitles[0].textContent = translate("profile.preferences");
  if (groupTitles[1]) groupTitles[1].textContent = translate("profile.notifications");
  if (groupTitles[2]) groupTitles[2].textContent = translate("profile.security");
  if (groupTitles[3]) groupTitles[3].textContent = translate("profile.about");

  Object.entries(rowLabels).forEach(([id, key]) => {
    const label = document.querySelector(`#${id} .profile-row__label`);
    if (!label) return;
    label.textContent = key.includes(".") ? translate(key) : key;
  });

  const childModeLabel = childModeToggle?.closest(".profile-row")?.querySelector(".profile-row__label");
  const medicalLabel = medicalAlertsToggle?.closest(".profile-row")?.querySelector(".profile-row__label");
  if (childModeLabel) childModeLabel.textContent = translate("profile.childMode");
  if (medicalLabel) medicalLabel.textContent = translate("profile.medicalAlerts");

  const navLabels = [
    ["#historyNav small", "nav.history"],
    ["#homeNav small", "nav.home"],
    [".bottom-nav__item--active small", "nav.profile"]
  ];
  navLabels.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = translate(key);
  });
}

function applyChildProfileState() {
  const enabled = core.isChildMode();
  const subtitle = document.querySelector(".profile-header p");
  const historyLabel = document.querySelector("#historyNav small");
  const profileLabel = document.querySelector(".bottom-nav__item--active small");

  document.body.classList.toggle("responsible-area", enabled);
  document.body.classList.toggle("responsible-unlocked", hasResponsibleAccess());
  if (subtitle) subtitle.textContent = enabled ? "Área do responsável" : translate("profile.subtitle");
  if (historyLabel) historyLabel.textContent = enabled ? "Refeições" : translate("nav.history");
  if (profileLabel) profileLabel.textContent = enabled ? "Responsável" : translate("nav.profile");

  window.PancreAIIcons?.mount(document);
}

function loadToggleState() {
  disableTransitions();
  medicalAlertsToggle.checked = core.isMedicalWarningsEnabled();
  childModeToggle.checked = core.isChildMode();

  requestAnimationFrame(() => {
    enableTransitions();
  });
}

function hasResponsibleAccess() {
  return sessionStorage.getItem("pancreaiResponsibleAccess") === "true";
}

function setResponsibleSession() {
  sessionStorage.setItem("pancreaiResponsibleAccess", "true");
  document.body.classList.add("responsible-unlocked");
}

function openResponsibleGate(targetUrl) {
  openProfileModal({
    title: "Área do Responsável",
    text: "Essa área contém dados importantes do tratamento e configurações do cálculo.",
    confirmText: "Continuar como responsável",
    onConfirm: () => {
      setResponsibleSession();
      if (targetUrl) window.location.href = targetUrl;
    }
  });
}

function navigateProtected(targetUrl) {
  if (core.isChildMode() && !hasResponsibleAccess()) {
    openProfileModal({
      title: "Área do Responsável",
      text: "Essa informação precisa ser revisada por um responsável.",
      confirmText: "Ir para Área do Responsável",
      onConfirm: () => {
        setResponsibleSession();
        window.location.href = targetUrl;
      }
    });
    return;
  }
  window.location.href = targetUrl;
}

medicalAlertsToggle.addEventListener("change", () => {
  const nextValue = medicalAlertsToggle.checked;
  if (core.isChildMode() && !hasResponsibleAccess()) {
    medicalAlertsToggle.checked = core.isMedicalWarningsEnabled();
    navigateProtected("profile.html");
    return;
  }
  core.setMedicalWarningsEnabled(nextValue);
  core.applyGlobalPreferences();
});

childModeToggle.addEventListener("change", () => {
  const desiredValue = childModeToggle.checked;
  childModeToggle.checked = core.isChildMode();
  openProfileModal({
    title: desiredValue ? "Ativar Modo Infantil?" : "Desativar Modo Infantil?",
    text: desiredValue
      ? "O app vai mostrar apenas o essencial para revisar refeições. Configurações de tratamento, dose, medicamento e histórico completo continuarão disponíveis na Área do Responsável."
      : "O app voltará a mostrar a experiência completa.",
    confirmText: desiredValue ? "Ativar" : "Desativar",
    onConfirm: () => {
      core.setChildModeEnabled(desiredValue);
      core.applyGlobalPreferences();
      loadToggleState();
      applyProfileCopy();
      applyChildProfileState();
    }
  });
});

responsibleEntryBtn?.addEventListener("click", () => openResponsibleGate());
profileModalCancel.addEventListener("click", closeProfileModal);
profileModalCancelOverlay.addEventListener("click", closeProfileModal);
profileModalConfirm.addEventListener("click", confirmProfileModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !profileModal.hidden) closeProfileModal();
});

homeNav.addEventListener("click", () => {
  window.location.href = "home.html";
});

remindersNav.addEventListener("click", () => navigateProtected("lembrete.html"));
aboutNav.addEventListener("click", () => navigateProtected("como-funciona.html?source=profile"));
termsNav.addEventListener("click", () => navigateProtected("termos.html"));

configNav.addEventListener("click", () => {
  localStorage.setItem("pancreaiReturnTo", "profile.html");
  navigateProtected("configuracao.html?from=profile&responsible=1");
});

languageNav?.addEventListener("click", () => {
  window.location.href = "index.html?language=1&return=profile";
});

favoritesNav.addEventListener("click", () => {
  window.location.href = "favoritos.html";
});

tutorialNav.addEventListener("click", () => {
  window.location.href = "tutorial.html";
});

reportNav.addEventListener("click", () => navigateProtected("relatorio.html"));
unidadeNav.addEventListener("click", () => navigateProtected("unidade.html"));

historyNav.addEventListener("click", () => {
  window.location.href = "historico.html";
});

applyProfileCopy();
loadToggleState();
core.applyGlobalPreferences();
applyChildProfileState();
