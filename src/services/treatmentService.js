(function () {
  const TREATMENT_STORAGE_KEY = "pancreai_treatment_settings";
  const LANGUAGE_STORAGE_KEY = "pancreai_language_settings";
  const LEGACY_PATIENT_KEY = "pancreaiPatient";
  const LEGACY_CAUTION = "Migrado da configuração anterior. Confirme país, medicamento e prescrição.";

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

  function getLanguageCountry() {
    const settings = readJson(LANGUAGE_STORAGE_KEY, null);
    return settings?.countryCode || "BR";
  }

  function unwrapTreatmentSettings(settings) {
    if (!settings) return null;
    return settings.treatment && typeof settings.treatment === "object" ? settings.treatment : settings;
  }

  function medicationToTreatment(medication, countryCode) {
    if (!medication) return null;
    return normalizeTreatmentSettings({
      countryCode,
      medicationId: medication.id,
      medicationBrand: medication.brand,
      medicationDisplayName: medication.displayName,
      medicationForm: medication.form,
      unitLabel: medication.unitLabel,
      lipaseUnitsPerUnit: medication.lipaseUnits,
      amylaseUnitsPerUnit: medication.amylaseUnits,
      proteaseUnitsPerUnit: medication.proteaseUnits,
      verificationLevel: medication.verificationLevel,
      sourceRefs: medication.sourceRefs,
      isCustom: false,
      note: medication.cautionMessage || ""
    });
  }

  function normalizeTreatmentSettings(settings) {
    const normalized = unwrapTreatmentSettings(settings) || {};
    const lipase = Number(normalized.lipaseUnitsPerUnit || normalized.lipaseUnits || 0);
    return {
      schemaVersion: 2,
      countryCode: String(normalized.countryCode || getLanguageCountry() || "BR").toUpperCase(),
      medicationId: normalized.medicationId || null,
      medicationBrand: normalized.medicationBrand || normalized.brand || "",
      medicationDisplayName: normalized.medicationDisplayName || normalized.displayName || normalized.medicationBrand || "",
      medicationForm: normalized.medicationForm || normalized.form || "capsule",
      unitLabel: normalized.unitLabel || "cápsula",
      lipaseUnitsPerUnit: lipase > 0 ? lipase : null,
      amylaseUnitsPerUnit: Number(normalized.amylaseUnitsPerUnit || 0) || null,
      proteaseUnitsPerUnit: Number(normalized.proteaseUnitsPerUnit || 0) || null,
      verificationLevel: normalized.verificationLevel || "custom",
      sourceRefs: Array.isArray(normalized.sourceRefs) ? normalized.sourceRefs : [],
      isCustom: Boolean(normalized.isCustom),
      migratedFromLegacy: Boolean(normalized.migratedFromLegacy),
      cautionMessage: normalized.cautionMessage || "",
      note: normalized.note || "",
      updatedAt: normalized.updatedAt || new Date().toISOString()
    };
  }

  function createCustomTreatment(input) {
    return normalizeTreatmentSettings({
      countryCode: input.countryCode,
      medicationId: input.medicationId || `custom_${Date.now()}`,
      medicationBrand: input.name,
      medicationDisplayName: input.name,
      medicationForm: input.form,
      unitLabel: input.unitLabel,
      lipaseUnitsPerUnit: Number(input.lipaseUnits),
      amylaseUnitsPerUnit: input.amylaseUnits ? Number(input.amylaseUnits) : null,
      proteaseUnitsPerUnit: input.proteaseUnits ? Number(input.proteaseUnits) : null,
      verificationLevel: "custom",
      sourceRefs: [],
      isCustom: true,
      migratedFromLegacy: Boolean(input.migratedFromLegacy),
      cautionMessage: input.cautionMessage || "",
      note: input.note || "Cadastro manual informado pelo usuário."
    });
  }

  function validateTreatmentSettings(settings) {
    const treatment = normalizeTreatmentSettings(settings);
    const errors = [];
    if (!treatment.countryCode) errors.push("País ou região não informado.");
    if (!treatment.medicationDisplayName) errors.push("Medicamento não informado.");
    if (!treatment.medicationForm) errors.push("Forma do medicamento não informada.");
    if (!treatment.unitLabel) errors.push("Unidade do medicamento não informada.");
    if (!Number(treatment.lipaseUnitsPerUnit) || treatment.lipaseUnitsPerUnit <= 0) {
      errors.push("Informe as unidades de lipase por unidade.");
    }
    return { valid: errors.length === 0, errors, treatment };
  }

  function saveTreatmentSettings(settings) {
    const existing = readJson(TREATMENT_STORAGE_KEY, null) || {};
    const treatment = normalizeTreatmentSettings({
      ...settings,
      updatedAt: new Date().toISOString()
    });
    const payload = {
      schemaVersion: 2,
      weightKg: Number(settings?.weightKg || existing.weightKg || 0) || null,
      prescribedUnitsPerGramFat: Number(settings?.prescribedUnitsPerGramFat || existing.prescribedUnitsPerGramFat || 0) || null,
      treatment,
      updatedAt: treatment.updatedAt
    };
    writeJson(TREATMENT_STORAGE_KEY, payload);
    localStorage.setItem("pancreaiCapsuleStrength", String(treatment.lipaseUnitsPerUnit || ""));
    return treatment;
  }

  function legacyCapsuleStrength() {
    const patient = readJson(LEGACY_PATIENT_KEY, null);
    return Number(patient?.capsuleStrength || localStorage.getItem("pancreaiCapsuleStrength") || 0);
  }

  function legacyTreatmentForCapsuleStrength(capsuleStrength) {
    if (capsuleStrength === 10000 || capsuleStrength === 25000) {
      const id = capsuleStrength === 10000 ? "creon_10000_br" : "creon_25000_br";
      const medication = window.PancreAIMedicationRegionService?.getMedicationById(id);
      return medicationToTreatment(medication, "BR") || normalizeTreatmentSettings({
        countryCode: "BR",
        medicationId: id,
        medicationBrand: "Creon",
        medicationDisplayName: `Creon ${capsuleStrength.toLocaleString("pt-BR")}`,
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
      return createCustomTreatment({
        countryCode: "OTHER",
        medicationId: "custom_legacy_36000",
        name: "Creon 36.000",
        form: "capsule",
        unitLabel: "cápsula",
        lipaseUnits: 36000,
        migratedFromLegacy: true,
        cautionMessage: LEGACY_CAUTION,
        note: LEGACY_CAUTION
      });
    }

    return createCustomTreatment({
      countryCode: "OTHER",
      medicationId: `custom_legacy_${capsuleStrength}`,
      name: `Medicamento ${capsuleStrength.toLocaleString("pt-BR")} U`,
      form: "capsule",
      unitLabel: "cápsula",
      lipaseUnits: capsuleStrength,
      migratedFromLegacy: true,
      cautionMessage: LEGACY_CAUTION,
      note: "Migrado da configuração antiga sem assumir marca ou país."
    });
  }

  function migrateLegacyTreatment() {
    const existing = readJson(TREATMENT_STORAGE_KEY, null);
    const existingTreatment = normalizeTreatmentSettings(existing);
    if (existingTreatment?.lipaseUnitsPerUnit) {
      return existingTreatment;
    }

    const capsuleStrength = legacyCapsuleStrength();
    if (capsuleStrength > 0) {
      return saveTreatmentSettings(legacyTreatmentForCapsuleStrength(capsuleStrength));
    }

    return null;
  }

  function getTreatmentSettings() {
    return migrateLegacyTreatment();
  }

  function getCurrentLipaseUnitsPerUnit() {
    return Number(getTreatmentSettings()?.lipaseUnitsPerUnit || 0);
  }

  function getCurrentMedicationLabel() {
    return getTreatmentSettings()?.medicationDisplayName || "Medicamento não informado";
  }

  function getCurrentUnitLabel() {
    return getTreatmentSettings()?.unitLabel || "unidade";
  }

  function isTreatmentComplete() {
    return validateTreatmentSettings(getTreatmentSettings()).valid;
  }

  function requiresManualMedicationPower(settings) {
    return !Number(normalizeTreatmentSettings(settings).lipaseUnitsPerUnit);
  }

  window.PancreAITreatmentService = {
    TREATMENT_STORAGE_KEY,
    getTreatmentSettings,
    saveTreatmentSettings,
    validateTreatmentSettings,
    normalizeTreatmentSettings,
    createCustomTreatment,
    medicationToTreatment,
    getCurrentLipaseUnitsPerUnit,
    getCurrentMedicationLabel,
    getCurrentUnitLabel,
    isTreatmentComplete,
    requiresManualMedicationPower,
    migrateLegacyTreatment
  };
})();