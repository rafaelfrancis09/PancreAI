(function () {
  const MEDICATION_SOURCE_REFERENCES = {
    "abbott-br-creon": {
      label: "Abbott Brasil - Bula Creon",
      url: "https://www.abbottbrasil.com.br/nossas-bulas/creon-bula-do-paciente.html",
      note: "Fonte usada para Creon 10.000 e 25.000 no Brasil."
    },
    "dailymed-creon-us": {
      label: "DailyMed - CREON",
      url: "https://dailymed.nlm.nih.gov/dailymed/",
      note: "Fonte usada para apresentações de CREON nos EUA."
    },
    "dailymed-zenpep-us": {
      label: "DailyMed/FDA - ZENPEP",
      url: "https://dailymed.nlm.nih.gov/dailymed/",
      note: "Fonte usada para apresentações de ZENPEP."
    },
    "pancreaze-hcp-us": {
      label: "PANCREAZE HCP - Dosing & Administration",
      url: "https://hcp.pancreaze.com/dosing-and-administration/",
      note: "Fonte usada para apresentações de PANCREAZE."
    },
    "pertzye-fda-label": {
      label: "FDA - PERTZYE Label",
      url: "https://www.accessdata.fda.gov/",
      note: "Fonte usada para PERTZYE."
    },
    "dailymed-viokace-us": {
      label: "DailyMed - VIOKACE",
      url: "https://dailymed.nlm.nih.gov/dailymed/",
      note: "Fonte usada para VIOKACE."
    },
    "emc-nutrizym-uk": {
      label: "emc UK - Nutrizym 22 SmPC",
      url: "https://www.medicines.org.uk/emc/",
      note: "Fonte usada para Nutrizym 22."
    },
    "nhs-sps-pert-uk": {
      label: "NHS Specialist Pharmacy Service - PERT alternatives",
      url: "https://www.sps.nhs.uk/",
      note: "Fonte de apoio para produtos PERT no Reino Unido."
    },
    "bc-cancer-canada-enzymes": {
      label: "BC Cancer - Pancreatic Enzymes",
      url: "https://www.bccancer.bc.ca/",
      note: "Fonte de apoio para produtos no Canadá."
    },
    "health-qld-au-pert": {
      label: "Queensland Health - PERT",
      url: "https://www.health.qld.gov.au/",
      note: "Fonte usada para opções comuns de PERT na Austrália."
    },
    "ema-creon-eu": {
      label: "European Medicines Agency - Creon shortage",
      url: "https://www.ema.europa.eu/",
      note: "Fonte usada para indicar presença de Creon em países europeus."
    },
    "has-fr-creon": {
      label: "HAS France - Creon 35.000",
      url: "https://www.has-sante.fr/",
      note: "Fonte usada para Creon 35.000 na França."
    },
    "eisai-jp-lipacreon": {
      label: "Eisai Japan - Lipacreon",
      url: "https://www.eisai.com/",
      note: "Fonte usada para Lipacreon no Japão."
    },
    "pmda-jp-lipacreon": {
      label: "PMDA Japan - Lipacreon",
      url: "https://www.pmda.go.jp/",
      note: "Fonte de apoio para formas do Lipacreon."
    },
    "cff-pert-safety": {
      label: "Cystic Fibrosis Foundation - Pancreatic Enzyme Guidelines",
      url: "https://www.cff.org/",
      note: "Fonte usada para limites de segurança por kg/refeição, kg/dia e por grama de gordura."
    }
  };

  window.PancreAIMedicationSources = {
    MEDICATION_SOURCE_REFERENCES,
    getSourceByRef(ref) {
      return MEDICATION_SOURCE_REFERENCES[ref] || null;
    }
  };
})();
