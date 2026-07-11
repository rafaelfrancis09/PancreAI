(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function calculate({ analysis, changes, hiddenSelections, missingNutritionCount }) {
    let score = 92;
    const reasons = [];
    const sourceLabel = analysis?.isSimulated !== false ? "demonstração" : "análise visual";

    if (analysis?.confidence < 70) {
      score -= 18;
      reasons.push(`A ${sourceLabel} teve baixa confiança.`);
    } else if (analysis?.confidence < 85) {
      score -= 8;
      reasons.push(`A confiança da ${sourceLabel} foi intermediária.`);
    } else {
      reasons.push(`A ${sourceLabel} teve boa confiança.`);
    }

    if (analysis?.qualityWarning) {
      score -= 10;
      reasons.push("A foto teve uma condição que exige revisão.");
    } else {
      reasons.push("A foto teve boa qualidade.");
    }

    if (analysis?.unknownFood || analysis?.unknownItems?.length) {
      score -= 14;
      reasons.push("Há alimento sem identificação confiável.");
    }

    if ((changes || []).length > 3) {
      score -= 8;
      reasons.push("Muitos itens foram alterados manualmente.");
    } else if ((changes || []).length > 0) {
      reasons.push("A refeição foi revisada manualmente.");
    }

    if (!(hiddenSelections || []).some((item) => item.selected)) {
      score -= 4;
      reasons.push("Ingredientes ocultos precisam ser considerados quando existirem.");
    }

    if (missingNutritionCount > 0) {
      score -= 12;
      reasons.push("Ha alimentos sem dados nutricionais completos.");
    }

    const finalScore = clamp(Math.round(score), 0, 100);
    const level = finalScore >= 80 ? "high" : finalScore >= 60 ? "medium" : "low";

    return {
      level,
      score: finalScore,
      reasons
    };
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    confidenceService: {
      calculate
    }
  };
})();
