const INTRO_TRANSITION_KEY = "pancreaiIntroTransition";
if (sessionStorage.getItem(INTRO_TRANSITION_KEY) === "intro-to-treatment") {
  document.documentElement.classList.add("pa-from-intro");
  sessionStorage.removeItem(INTRO_TRANSITION_KEY);
  window.setTimeout(() => document.documentElement.classList.remove("pa-from-intro"), 420);
}
const backBtn = document.querySelector("#backBtn");
const weightInput = document.querySelector("#weightInput");
const lipaseInput = document.querySelector("#lipaseInput");
const countrySelect = document.querySelector("#countrySelect");
const medicationOptions = document.querySelector("#medicationOptions");
const customMedicationFields = document.querySelector("#customMedicationFields");
const customMedicationName = document.querySelector("#customMedicationName");
const customMedicationForm = document.querySelector("#customMedicationForm");
const customUnitLabel = document.querySelector("#customUnitLabel");
const customLipaseUnits = document.querySelector("#customLipaseUnits");
const customAmylaseUnits = document.querySelector("#customAmylaseUnits");
const customProteaseUnits = document.querySelector("#customProteaseUnits");
const customMedicationNote = document.querySelector("#customMedicationNote");
const formMessage = document.querySelector("#formMessage");
const saveBtn = document.querySelector("#saveBtn");
const pageQuery = new URLSearchParams(window.location.search);
const openedFromProfile = pageQuery.get("from") === "profile";

const core = window.PancreAICore;
const countryDatabase = window.PancreAICountryDatabase;
const medicationRegionService = window.PancreAIMedicationRegionService;
const treatmentService = window.PancreAITreatmentService;
const i18n = window.PancreAII18n;

const INITIAL_MEDICATION_COUNT = 2;
const MEDICATION_EXPAND_SIZE = 6;

const COUNTRY_NAMES = {
  en: {
    AU: "Australia", BD: "Bangladesh", BR: "Brazil", CA: "Canada", CN: "China", CZ: "Czechia", DK: "Denmark", EU: "Europe", FI: "Finland", FR: "France", DE: "Germany", GR: "Greece", IN: "India", IL: "Israel", IT: "Italy", JP: "Japan", NL: "Netherlands", NO: "Norway", OTHER: "Other", PL: "Poland", RO: "Romania", RU: "Russia", SA: "Saudi Arabia", KR: "South Korea", ES: "Spain", SE: "Sweden", TR: "Turkey", UA: "Ukraine", GB: "United Kingdom", US: "United States"
  },
  es: {
    DE: "Alemania", SA: "Arabia Saudita", AU: "Australia", BD: "Bangladesh", BR: "Brasil", CA: "Canadá", CN: "China", KR: "Corea del Sur", CZ: "Chequia", DK: "Dinamarca", ES: "España", US: "Estados Unidos", EU: "Europa", FI: "Finlandia", FR: "Francia", GR: "Grecia", IN: "India", IL: "Israel", IT: "Italia", JP: "Japón", NO: "Noruega", OTHER: "Otro", NL: "Países Bajos", PL: "Polonia", GB: "Reino Unido", RO: "Rumanía", RU: "Rusia", SE: "Suecia", TR: "Turquía", UA: "Ucrania"
  },
  fr: {
    DE: "Allemagne", SA: "Arabie saoudite", AU: "Australie", BD: "Bangladesh", BR: "Brésil", CA: "Canada", CN: "Chine", KR: "Corée du Sud", DK: "Danemark", ES: "Espagne", US: "États-Unis", EU: "Europe", FI: "Finlande", FR: "France", GR: "Grèce", IN: "Inde", IL: "Israël", IT: "Italie", JP: "Japon", NO: "Norvège", OTHER: "Autre", NL: "Pays-Bas", PL: "Pologne", RO: "Roumanie", GB: "Royaume-Uni", RU: "Russie", SE: "Suède", CZ: "Tchéquie", TR: "Turquie", UA: "Ukraine"
  },
  de: {
    OTHER: "Andere", AU: "Australien", BR: "Brasilien", CN: "China", DK: "Dänemark", DE: "Deutschland", EU: "Europa", FI: "Finnland", FR: "Frankreich", GR: "Griechenland", IN: "Indien", IL: "Israel", IT: "Italien", JP: "Japan", CA: "Kanada", NL: "Niederlande", NO: "Norwegen", PL: "Polen", RO: "Rumänien", RU: "Russland", SA: "Saudi-Arabien", SE: "Schweden", ES: "Spanien", KR: "Südkorea", CZ: "Tschechien", TR: "Türkei", UA: "Ukraine", GB: "Vereinigtes Königreich", US: "Vereinigte Staaten", BD: "Bangladesh"
  },
  it: {
    SA: "Arabia Saudita", AU: "Australia", BD: "Bangladesh", BR: "Brasile", CA: "Canada", CN: "Cina", KR: "Corea del Sud", DK: "Danimarca", EU: "Europa", FR: "Francia", DE: "Germania", JP: "Giappone", GR: "Grecia", IN: "India", IL: "Israele", IT: "Italia", NO: "Norvegia", OTHER: "Altro", NL: "Paesi Bassi", PL: "Polonia", GB: "Regno Unito", CZ: "Cechia", RO: "Romania", RU: "Russia", ES: "Spagna", US: "Stati Uniti", SE: "Svezia", TR: "Turchia", UA: "Ucraina", FI: "Finlandia"
  }
};

