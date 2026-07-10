(function () {
  const COUNTRY_MEDICATION_MAP = {
    BR: ["creon_10000_br", "creon_25000_br"],
    US: ["creon_3000_us", "creon_6000_us", "creon_12000_us", "creon_24000_us", "creon_36000_us", "zenpep_3000_us", "zenpep_5000_us", "zenpep_10000_us", "zenpep_15000_us", "zenpep_20000_us", "zenpep_25000_us", "zenpep_40000_us", "zenpep_60000_us", "pancreaze_2600_us", "pancreaze_4200_us", "pancreaze_10500_us", "pancreaze_16800_us", "pancreaze_21000_us", "pancreaze_37000_us", "pertzye_4000_us", "pertzye_8000_us", "pertzye_16000_us", "pertzye_24000_us", "viokace_10440_us", "viokace_20880_us"],
    GB: ["creon_10000_gb", "creon_25000_gb", "nutrizym_22000_gb", "pancrex_v_capsules_gb", "pancrex_v_powder_gb", "creon_micro_gb"],
    CA: ["creon_10000_ca", "creon_25000_ca", "pancrease_mt_4000_ca", "pancrease_mt_10000_ca", "pancrease_mt_16000_ca", "cotazym_ecs_8000_ca", "cotazym_ecs_20000_ca", "viokace_10000_ca", "viokace_20000_ca"],
    AU: ["creon_micro_au", "creon_10000_au", "creon_25000_au", "creon_35000_au"],
    FR: ["creon_35000_fr", "eurobiol_fr"],
    DE: ["kreon_de", "pangrol_de", "panzytrat_de"],
    JP: ["lipacreon_capsule_150_jp", "lipacreon_granules_300_jp"],
    IN: ["creon_in", "agna_in", "enzar_in", "panlipase_in"],
    EU_COMMON: ["creon_kreon_eu", "pangrol_eu", "panzytrat_eu", "pancreatin_generic_eu"]
  };

  const EUROPE_WITH_COMMON_FALLBACK = ["ES", "DE", "IT", "PL", "NL", "GR", "SE", "NO", "DK", "FI", "CZ", "RO", "UA", "EU"];

  function getMedicationIdsForCountry(countryCode) {
    const normalized = String(countryCode || "").toUpperCase();
    if (COUNTRY_MEDICATION_MAP[normalized]) return COUNTRY_MEDICATION_MAP[normalized].slice();
    if (EUROPE_WITH_COMMON_FALLBACK.includes(normalized)) return COUNTRY_MEDICATION_MAP.EU_COMMON.slice();
    return [];
  }

  window.PancreAICountryMedicationMap = {
    COUNTRY_MEDICATION_MAP,
    EUROPE_WITH_COMMON_FALLBACK,
    getMedicationIdsForCountry
  };
})();
