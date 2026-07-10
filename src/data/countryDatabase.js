(function () {
  const COUNTRY_DATABASE = [
    country("BR", "Brasil", "Brasil", "Brazil", "BR", "pt-BR", "verified", "LATAM"),
    country("US", "Estados Unidos", "United States", "United States", "US", "en-US", "verified", "NORTH_AMERICA"),
    country("GB", "Reino Unido", "United Kingdom", "United Kingdom", "GB", "en-GB", "source-supported", "EUROPE"),
    country("CA", "Canadá", "Canada", "Canada", "CA", "en-CA", "source-supported", "NORTH_AMERICA"),
    country("AU", "Austrália", "Australia", "Australia", "AU", "en-AU", "source-supported", "OCEANIA"),
    country("ES", "Espanha", "España", "Spain", "ES", "es-ES", "regional-manual", "EUROPE"),
    country("FR", "França", "France", "France", "FR", "fr-FR", "source-supported", "EUROPE"),
    country("DE", "Alemanha", "Deutschland", "Germany", "DE", "de-DE", "regional-manual", "EUROPE"),
    country("IT", "Itália", "Italia", "Italy", "IT", "it-IT", "regional-manual", "EUROPE"),
    country("RU", "Rússia", "Россия", "Russia", "RU", "ru-RU", "manual", "EUROPE_ASIA"),
    country("PL", "Polônia", "Polska", "Poland", "PL", "pl-PL", "regional-manual", "EUROPE"),
    country("TR", "Turquia", "Türkiye", "Turkey", "TR", "tr-TR", "manual", "EUROPE_ASIA"),
    country("NL", "Holanda", "Nederland", "Netherlands", "NL", "nl-NL", "regional-manual", "EUROPE"),
    country("SA", "Arábia Saudita", "العربية السعودية", "Saudi Arabia", "SA", "ar-SA", "manual", "MIDDLE_EAST"),
    country("CN", "China", "中国", "China", "CN", "zh-CN", "manual", "ASIA"),
    country("IN", "Índia", "भारत", "India", "IN", "hi-IN", "manual", "ASIA"),
    country("BD", "Bangladesh", "বাংলাদেশ", "Bangladesh", "BD", "bn-BD", "manual", "ASIA"),
    country("JP", "Japão", "日本", "Japan", "JP", "ja-JP", "source-supported", "ASIA"),
    country("KR", "Coreia do Sul", "대한민국", "South Korea", "KR", "ko-KR", "manual", "ASIA"),
    country("GR", "Grécia", "Ελλάδα", "Greece", "GR", "el-GR", "regional-manual", "EUROPE"),
    country("SE", "Suécia", "Sverige", "Sweden", "SE", "sv-SE", "regional-manual", "EUROPE"),
    country("NO", "Noruega", "Norge", "Norway", "NO", "no-NO", "regional-manual", "EUROPE"),
    country("DK", "Dinamarca", "Danmark", "Denmark", "DK", "da-DK", "regional-manual", "EUROPE"),
    country("FI", "Finlândia", "Suomi", "Finland", "FI", "fi-FI", "regional-manual", "EUROPE"),
    country("CZ", "Chéquia", "Česko", "Czechia", "CZ", "cs-CZ", "regional-manual", "EUROPE"),
    country("RO", "Romênia", "România", "Romania", "RO", "ro-RO", "regional-manual", "EUROPE"),
    country("UA", "Ucrânia", "Україна", "Ukraine", "UA", "uk-UA", "manual", "EUROPE"),
    country("IL", "Israel", "ישראל", "Israel", "IL", "he-IL", "manual", "MIDDLE_EAST"),
    country("EU", "Europa", "Europe", "Europe", "EU", null, "regional-manual", "EUROPE"),
    country("OTHER", "Outro", "Other", "Other", "GLOBE", null, "manual", "GLOBAL")
  ];

  function country(code, namePt, localName, englishName, flagCode, defaultLanguageCode, medicationSupport, regionGroup) {
    return {
      code,
      namePt,
      localName,
      englishName,
      flagCode,
      defaultLanguageCode,
      medicationSupport,
      regionGroup,
      isTreatmentRegion: true,
      isLanguageRegion: code !== "EU" && code !== "OTHER"
    };
  }

  function normalizeCode(code) {
    return String(code || "").trim().toUpperCase();
  }

  function getCountryByCode(code) {
    const normalized = normalizeCode(code);
    return COUNTRY_DATABASE.find((item) => item.code === normalized || item.flagCode === normalized) || null;
  }

  function getAllCountries() {
    return COUNTRY_DATABASE.slice();
  }

  function getLanguageCountries() {
    return COUNTRY_DATABASE.filter((item) => item.isLanguageRegion);
  }

  function getTreatmentCountries() {
    return COUNTRY_DATABASE.filter((item) => item.isTreatmentRegion);
  }

  function getCountriesByMedicationSupport(status) {
    return COUNTRY_DATABASE.filter((item) => item.medicationSupport === status);
  }

  function isCountryVerifiedForMedication(code) {
    return getCountryByCode(code)?.medicationSupport === "verified";
  }

  window.PancreAICountryDatabase = {
    COUNTRY_DATABASE,
    getCountryByCode,
    getAllCountries,
    getLanguageCountries,
    getTreatmentCountries,
    getCountriesByMedicationSupport,
    isCountryVerifiedForMedication
  };
})();
