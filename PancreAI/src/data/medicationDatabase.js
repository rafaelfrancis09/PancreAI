(function () {
  const COMMON_CAUTION = "Use apenas se corresponder à sua prescrição, embalagem ou bula.";

  function medication(config) {
    const lipaseUnits = Number.isFinite(Number(config.lipaseUnits)) ? Number(config.lipaseUnits) : null;
    const allowInCalculator = config.allowInCalculator ?? lipaseUnits > 0;
    return {
      id: config.id,
      brand: config.brand,
      displayName: config.displayName,
      genericName: config.genericName || "pancreatina",
      enzymeClass: "PERT",
      form: config.form || "capsule",
      unitLabel: config.unitLabel || "cápsula",
      lipaseUnits,
      amylaseUnits: Number.isFinite(Number(config.amylaseUnits)) ? Number(config.amylaseUnits) : null,
      proteaseUnits: Number.isFinite(Number(config.proteaseUnits)) ? Number(config.proteaseUnits) : null,
      regions: config.regions || config.countryCodes || [],
      countryCodes: config.countryCodes || config.regions || [],
      verificationLevel: config.verificationLevel || (allowInCalculator ? "source-supported" : "needs-local-verification"),
      allowInCalculator: Boolean(allowInCalculator && lipaseUnits > 0),
      requiresPrescription: config.requiresPrescription !== false,
      sourceRefs: config.sourceRefs || [],
      cautionMessage: config.cautionMessage || COMMON_CAUTION
    };
  }

  function brandedSeries({ countryCode, brand, idPrefix, units, sourceRefs, verificationLevel, form, unitLabel }) {
    return units.map((unit) => medication({
      id: `${idPrefix}_${unit}_${countryCode.toLowerCase()}`,
      brand,
      displayName: `${brand} ${Number(unit).toLocaleString("pt-BR")}`,
      form,
      unitLabel,
      lipaseUnits: unit,
      regions: [countryCode],
      countryCodes: [countryCode],
      verificationLevel,
      sourceRefs
    }));
  }

  const MEDICATION_DATABASE = [
    medication({
      id: "creon_10000_br",
      brand: "Creon",
      displayName: "Creon 10.000",
      lipaseUnits: 10000,
      amylaseUnits: 8000,
      proteaseUnits: 600,
      regions: ["BR"],
      countryCodes: ["BR"],
      verificationLevel: "verified",
      sourceRefs: ["abbott-br-creon"]
    }),
    medication({
      id: "creon_25000_br",
      brand: "Creon",
      displayName: "Creon 25.000",
      lipaseUnits: 25000,
      amylaseUnits: 18000,
      proteaseUnits: 1000,
      regions: ["BR"],
      countryCodes: ["BR"],
      verificationLevel: "verified",
      sourceRefs: ["abbott-br-creon"]
    }),

    ...brandedSeries({ countryCode: "US", brand: "Creon", idPrefix: "creon", units: [3000, 6000, 12000, 24000, 36000], sourceRefs: ["dailymed-creon-us"], verificationLevel: "verified" }),
    ...brandedSeries({ countryCode: "US", brand: "Zenpep", idPrefix: "zenpep", units: [3000, 5000, 10000, 15000, 20000, 25000, 40000, 60000], sourceRefs: ["dailymed-zenpep-us"], verificationLevel: "verified" }),
    ...brandedSeries({ countryCode: "US", brand: "Pancreaze", idPrefix: "pancreaze", units: [2600, 4200, 10500, 16800, 21000, 37000], sourceRefs: ["pancreaze-hcp-us"], verificationLevel: "verified" }),
    ...brandedSeries({ countryCode: "US", brand: "Pertzye", idPrefix: "pertzye", units: [4000, 8000, 16000, 24000], sourceRefs: ["pertzye-fda-label"], verificationLevel: "verified" }),
    ...brandedSeries({ countryCode: "US", brand: "Viokace", idPrefix: "viokace", units: [10440, 20880], sourceRefs: ["dailymed-viokace-us"], verificationLevel: "verified", form: "tablet", unitLabel: "comprimido" }),

    medication({ id: "creon_10000_gb", brand: "Creon", displayName: "Creon 10.000", lipaseUnits: 10000, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "source-supported", sourceRefs: ["nhs-sps-pert-uk"] }),
    medication({ id: "creon_25000_gb", brand: "Creon", displayName: "Creon 25.000", lipaseUnits: 25000, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "source-supported", sourceRefs: ["nhs-sps-pert-uk"] }),
    medication({ id: "nutrizym_22000_gb", brand: "Nutrizym", displayName: "Nutrizym 22", lipaseUnits: 22000, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "source-supported", sourceRefs: ["emc-nutrizym-uk"] }),
    medication({ id: "creon_micro_gb", brand: "Creon", displayName: "Creon Micro", form: "granules", unitLabel: "g", lipaseUnits: null, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["nhs-sps-pert-uk"] }),
    medication({ id: "pancrex_v_capsules_gb", brand: "Pancrex V", displayName: "Pancrex V cápsulas", lipaseUnits: null, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["nhs-sps-pert-uk"] }),
    medication({ id: "pancrex_v_powder_gb", brand: "Pancrex V", displayName: "Pancrex V pó", form: "powder", unitLabel: "g", lipaseUnits: null, regions: ["GB"], countryCodes: ["GB"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["nhs-sps-pert-uk"] }),

    medication({ id: "creon_10000_ca", brand: "Creon", displayName: "Creon 10.000", lipaseUnits: 10000, regions: ["CA"], countryCodes: ["CA"], verificationLevel: "source-supported", sourceRefs: ["bc-cancer-canada-enzymes"] }),
    medication({ id: "creon_25000_ca", brand: "Creon", displayName: "Creon 25.000", lipaseUnits: 25000, regions: ["CA"], countryCodes: ["CA"], verificationLevel: "source-supported", sourceRefs: ["bc-cancer-canada-enzymes"] }),
    ...brandedSeries({ countryCode: "CA", brand: "Pancrease MT", idPrefix: "pancrease_mt", units: [4000, 10000, 16000], sourceRefs: ["bc-cancer-canada-enzymes"], verificationLevel: "source-supported" }),
    ...brandedSeries({ countryCode: "CA", brand: "Cotazym ECS", idPrefix: "cotazym_ecs", units: [8000, 20000], sourceRefs: ["bc-cancer-canada-enzymes"], verificationLevel: "source-supported" }),
    ...brandedSeries({ countryCode: "CA", brand: "Viokace", idPrefix: "viokace", units: [10000, 20000], sourceRefs: ["bc-cancer-canada-enzymes"], verificationLevel: "source-supported", form: "tablet", unitLabel: "comprimido" }),

    medication({ id: "creon_micro_au", brand: "Creon", displayName: "Creon Micro", form: "granules", unitLabel: "g", lipaseUnits: null, regions: ["AU"], countryCodes: ["AU"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["health-qld-au-pert"] }),
    ...brandedSeries({ countryCode: "AU", brand: "Creon", idPrefix: "creon", units: [10000, 25000, 35000], sourceRefs: ["health-qld-au-pert"], verificationLevel: "source-supported" }),

    medication({ id: "creon_35000_fr", brand: "Creon", displayName: "Creon 35.000", lipaseUnits: 35000, regions: ["FR"], countryCodes: ["FR"], verificationLevel: "source-supported", sourceRefs: ["has-fr-creon"] }),
    medication({ id: "eurobiol_fr", brand: "Eurobiol", displayName: "Eurobiol", lipaseUnits: null, regions: ["FR"], countryCodes: ["FR"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),

    medication({ id: "kreon_de", brand: "Kreon", displayName: "Kreon", lipaseUnits: null, regions: ["DE"], countryCodes: ["DE"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "pangrol_de", brand: "Pangrol", displayName: "Pangrol", lipaseUnits: null, regions: ["DE"], countryCodes: ["DE"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "panzytrat_de", brand: "Panzytrat", displayName: "Panzytrat", lipaseUnits: null, regions: ["DE"], countryCodes: ["DE"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "lipacreon_capsule_150_jp", brand: "Lipacreon", displayName: "Lipacreon cápsula 150 mg", lipaseUnits: null, regions: ["JP"], countryCodes: ["JP"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["eisai-jp-lipacreon", "pmda-jp-lipacreon"] }),
    medication({ id: "lipacreon_granules_300_jp", brand: "Lipacreon", displayName: "Lipacreon grânulos 300 mg", form: "granules", unitLabel: "unidade", lipaseUnits: null, regions: ["JP"], countryCodes: ["JP"], verificationLevel: "brand-level-only", allowInCalculator: false, sourceRefs: ["eisai-jp-lipacreon", "pmda-jp-lipacreon"] }),

    medication({ id: "creon_kreon_eu", brand: "Creon/Kreon", displayName: "Creon/Kreon", lipaseUnits: null, regions: ["EU_COMMON"], countryCodes: ["EU"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "pangrol_eu", brand: "Pangrol", displayName: "Pangrol", lipaseUnits: null, regions: ["EU_COMMON"], countryCodes: ["EU"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "panzytrat_eu", brand: "Panzytrat", displayName: "Panzytrat", lipaseUnits: null, regions: ["EU_COMMON"], countryCodes: ["EU"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),
    medication({ id: "pancreatin_generic_eu", brand: "Pancreatina", displayName: "Pancreatina genérica", lipaseUnits: null, regions: ["EU_COMMON"], countryCodes: ["EU"], verificationLevel: "regional-manual", allowInCalculator: false, sourceRefs: ["ema-creon-eu"] }),

    medication({ id: "creon_in", brand: "Creon", displayName: "Creon", lipaseUnits: null, regions: ["IN"], countryCodes: ["IN"], verificationLevel: "needs-local-verification", allowInCalculator: false, sourceRefs: [] }),
    medication({ id: "agna_in", brand: "Agna", displayName: "Agna", lipaseUnits: null, regions: ["IN"], countryCodes: ["IN"], verificationLevel: "needs-local-verification", allowInCalculator: false, sourceRefs: [] }),
    medication({ id: "enzar_in", brand: "Enzar", displayName: "Enzar", lipaseUnits: null, regions: ["IN"], countryCodes: ["IN"], verificationLevel: "needs-local-verification", allowInCalculator: false, sourceRefs: [] }),
    medication({ id: "panlipase_in", brand: "Panlipase", displayName: "Panlipase", lipaseUnits: null, regions: ["IN"], countryCodes: ["IN"], verificationLevel: "needs-local-verification", allowInCalculator: false, sourceRefs: [] })
  ];

  function getMedicationById(id) {
    return MEDICATION_DATABASE.find((item) => item.id === id) || null;
  }

  function getMedicationsByRegion(regionCode) {
    const normalized = String(regionCode || "").toUpperCase();
    return MEDICATION_DATABASE.filter((item) => item.regions.includes(normalized) || item.countryCodes.includes(normalized));
  }

  window.PancreAIMedicationDatabase = {
    MEDICATION_DATABASE,
    getMedicationById,
    getMedicationsByRegion
  };
})();
