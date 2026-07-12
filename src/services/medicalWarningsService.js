(function () {
  function warning({ id, category = "educational", severity = "info", title, message, stage }) {
    return { id, category, type: category, severity, title, message, stage };
  }

  function isEducationalEnabled(value) {
    return value === true;
  }

  function normalizeSafetyWarning(item, stage) {
    if (!item?.title || !item?.message) {
      return null;
    }

    const severity = item.type === "critical"
      ? "critical"
      : item.type === "warning"
        ? "warning"
        : "info";

    return warning({
      id: `required-${stage}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category: "required",
      severity,
      title: item.title,
      message: item.message,
      stage
    });
  }

  function uniqueWarnings(items) {
    const seen = new Set();
    return items.filter((item) => {
      if (!item || seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  function getRecentAverage(history, key) {
    const values = (history || [])
      .slice(0, 8)
      .map((item) => Number(item?.[key] || 0))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (values.length < 3) {
      return null;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function getRequiredWarnings({ stage, result }) {
    if (!result?.safetyWarnings?.length) {
      return [];
    }

    const warnings = result.safetyWarnings
      .filter((item) => item.type === "critical" || item.type === "warning")
      .map((item) => normalizeSafetyWarning(item, stage))
      .filter(Boolean);

    if (stage === "result") {
      return warnings;
    }

    return warnings.filter((item) => item.severity === "critical");
  }

  function getAnalysisWarnings({ analysis }) {
    const warnings = [];

    if (analysis?.confidence < 70) {
      warnings.push(warning({
        id: "analysis-low-confidence",
        severity: "warning",
        title: "Revise com atenção",
        message: "A análise inicial tem menor confiança. Confira os alimentos e porções antes de calcular.",
        stage: "analysis"
      }));
    }

    if (analysis?.qualityWarning) {
      warnings.push(warning({
        id: "analysis-photo-quality",
        severity: "info",
        title: "Foto pode influenciar a estimativa",
        message: "Iluminação, distância e enquadramento podem afetar a sugestão inicial dos alimentos.",
        stage: "analysis"
      }));
    }

    if (analysis?.unknownFood || analysis?.unknownItems?.length) {
      warnings.push(warning({
        id: "analysis-unknown-food",
        severity: "warning",
        title: "Alimento não identificado",
        message: "Substitua, edite ou remova este item antes de continuar.",
        stage: "analysis"
      }));
    }

    if (analysis?.packaging) {
      warnings.push(warning({
        id: "analysis-packaging",
        severity: "info",
        title: "Embalagem detectada",
        message: "O app não lê rótulos. Confira manualmente as informações nutricionais.",
        stage: "analysis"
      }));
    }


    return warnings;
  }

  function getReviewWarnings({ changes, hiddenSelections }) {
    const warnings = [];
    const hasHiddenOptions = (hiddenSelections || []).some((item) => item?.label);
    const hasUnselectedHidden = (hiddenSelections || []).some((item) => item?.label && !item.selected);


    if (hasHiddenOptions || hasUnselectedHidden) {
      warnings.push(warning({
        id: "review-hidden-ingredients",
        severity: "info",
        title: "Ingredientes ocultos podem mudar o resultado",
        message: "Óleo, azeite, manteiga, molhos e maionese podem aumentar a gordura da refeição.",
        stage: "review"
      }));
    }

    if ((changes || []).length >= 2) {
      warnings.push(warning({
        id: "review-manual-changes",
        severity: "info",
        title: "Estimativa alterada manualmente",
        message: "As alterações feitas pelo usuário serão consideradas no cálculo final.",
        stage: "review"
      }));
    }

    return warnings;
  }

  function getResultWarnings({ result, history }) {
    const warnings = [warning({
      id: "result-estimate",
      severity: "info",
      title: "Este resultado é uma estimativa",
      message: "O cálculo usa a gordura estimada da refeição, a dose prescrita cadastrada e a potência do medicamento cadastrado. Ele não substitui orientação médica ou nutricional.",
      stage: "result"
    })];

    const averageFat = getRecentAverage(history, "totalFat");
    if (averageFat && result?.totalFat > averageFat * 1.45) {
      warnings.push(warning({
        id: "result-high-fat-history",
        severity: "warning",
        title: "Refeição acima do padrão recente",
        message: "Esta refeição parece ter mais gordura que a maioria dos registros anteriores. Revise porções e ingredientes adicionados.",
        stage: "result"
      }));
    }

    const averageCapsules = getRecentAverage(history, "capsules");
    if (averageCapsules && result?.capsules > Math.max(averageCapsules * 1.5, averageCapsules + 2)) {
      warnings.push(warning({
        id: "result-high-capsules-history",
        severity: "warning",
        title: "Resultado acima do seu padrão",
        message: "A quantidade estimada de unidades ficou acima do padrão recente do histórico. Confira se os alimentos foram revisados corretamente.",
        stage: "result"
      }));
    }

    if (["medium", "low"].includes(result?.calculationReliability?.level)) {
      warnings.push(warning({
        id: "result-reduced-reliability",
        severity: "warning",
        title: "Confiabilidade reduzida",
        message: "Alguns dados da refeição foram estimados ou ficaram incertos. Revise o cálculo completo antes de considerar o resultado.",
        stage: "result"
      }));
    }

    return warnings;
  }

  function generateMedicalWarnings(context = {}) {
    const stage = context.stage || "analysis";
    const required = getRequiredWarnings(context);
    const educationalEnabled = isEducationalEnabled(context.educationalEnabled);
    let educational = [];

    if (educationalEnabled) {
      if (stage === "analysis") {
        educational = getAnalysisWarnings(context);
      }
      if (stage === "review") {
        educational = getReviewWarnings(context);
      }
      if (stage === "result") {
        educational = getResultWarnings(context);
      }
    }

    return uniqueWarnings([
      ...required,
      ...educational
    ]);
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    medicalWarningsService: {
      generateMedicalWarnings
    }
  };
})();