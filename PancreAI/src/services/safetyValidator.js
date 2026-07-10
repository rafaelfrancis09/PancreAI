(function () {
  function createWarning(type, title, message, details) {
    return { type, title, message, ...(details || {}) };
  }

  function dailyDeliveredUnits(history) {
    const today = new Date().toLocaleDateString("pt-BR");
    return (history || [])
      .filter((meal) => meal.date === today || new Date(meal.confirmedAt || meal.createdAt || 0).toLocaleDateString("pt-BR") === today)
      .reduce((sum, meal) => sum + Number(meal.lipaseUnitsDelivered || meal.lipaseUnits || 0), 0);
  }

  function validate({ foods, patient, calculation, analysis, history }) {
    const warnings = [];
    const treatment = calculation?.treatment || patient?.treatment || null;
    const weightKg = Number(patient?.weight || 0);
    const totalFatGrams = Number(calculation?.totalFatGrams || 0);
    const lipaseDose = Number(calculation?.prescribedUnitsPerGramFat || patient?.lipaseDose || 0);
    const lipaseUnitsPerUnit = Number(calculation?.lipaseUnitsPerUnit || treatment?.lipaseUnitsPerUnit || patient?.capsuleStrength || 0);
    const lipaseUnitsNeeded = Number(calculation?.lipaseUnitsNeeded || 0);
    const lipaseUnitsDelivered = Number(calculation?.lipaseUnitsDelivered || 0);

    if (!weightKg) {
      warnings.push(createWarning("critical", "Peso não informado", "Cadastre o peso para validar a estimativa por kg."));
    }

    if (!lipaseDose) {
      warnings.push(createWarning("critical", "Dose prescrita ausente", "Cadastre a dose em U/g de gordura antes de calcular."));
    }

    if (!treatment?.medicationDisplayName) {
      warnings.push(createWarning("critical", "Medicamento não selecionado", "Escolha o medicamento enzimático usado na sua prescrição."));
    }

    if (!lipaseUnitsPerUnit) {
      warnings.push(createWarning("critical", "Potência ausente", "Informe as unidades de lipase por unidade do medicamento."));
    }

    if (totalFatGrams <= 0 && foods?.length) {
      warnings.push(createWarning("critical", "Gordura total inválida", "Revise os alimentos antes de calcular."));
    }

    if (!warnings.some((warning) => warning.type === "critical")) {
      const unitsPerKgMealDelivered = weightKg ? lipaseUnitsDelivered / weightKg : 0;
      const unitsPerGramFatDelivered = totalFatGrams ? lipaseUnitsDelivered / totalFatGrams : 0;
      const dailyUnitsPerKg = weightKg ? (dailyDeliveredUnits(history) + lipaseUnitsDelivered) / weightKg : 0;

      if (unitsPerKgMealDelivered > 6000) {
        warnings.push(createWarning("critical", "Estimativa muito alta", "Não confie neste resultado sem orientação profissional."));
      } else if (unitsPerKgMealDelivered > 2500) {
        warnings.push(createWarning("warning", "Revisar dose", "A estimativa ultrapassa 2.500 U de lipase/kg/refeição."));
      }

      if (dailyUnitsPerKg > 10000) {
        warnings.push(createWarning("warning", "Revisar dia", "A estimativa diária pode ultrapassar 10.000 U de lipase/kg/dia."));
      }

      if (unitsPerGramFatDelivered > 4000) {
        warnings.push(createWarning("warning", "Revisar gordura", "A estimativa ultrapassa 4.000 U de lipase/g de gordura."));
      }

      if (treatment?.isCustom) {
        warnings.push(createWarning("notice", "Medicamento personalizado", "Confira se a lipase foi cadastrada exatamente como na prescrição."));
      } else if (!["verified", "source-supported"].includes(treatment?.verificationLevel)) {
        warnings.push(createWarning("notice", "Potência a confirmar", "Confirme a potência na prescrição ou embalagem."));
      }

      if (lipaseUnitsNeeded > 0 && lipaseUnitsDelivered > lipaseUnitsNeeded * 1.5) {
        warnings.push(createWarning("warning", "Arredondamento alto", "O arredondamento aumentou bastante a lipase entregue."));
      }

      if (["powder", "sachet", "granules"].includes(treatment?.medicationForm)) {
        warnings.push(createWarning("notice", "Forma específica", "Esta forma pode exigir orientação específica de uso."));
      }
    }

    if (analysis?.unknownFood || analysis?.unknownItems?.length) {
      warnings.push(createWarning("warning", "Alimento não identificado", "Edite ou remova itens sem identificação confiável antes de confirmar."));
    }

    return warnings;
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    safetyValidator: {
      validate
    }
  };
})();