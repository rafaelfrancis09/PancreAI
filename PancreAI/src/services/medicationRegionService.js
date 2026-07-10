(function () {
  const database = window.PancreAIMedicationDatabase;
  const countryMap = window.PancreAICountryMedicationMap;
  const countries = window.PancreAICountryDatabase;

  function verificationLabel(level) {
    const labels = {
      verified: "Verificado",
      "source-supported": "Fonte regional",
      "brand-level-only": "Confirmar potência",
      "needs-local-verification": "Confirmar potência",
      "regional-manual": "Confirmar potência",
      custom: "Cadastro manual"
    };
    return labels[level] || "Confirmar potência";
  }

  function normalizeMedication(medication, countryCode) {
    return {
      ...medication,
      countryCode,
      countryName: countries?.getCountryByCode(countryCode)?.namePt || countryCode,
      verificationLabel: verificationLabel(medication.verificationLevel),
      needsManualPower: !medication.allowInCalculator || !Number(medication.lipaseUnits)
    };
  }

  function getCustomOption(countryCode) {
    return {
      id: "custom",
      brand: "Meu medicamento",
      displayName: "Meu medicamento não está na lista",
      genericName: "pancreatina",
      enzymeClass: "PERT",
      form: "custom",
      unitLabel: "unidade",
      lipaseUnits: null,
      amylaseUnits: null,
      proteaseUnits: null,
      regions: [countryCode],
      countryCodes: [countryCode],
      verificationLevel: "custom",
      verificationLabel: "Cadastro manual",
      allowInCalculator: false,
      requiresPrescription: true,
      sourceRefs: [],
      cautionMessage: "Cadastre apenas valores que aparecem na sua prescrição, embalagem ou bula.",
      needsManualPower: true,
      isCustomOption: true,
      countryCode,
      countryName: countries?.getCountryByCode(countryCode)?.namePt || countryCode
    };
  }

  function getMedicationOptionsForCountry(countryCode) {
    const normalized = String(countryCode || "BR").toUpperCase();
    const ids = countryMap?.getMedicationIdsForCountry(normalized) || [];
    const medications = ids
      .map((id) => database?.getMedicationById(id))
      .filter(Boolean)
      .map((item) => normalizeMedication(item, normalized));

    return [...medications, getCustomOption(normalized)];
  }

  function getMedicationById(id) {
    return database?.getMedicationById(id) || null;
  }

  window.PancreAIMedicationRegionService = {
    getMedicationOptionsForCountry,
    getMedicationById,
    getCustomOption,
    verificationLabel
  };
})();