const LANGUAGE_LOCALES = {
  "pt-BR": "pt-BR",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT"
};

const LOCAL_TRANSLATION_FALLBACKS = {
  "treatment.countryNone": "Nenhum",
  "treatment.selectCountry": "Selecione um país ou região para ver as opções de medicamento."
};

let selectedCountry = "";
let selectedMedicationId = null;
let visibleMedicationCount = INITIAL_MEDICATION_COUNT;
let currentOptions = [];

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function translate(key, params) {
  const translated = i18n?.t?.(key, params);
  return translated && translated !== key ? translated : LOCAL_TRANSLATION_FALLBACKS[key] || key;
}

function getStoredTreatmentForForm() {
  const payload = readJson("pancreai_treatment_settings", null);
  const treatment = payload?.treatment && typeof payload.treatment === "object" ? payload.treatment : payload;
  if (!treatment || typeof treatment !== "object") return null;

  const hasMeaningfulTreatment = Boolean(treatment.countryCode || treatment.medicationDisplayName || treatment.medicationId);
  if (!hasMeaningfulTreatment) return null;

  const setupComplete = localStorage.getItem("pancreaiSetupComplete") === "true";
  const migratedFallback = Boolean(treatment.migratedFromLegacy);
  if (!openedFromProfile && !setupComplete && migratedFallback) return null;

  return treatment;
}

function getStoredPatientForForm() {
  const storedPatient = readJson("pancreaiPatient", null);
  const legacyWeight = Number(localStorage.getItem("pancreaiWeight") || 0);
  const legacyLipaseDose = Number(localStorage.getItem("pancreaiLipaseDose") || 0);

  return {
    weight: Number(storedPatient?.weight || legacyWeight || 0),
    lipaseDose: Number(storedPatient?.lipaseDose || legacyLipaseDose || 0)
  };
}

function applyTreatmentCopy() {
  const copies = [
    ["#configTitle", "treatment.title"],
    ["#introCopy", "treatment.intro"],
    ["#weightLabel", "treatment.weight"],
    ["#lipaseLabel", "treatment.prescribedDose"],
    ["#countryLabel", "treatment.country"],
    ["#countryHelp", "treatment.countryHelp"],
    ["#medicationLabel", "treatment.medication"],
    ["#medicationHelp", "treatment.medicationHelp"],
    ["#customIntro", "treatment.customHelp"],
    ["#customFormLabel", "treatment.form"],
    ["#customUnitLabelText", "treatment.unitName"],
    ["#customLipaseLabel", "treatment.lipasePerUnit"],
    ["#customNoteLabel", "treatment.prescriptionNote"],
    ["#safetyCopy", "treatment.noSubstitution"]
  ];

  document.title = `PancreAI - ${translate("treatment.title")}`;
  copies.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = translate(key);
  });
  const lipaseHelp = document.querySelector("#lipaseHelp");
  if (lipaseHelp) lipaseHelp.textContent = `${translate("treatment.prescribedDoseHelp")} Informe exatamente a dose prescrita pelo seu médico ou nutricionista.`;
  if (saveBtn) saveBtn.textContent = translate("treatment.save");
}

function formatUnits(value) {
  const numeric = Number(value || 0);
  if (!numeric) return "Potência não cadastrada";
  return `${numeric.toLocaleString("pt-BR")} U de lipase`;
}

function formLabel(value) {
  const labels = {
    capsule: "cápsula",
    tablet: "comprimido",
    sachet: "sachê",
    granules: "grânulos",
    powder: "pó",
    scoop: "scoop",
    unit: "unidade",
    custom: "unidade"
  };
  return labels[value] || "unidade";
}

