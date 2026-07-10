(function () {
  const STORAGE_KEYS = {
    patient: "pancreaiPatient",
    setupComplete: "pancreaiSetupComplete",
    unit: "pancreaiUnidade",
    childMode: "pancreaiChildMode",
    childModeEnabled: "pancreai_child_mode_enabled",
    childModeSettings: "pancreai_child_mode_settings",
    medicalAlerts: "pancreai_medical_warnings_enabled",
    legacyMedicalAlerts: "pancreaiMedicalAlerts",
    medicalAlertsDefaultApplied: "pancreaiMedicalWarningsDefaultOff20260709",
    history: "pancreaiHistory",
    favorites: "pancreaiFavorites",
    draftMeal: "pancreaiDraftMeal",
    lastMeal: "pancreaiLastMeal",
    learning: "pancreaiLearning",
    treatment: "pancreai_treatment_settings",
    languageSettings: "pancreai_language_settings"
  };

  const DEFAULT_PATIENT = {
    weight: 0,
    lipaseDose: 1800,
    capsuleStrength: 25000
  };

  const DEFAULT_CHILD_MODE_SETTINGS = {
    enabled: false,
    requireResponsibleReview: true,
    simplifyHome: true,
    simplifyNavigation: true,
    simplifyResult: true,
    hideAdvancedMetrics: true,
    protectTreatmentSettings: true,
    useLargeButtons: true,
    useVisualPortions: true
  };

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeTreatment(settings) {
    if (!settings) return null;
    const source = settings.treatment && typeof settings.treatment === "object" ? settings.treatment : settings;
    const lipaseUnitsPerUnit = Number(source.lipaseUnitsPerUnit || source.lipaseUnits || 0);
    return {
      schemaVersion: 2,
      countryCode: String(source.countryCode || "BR").toUpperCase(),
      medicationId: source.medicationId || null,
      medicationBrand: source.medicationBrand || source.brand || "",
      medicationDisplayName: source.medicationDisplayName || source.displayName || source.medicationBrand || "",
      medicationForm: source.medicationForm || source.form || "capsule",
      unitLabel: source.unitLabel || "cápsula",
      lipaseUnitsPerUnit: lipaseUnitsPerUnit > 0 ? lipaseUnitsPerUnit : null,
      amylaseUnitsPerUnit: Number(source.amylaseUnitsPerUnit || 0) || null,
      proteaseUnitsPerUnit: Number(source.proteaseUnitsPerUnit || 0) || null,
      verificationLevel: source.verificationLevel || "custom",
      sourceRefs: Array.isArray(source.sourceRefs) ? source.sourceRefs : [],
      isCustom: Boolean(source.isCustom),
      migratedFromLegacy: Boolean(source.migratedFromLegacy),
      cautionMessage: source.cautionMessage || "",
      note: source.note || "",
      updatedAt: source.updatedAt || new Date().toISOString()
    };
  }
  function legacyCapsuleStrength() {
    const stored = readJson(STORAGE_KEYS.patient, null);
    return Number(stored?.capsuleStrength || localStorage.getItem("pancreaiCapsuleStrength") || DEFAULT_PATIENT.capsuleStrength);
  }

  function createLegacyTreatment(capsuleStrength) {
    const knownCreon = capsuleStrength === 10000 || capsuleStrength === 25000;
    const legacyCaution = "Migrado da configuração anterior. Confirme país, medicamento e prescrição.";

    if (knownCreon) {
      return normalizeTreatment({
        countryCode: "BR",
        medicationId: `creon_${capsuleStrength}_br`,
        medicationBrand: "Creon",
        medicationDisplayName: `Creon ${Number(capsuleStrength).toLocaleString("pt-BR")}`,
        medicationForm: "capsule",
        unitLabel: "cápsula",
        lipaseUnitsPerUnit: capsuleStrength,
        verificationLevel: "verified",
        sourceRefs: ["abbott-br-creon"],
        isCustom: false,
        migratedFromLegacy: true,
        note: "Migrado da configuração antiga."
      });
    }

    if (capsuleStrength === 36000) {
      return normalizeTreatment({
        countryCode: "OTHER",
        medicationId: "custom_legacy_36000",
        medicationBrand: "Creon",
        medicationDisplayName: "Creon 36.000",
        medicationForm: "capsule",
        unitLabel: "cápsula",
        lipaseUnitsPerUnit: 36000,
        verificationLevel: "custom",
        sourceRefs: [],
        isCustom: true,
        migratedFromLegacy: true,
        cautionMessage: legacyCaution,
        note: legacyCaution
      });
    }

    return normalizeTreatment({
      countryCode: "OTHER",
      medicationId: `custom_legacy_${capsuleStrength}`,
      medicationBrand: "Medicamento cadastrado",
      medicationDisplayName: `Medicamento ${Number(capsuleStrength).toLocaleString("pt-BR")} U`,
      medicationForm: "capsule",
      unitLabel: "cápsula",
      lipaseUnitsPerUnit: capsuleStrength,
      verificationLevel: "custom",
      sourceRefs: [],
      isCustom: true,
      migratedFromLegacy: true,
      cautionMessage: legacyCaution,
      note: "Migrado da configuração antiga sem assumir marca ou país."
    });
  }
  function migrateLegacyTreatment() {
    const service = window.PancreAITreatmentService;
    if (service?.migrateLegacyTreatment) {
      return service.migrateLegacyTreatment();
    }

    const stored = normalizeTreatment(readJson(STORAGE_KEYS.treatment, null));
    if (stored?.lipaseUnitsPerUnit) {
      return stored;
    }

    const capsuleStrength = legacyCapsuleStrength();
    if (capsuleStrength > 0) {
      const migrated = createLegacyTreatment(capsuleStrength);
      writeJson(STORAGE_KEYS.treatment, { schemaVersion: 2, treatment: migrated, updatedAt: migrated.updatedAt });
      return migrated;
    }

    return null;
  }

  function getTreatment() {
    const service = window.PancreAITreatmentService;
    if (service?.getTreatmentSettings) {
      return service.getTreatmentSettings();
    }
    return migrateLegacyTreatment();
  }

  function saveTreatment(treatment) {
    const service = window.PancreAITreatmentService;
    const normalized = service?.saveTreatmentSettings
      ? service.saveTreatmentSettings(treatment)
      : normalizeTreatment(treatment);

    if (!service?.saveTreatmentSettings && normalized) {
      writeJson(STORAGE_KEYS.treatment, { schemaVersion: 2, treatment: normalized, updatedAt: normalized.updatedAt });
      localStorage.setItem("pancreaiCapsuleStrength", String(normalized.lipaseUnitsPerUnit || ""));
    }

    return normalized;
  }

  function getCurrentLipaseUnitsPerUnit() {
    return Number(getTreatment()?.lipaseUnitsPerUnit || legacyCapsuleStrength() || 0);
  }

  function getCurrentMedicationLabel() {
    return getTreatment()?.medicationDisplayName || "Medicamento não informado";
  }

  function getCurrentUnitLabel() {
    return getTreatment()?.unitLabel || "unidade";
  }

  function isTreatmentComplete() {
    const treatment = getTreatment();
    return Boolean(treatment?.medicationDisplayName && Number(treatment?.lipaseUnitsPerUnit) > 0);
  }
  function getPatient() {
    const stored = readJson(STORAGE_KEYS.patient, null);
    const treatment = getTreatment();
    const treatmentLipase = Number(treatment?.lipaseUnitsPerUnit || 0);
    if (stored) {
      return {
        weight: Number(stored.weight || 0),
        lipaseDose: Number(stored.lipaseDose || 1800),
        capsuleStrength: Number(treatmentLipase || stored.capsuleStrength || 25000),
        treatment
      };
    }

    return {
      weight: Number(localStorage.getItem("pancreaiWeight") || DEFAULT_PATIENT.weight),
      lipaseDose: Number(localStorage.getItem("pancreaiLipaseDose") || DEFAULT_PATIENT.lipaseDose),
      capsuleStrength: Number(treatmentLipase || localStorage.getItem("pancreaiCapsuleStrength") || DEFAULT_PATIENT.capsuleStrength),
      treatment
    };
  }
  function savePatient(patient) {
    const treatment = patient.treatment ? saveTreatment({ ...patient.treatment, weightKg: patient.weight, prescribedUnitsPerGramFat: patient.lipaseDose }) : getTreatment();
    const normalized = {
      weight: Number(patient.weight || 0),
      lipaseDose: Number(patient.lipaseDose || 1800),
      capsuleStrength: Number(treatment?.lipaseUnitsPerUnit || patient.capsuleStrength || 25000),
      treatment
    };
    writeJson(STORAGE_KEYS.patient, normalized);
    localStorage.setItem("pancreaiWeight", String(normalized.weight));
    localStorage.setItem("pancreaiLipaseDose", String(normalized.lipaseDose));
    localStorage.setItem("pancreaiCapsuleStrength", String(normalized.capsuleStrength));
    localStorage.setItem(STORAGE_KEYS.setupComplete, "true");
    return normalized;
  }
  function isSetupComplete() {
    const patient = getPatient();
    return localStorage.getItem(STORAGE_KEYS.setupComplete) === "true"
      && patient.weight > 0
      && patient.lipaseDose > 0
      && (patient.capsuleStrength > 0 || isTreatmentComplete());
  }

  function getUnit() {
    return localStorage.getItem(STORAGE_KEYS.unit) || "gramas";
  }

  function setUnit(unit) {
    localStorage.setItem(STORAGE_KEYS.unit, unit);
  }

  function getChildModeSettings() {
    const stored = readJson(STORAGE_KEYS.childModeSettings, {}) || {};
    const storedEnabled = localStorage.getItem(STORAGE_KEYS.childModeEnabled);
    const legacyEnabled = localStorage.getItem(STORAGE_KEYS.childMode) === "true";
    const enabled = storedEnabled !== null ? storedEnabled === "true" : Boolean(stored.enabled ?? legacyEnabled);
    return {
      ...DEFAULT_CHILD_MODE_SETTINGS,
      ...stored,
      enabled
    };
  }

  function isChildMode() {
    return getChildModeSettings().enabled === true;
  }

  function isChildModeEnabled() {
    return isChildMode();
  }

  function applyChildModeState() {
    const enabled = isChildMode();
    document.documentElement.dataset.childMode = enabled ? "true" : "false";
    if (document.body) {
      document.body.classList.toggle("child-mode", enabled);
    }
    return enabled;
  }

  function setChildMode(value) {
    const settings = {
      ...getChildModeSettings(),
      enabled: Boolean(value)
    };
    writeJson(STORAGE_KEYS.childModeSettings, settings);
    localStorage.setItem(STORAGE_KEYS.childModeEnabled, String(settings.enabled));
    localStorage.setItem(STORAGE_KEYS.childMode, String(settings.enabled));
    applyChildModeState();
    window.dispatchEvent(new CustomEvent("pancreai:childmodechange", { detail: settings }));
    return settings;
  }

  function setChildModeEnabled(value) {
    return setChildMode(value);
  }

  function toggleChildMode(value) {
    return setChildMode(typeof value === "boolean" ? value : !isChildMode());
  }

  function shouldShowAdvancedContent() {
    return !isChildMode();
  }

  function shouldRequireResponsibleReview() {
    return isChildMode() && getChildModeSettings().requireResponsibleReview;
  }

  function getChildModeText(key) {
    const copy = {
      responsibleReview: "Um responsável deve conferir este resultado.",
      protectedInfo: "Essa informação precisa ser revisada por um responsável.",
      goResponsible: "Ir para Área do Responsável"
    };
    return copy[key] || key;
  }
function isMedicalWarningsEnabled() {
    if (localStorage.getItem(STORAGE_KEYS.medicalAlertsDefaultApplied) !== "true") {
      localStorage.setItem(STORAGE_KEYS.medicalAlertsDefaultApplied, "true");
      setMedicalWarningsEnabled(false);
      return false;
    }

    const stored = localStorage.getItem(STORAGE_KEYS.medicalAlerts);
    if (stored !== null) {
      return stored === "true";
    }

    setMedicalWarningsEnabled(false);
    return false;
  }

  function setMedicalWarningsEnabled(value) {
    const enabled = Boolean(value);
    localStorage.setItem(STORAGE_KEYS.medicalAlerts, String(enabled));
    localStorage.setItem(STORAGE_KEYS.legacyMedicalAlerts, String(enabled));
    localStorage.setItem(STORAGE_KEYS.medicalAlertsDefaultApplied, "true");
    document.documentElement.dataset.medicalWarnings = enabled ? "true" : "false";
  }

  function applyGlobalPreferences() {
    document.documentElement.dataset.unit = getUnit();
    applyChildModeState();
    document.documentElement.dataset.medicalWarnings = isMedicalWarningsEnabled() ? "true" : "false";
  }

  function formatDecimal(value, decimals) {
    return Number(value || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatQuantity(grams) {
    const unit = getUnit();
    const safeGrams = Number(grams || 0);

    if (unit === "colheres") {
      const tablespoons = Math.max(0.5, Math.round((safeGrams / 12) * 2) / 2);
      const label = tablespoons === 1 ? "colher" : "colheres";
      return `${formatDecimal(tablespoons, tablespoons % 1 === 0 ? 0 : 1)} ${label}`;
    }

    if (unit === "porcoes") {
      const portions = Math.max(0.5, Math.round((safeGrams / 100) * 2) / 2);
      const label = portions === 1 ? "porção" : "porções";
      return `${formatDecimal(portions, portions % 1 === 0 ? 0 : 1)} ${label}`;
    }

    return `${Math.round(safeGrams)} g`;
  }

  function buildFoodLabel(food) {
    return `${food.name} • ${formatQuantity(food.grams)}`;
  }

  function normalizeHistoryRecord(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    const confirmedAt = record.confirmedAt || (record.confirmed === true ? record.createdAt || new Date().toISOString() : null);
    if (!confirmedAt) {
      return null;
    }

    return {
      ...record,
      confirmed: true,
      confirmedAt
    };
  }

  function getHistory() {
    const storedHistory = readJson(STORAGE_KEYS.history, []);
    const normalizedHistory = storedHistory
      .map((item) => normalizeHistoryRecord(item))
      .filter(Boolean);

    if (normalizedHistory.length !== storedHistory.length) {
      writeJson(STORAGE_KEYS.history, normalizedHistory);
    }

    return normalizedHistory;
  }

  function saveHistory(items) {
    const normalizedHistory = items
      .map((item) => normalizeHistoryRecord(item))
      .filter(Boolean);
    writeJson(STORAGE_KEYS.history, normalizedHistory);
  }

  function getFavorites() {
    return readJson(STORAGE_KEYS.favorites, []);
  }

  function saveFavorites(items) {
    writeJson(STORAGE_KEYS.favorites, items);
  }

  function getDraftMeal() {
    return readJson(STORAGE_KEYS.draftMeal, null);
  }

  function saveDraftMeal(meal) {
    writeJson(STORAGE_KEYS.draftMeal, meal);
  }

  function clearDraftMeal() {
    localStorage.removeItem(STORAGE_KEYS.draftMeal);
  }

  function saveMealRecord(record) {
    const normalizedRecord = {
      ...record,
      confirmed: true,
      confirmedAt: record.confirmedAt || new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.lastMeal, JSON.stringify(normalizedRecord));
    const history = getHistory();
    history.unshift(normalizedRecord);
    saveHistory(history.slice(0, 100));
  }

  function saveFavorite(record) {
    const favorites = getFavorites();
    favorites.unshift({
      id: `fav-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: record.name,
      image: record.image,
      foods: record.foods,
      totalFat: record.totalFat,
      capsules: record.capsules,
      capsuleStrength: record.capsuleStrength
    });
    saveFavorites(favorites.slice(0, 50));
  }

  function getLearning() {
    return readJson(STORAGE_KEYS.learning, {});
  }

  function saveLearning(data) {
    writeJson(STORAGE_KEYS.learning, data);
  }

  function registerFoodAdjustment(foodName, previousGrams, nextGrams) {
    if (!foodName || nextGrams <= previousGrams) {
      return;
    }
    const learning = getLearning();
    const key = foodName.toLowerCase();
    const current = learning[key] || { increases: 0, suggested: false, lastDelta: 0 };
    current.increases += 1;
    current.lastDelta = nextGrams - previousGrams;
    learning[key] = current;
    saveLearning(learning);
  }

  function getLearningSuggestion(foodName) {
    if (!foodName) return null;
    const learning = getLearning();
    const item = learning[foodName.toLowerCase()];
    if (!item || item.increases < 3) {
      return null;
    }
    return {
      foodName,
      delta: item.lastDelta || 20,
      message: `Você costuma aumentar ${foodName}. Deseja aplicar um ajuste sugerido de +${Math.round(item.lastDelta || 20)} g?`
    };
  }

  function markLearningSuggestionShown(foodName) {
    const learning = getLearning();
    const key = foodName.toLowerCase();
    if (learning[key]) {
      learning[key].suggested = true;
      saveLearning(learning);
    }
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
  }

  function buildPrintableHtml(title, content) {
    return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${title}</title><style>body{font-family:Inter,Arial,sans-serif;padding:32px;color:#243b2b}h1,h2{margin:0 0 12px}section{margin:0 0 24px;padding:16px;border:1px solid #dfe8e1;border-radius:16px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #e8efea;text-align:left}small{color:#6e8875}</style></head><body>${content}</body></html>`;
  }

  window.PancreAICore = {
    STORAGE_KEYS,
    getPatient,
    savePatient,
    isSetupComplete,
    getUnit,
    setUnit,
    getChildModeSettings,
    isChildMode,
    isChildModeEnabled,
    setChildMode,
    setChildModeEnabled,
    toggleChildMode,
    applyChildModeState,
    shouldShowAdvancedContent,
    shouldRequireResponsibleReview,
    getChildModeText,
    isMedicalWarningsEnabled,
    setMedicalWarningsEnabled,
    applyGlobalPreferences,
    formatQuantity,
    buildFoodLabel,
    getHistory,
    saveHistory,
    getFavorites,
    saveFavorites,
    saveMealRecord,
    saveFavorite,
    getDraftMeal,
    saveDraftMeal,
    clearDraftMeal,
    registerFoodAdjustment,
    getLearningSuggestion,
    markLearningSuggestionShown,
    getTreatment,
    saveTreatment,
    migrateLegacyTreatment,
    getCurrentLipaseUnitsPerUnit,
    getCurrentMedicationLabel,
    getCurrentUnitLabel,
    isTreatmentComplete,
    formatDateTime,
    buildPrintableHtml,
    formatDecimal
  };

  applyGlobalPreferences();
})();