function isInitialSetupRequired() {
  return !core.isSetupComplete();
}

function getSafeRedirect() {
  const requestedRedirect = localStorage.getItem("pancreaiReturnTo");

  if (isInitialSetupRequired()) {
    return "configuracao.html";
  }

  if (requestedRedirect && requestedRedirect !== "configuracao.html") {
    return requestedRedirect;
  }

  return "home.html";
}

function syncMandatorySetupState() {
  const mandatorySetup = isInitialSetupRequired();
  const showBackButton = openedFromProfile && !mandatorySetup;

  backBtn.classList.toggle("is-initial-hidden", !showBackButton);
  backBtn.classList.toggle("is-locked", mandatorySetup);
  backBtn.disabled = !showBackButton;
  backBtn.tabIndex = showBackButton ? 0 : -1;
  backBtn.setAttribute("aria-hidden", showBackButton ? "false" : "true");
  backBtn.setAttribute("aria-disabled", showBackButton ? "false" : "true");
  backBtn.title = showBackButton ? translate("common.back") : "";
}

function setMessage(text, type = "warning") {
  formMessage.textContent = text;
  formMessage.style.color = type === "success" ? "#2d8a52" : "#c4702a";
}

function getPrimaryOptions() {
  return currentOptions.filter((item) => !item.isCustomOption);
}

function getCustomOption() {
  return currentOptions.find((item) => item.isCustomOption) || null;
}

function getSelectedMedication() {
  return currentOptions.find((item) => item.id === selectedMedicationId) || currentOptions[0] || getCustomOption() || null;
}

function needsManualFields(medication) {
  return Boolean(medication?.isCustomOption);
}

function clearCustomPrefill() {
  customMedicationName.dataset.prefilled = "false";
}

function clearCustomFields() {
  customMedicationName.value = "";
  customMedicationName.dataset.prefilled = "false";
  customLipaseUnits.value = "";
  customAmylaseUnits.value = "";
  customProteaseUnits.value = "";
  customMedicationNote.value = "";
}

function prefillCustomFromMedication(medication) {
  if (!medication) return;
  selectedMedicationId = "custom";
  customMedicationName.value = medication.displayName || "";
  customMedicationName.dataset.prefilled = "true";
  customMedicationForm.value = medication.form || "capsule";
  customUnitLabel.value = medication.unitLabel && medication.unitLabel !== "unidade"
    ? medication.unitLabel
    : formLabel(customMedicationForm.value);
  customLipaseUnits.value = "";
  customAmylaseUnits.value = "";
  customProteaseUnits.value = "";
  customMedicationNote.value = medication.displayName
    ? `Potência manual para ${medication.displayName}.`
    : "";
}

function syncCustomFields() {
  const medication = getSelectedMedication();
  const visible = needsManualFields(medication);
  customMedicationFields.hidden = !visible;

  if (!visible) {
    return;
  }

  if (!customUnitLabel.value) {
    customUnitLabel.value = formLabel(customMedicationForm.value);
  }
}

function getCurrentLanguage() {
  return i18n?.normalizeLanguageCode?.(i18n?.getCurrentLanguage?.()) || "pt-BR";
}

function getCountryDisplayName(country) {
  const language = getCurrentLanguage();
  if (language === "pt-BR") return country.namePt;
  return COUNTRY_NAMES[language]?.[country.code] || country.englishName || country.localName || country.namePt;
}

function getSortedTreatmentCountries() {
  const language = getCurrentLanguage();
  const locale = LANGUAGE_LOCALES[language] || "pt-BR";
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  return countryDatabase.getTreatmentCountries().slice().sort((a, b) => {
    return collator.compare(getCountryDisplayName(a), getCountryDisplayName(b));
  });
}

function renderCountries() {
  const countries = getSortedTreatmentCountries();

  countrySelect.innerHTML = `
    <option value="">${translate("treatment.countryNone")}</option>
    ${countries.map((country) => `
      <option value="${country.code}">
        ${getCountryDisplayName(country)}
      </option>
    `).join("")}
  `;
  countrySelect.value = selectedCountry || "";
}

function ensureVisibleSelectedOption() {
  const primaryOptions = getPrimaryOptions();
  const selectedIndex = primaryOptions.findIndex((item) => item.id === selectedMedicationId);
  if (selectedIndex >= visibleMedicationCount) {
    visibleMedicationCount = Math.min(
      primaryOptions.length,
      Math.max(INITIAL_MEDICATION_COUNT, Math.ceil((selectedIndex + 1) / MEDICATION_EXPAND_SIZE) * MEDICATION_EXPAND_SIZE)
    );
  }
}

function medicationCardTemplate(medication) {
  const selected = medication.id === selectedMedicationId;
  const country = countryDatabase.getCountryByCode(selectedCountry);
  const power = medication.allowInCalculator
    ? `${formatUnits(medication.lipaseUnits)} por ${medication.unitLabel}`
    : "Informe a lipase manualmente";
  const caution = medication.isCustomOption
    ? translate("treatment.customHelp")
    : medication.cautionMessage || "Confirme na prescrição ou embalagem.";

  return `
    <button class="medication-card${selected ? " is-selected" : ""}" type="button" data-medication-id="${medication.id}">
      <span class="medication-card__flag" data-flag-code="${country?.flagCode || selectedCountry}" data-flag-size="28"></span>
      <span class="medication-card__text">
        <strong>${medication.displayName}</strong>
        <small>${power}</small>
        <em>${country ? getCountryDisplayName(country) : selectedCountry} · ${caution}</em>
      </span>
      <span class="medication-card__badge">${medication.verificationLabel}</span>
    </button>
  `;
}

function renderMedicationOptions() {
  if (!selectedCountry) {
    currentOptions = [];
    selectedMedicationId = null;
    visibleMedicationCount = INITIAL_MEDICATION_COUNT;
    medicationOptions.innerHTML = `<p class="helper-text medication-empty">${translate("treatment.selectCountry")}</p>`;
    customMedicationFields.hidden = true;
    return;
  }

  const savedTreatment = getStoredTreatmentForForm();
  currentOptions = medicationRegionService.getMedicationOptionsForCountry(selectedCountry);
  const primaryOptions = getPrimaryOptions();
  const customOption = getCustomOption();

  if (!selectedMedicationId) {
    if (savedTreatment?.countryCode === selectedCountry) {
      selectedMedicationId = savedTreatment.isCustom ? "custom" : savedTreatment.medicationId;
    } else {
      selectedMedicationId = primaryOptions.find((item) => item.allowInCalculator)?.id || customOption?.id || primaryOptions[0]?.id || null;
    }
  }

  if (!currentOptions.some((item) => item.id === selectedMedicationId)) {
    selectedMedicationId = customOption?.id || primaryOptions.find((item) => item.allowInCalculator)?.id || primaryOptions[0]?.id || null;
  }

  ensureVisibleSelectedOption();

  const visiblePrimaryOptions = primaryOptions.slice(0, visibleMedicationCount);
  const hiddenCount = Math.max(primaryOptions.length - visiblePrimaryOptions.length, 0);
  const nextCount = Math.min(MEDICATION_EXPAND_SIZE, hiddenCount);

  const cards = visiblePrimaryOptions.map(medicationCardTemplate);

  if (hiddenCount > 0) {
    cards.push(`
      <button class="medication-more-btn" type="button" data-action="show-more-medications">
        <span>Ver mais opções</span>
        <small>Mostrar mais ${nextCount} de ${hiddenCount}</small>
      </button>
    `);
  }

  if (customOption) {
    cards.push(medicationCardTemplate(customOption));
  }

  medicationOptions.innerHTML = cards.join("");
  window.PancreAIFlags?.mount(medicationOptions);
  syncCustomFields();
}

function loadSavedData() {
  const patient = getStoredPatientForForm();
  const treatment = getStoredTreatmentForForm();

  if (patient.weight) weightInput.value = String(patient.weight).replace(".", ",");
  if (patient.lipaseDose) lipaseInput.value = String(patient.lipaseDose);

  if (treatment?.countryCode) selectedCountry = treatment.countryCode;
  if (treatment?.medicationId) selectedMedicationId = treatment.isCustom ? "custom" : treatment.medicationId;

  if (treatment?.isCustom || treatment?.verificationLevel === "custom") {
    customMedicationName.value = treatment.medicationDisplayName || "";
    customMedicationForm.value = treatment.medicationForm || "capsule";
    customUnitLabel.value = treatment.unitLabel || "cápsula";
    customLipaseUnits.value = treatment.lipaseUnitsPerUnit || "";
    customAmylaseUnits.value = treatment.amylaseUnitsPerUnit || "";
    customProteaseUnits.value = treatment.proteaseUnitsPerUnit || "";
    customMedicationNote.value = treatment.note || "";
  }
}

function buildTreatment() {
  if (!selectedCountry) {
    return { error: translate("treatment.selectCountry") };
  }

  const medication = getSelectedMedication();
  if (!medication) return null;

  if (!medication.isCustomOption) {
    if (medication.needsManualPower || !medication.allowInCalculator) {
      return null;
    }
    return treatmentService.medicationToTreatment(medication, selectedCountry);
  }

  const name = customMedicationName.value.trim();
  if (!name) {
    return { error: translate("treatment.manualNameRequired") };
  }

  const lipaseUnits = Number(customLipaseUnits.value.trim());
  return treatmentService.createCustomTreatment({
    countryCode: selectedCountry,
    name,
    form: customMedicationForm.value,
    unitLabel: customUnitLabel.value.trim() || formLabel(customMedicationForm.value),
    lipaseUnits,
    amylaseUnits: customAmylaseUnits.value.trim(),
    proteaseUnits: customProteaseUnits.value.trim(),
    note: customMedicationNote.value.trim()
  });
}

function savePatientData() {
  const weight = Number(weightInput.value.trim().replace(",", "."));
  const lipase = Number(lipaseInput.value.trim());

  if (!weight || weight <= 0 || !lipase || lipase <= 0) {
    setMessage(translate("treatment.completeRequired"));
    return;
  }

  const treatment = buildTreatment();
  if (treatment?.error) {
    setMessage(treatment.error);
    return;
  }

  if (!treatment) {
    setMessage(translate("treatment.selectMedication"));
    return;
  }

  const validation = treatmentService.validateTreatmentSettings(treatment);
  if (!validation.valid) {
    setMessage(validation.errors[0] || "Revise os dados do medicamento.");
    return;
  }

  if (validation.treatment.lipaseUnitsPerUnit > 100000 || validation.treatment.lipaseUnitsPerUnit < 100) {
    const confirmed = window.confirm(translate("treatment.confirmPower"));
    if (!confirmed) {
      setMessage(translate("treatment.confirmPower"));
      return;
    }
  }

  core.savePatient({
    weight,
    lipaseDose: lipase,
    capsuleStrength: validation.treatment.lipaseUnitsPerUnit,
    treatment: validation.treatment
  });

  setMessage(translate("treatment.savedSuccess"), "success");

  window.setTimeout(() => {
    const redirect = getSafeRedirect();
    localStorage.removeItem("pancreaiReturnTo");
    window.location.href = redirect;
  }, 450);
}

backBtn.addEventListener("click", () => {
  if (isInitialSetupRequired()) {
    setMessage("Conclua o Meu Tratamento para liberar a home.");
    return;
  }

  const redirect = getSafeRedirect();
  window.location.href = redirect;
});

countrySelect.addEventListener("change", () => {
  selectedCountry = countrySelect.value;
  selectedMedicationId = null;
  visibleMedicationCount = INITIAL_MEDICATION_COUNT;
  clearCustomFields();
  renderMedicationOptions();
});

medicationOptions.addEventListener("click", (event) => {
  const showMoreButton = event.target.closest('[data-action="show-more-medications"]');
  if (showMoreButton) {
    visibleMedicationCount += MEDICATION_EXPAND_SIZE;
    renderMedicationOptions();
    return;
  }

  const card = event.target.closest(".medication-card");
  if (!card) return;

  const medication = currentOptions.find((item) => item.id === card.dataset.medicationId);
  if (!medication) return;

  if (!medication.isCustomOption && medication.needsManualPower) {
    prefillCustomFromMedication(medication);
    setMessage(translate("treatment.manualPower"));
  } else {
    selectedMedicationId = medication.id;
    if (!medication.isCustomOption) {
      clearCustomPrefill();
      setMessage("");
    } else if (!customUnitLabel.value) {
      customUnitLabel.value = formLabel(customMedicationForm.value);
    }
  }

  renderMedicationOptions();
});

customMedicationName.addEventListener("input", () => {
  customMedicationName.dataset.prefilled = "false";
});

customMedicationForm.addEventListener("change", () => {
  customUnitLabel.value = formLabel(customMedicationForm.value);
});

saveBtn.addEventListener("click", savePatientData);

applyTreatmentCopy();
loadSavedData();
renderCountries();
renderMedicationOptions();
syncMandatorySetupState();
core.applyGlobalPreferences();

window.addEventListener("pancreai:languagechange", () => {
  applyTreatmentCopy();
  renderCountries();
  renderMedicationOptions();
});