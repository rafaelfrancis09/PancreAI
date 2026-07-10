(function () {
  const formatters = window.PancreAIUtils?.formatters;
  const hiddenIngredientsService = window.PancreAIServices?.hiddenIngredientsService;

  function sumNutrient(foods, key) {
    return (foods || []).reduce((sum, item) => sum + Number(item[key] || 0), 0);
  }

  function round(value, decimals = 2) {
    return formatters?.roundTo(value, decimals) ?? Number(Number(value || 0).toFixed(decimals));
  }

  function getTreatment(patient) {
    const treatment = patient?.treatment || window.PancreAICore?.getTreatment?.() || null;
    const lipaseUnitsPerUnit = Number(treatment?.lipaseUnitsPerUnit || patient?.capsuleStrength || 0);
    return {
      ...treatment,
      lipaseUnitsPerUnit,
      unitLabel: treatment?.unitLabel || "cápsula",
      medicationDisplayName: treatment?.medicationDisplayName || (lipaseUnitsPerUnit ? `Enzima ${lipaseUnitsPerUnit.toLocaleString("pt-BR")} U` : "Medicamento não informado")
    };
  }

  function calculate({ foods, patient, hiddenSelections }) {
    const confirmedFoods = foods || [];
    const treatment = getTreatment(patient);
    const totalFoodFat = sumNutrient(confirmedFoods, "fat");
    const hiddenFat = hiddenIngredientsService?.calculateHiddenFat(hiddenSelections) || 0;
    const totalFatGrams = round(totalFoodFat + hiddenFat, 2);
    const lipaseDose = Number(patient?.lipaseDose || 1800);
    const lipaseUnitsPerUnit = Number(treatment.lipaseUnitsPerUnit || 0);
    const lipaseUnitsNeeded = round(totalFatGrams * lipaseDose, 2);
    const unitsExact = lipaseUnitsPerUnit > 0 ? lipaseUnitsNeeded / lipaseUnitsPerUnit : 0;
    const unitsRounded = unitsExact > 0 ? Math.max(1, Math.ceil(unitsExact)) : 0;
    const lipaseUnitsDelivered = unitsRounded * lipaseUnitsPerUnit;

    return {
      totalFatGrams,
      totalProteinGrams: round(sumNutrient(confirmedFoods, "protein"), 2),
      totalCarbsGrams: round(sumNutrient(confirmedFoods, "carbs"), 2),
      totalCalories: round(sumNutrient(confirmedFoods, "calories"), 2),
      hiddenFatContribution: round(hiddenFat, 2),
      lipaseDose,
      prescribedUnitsPerGramFat: lipaseDose,
      lipaseUnitsNeeded,
      capsuleStrength: lipaseUnitsPerUnit,
      lipaseUnitsPerUnit,
      lipaseUnitsDelivered,
      capsulesExact: unitsExact,
      capsulesRounded: unitsRounded,
      unitsExact,
      unitsRounded,
      unitLabel: treatment.unitLabel,
      treatment,
      calculationSchemaVersion: "treatment-v1",
      calculationSteps: [
        {
          label: "Gordura total",
          value: `${totalFatGrams} g`
        },
        {
          label: "Dose prescrita",
          value: `${Number(lipaseDose).toLocaleString("pt-BR")} U/g`
        },
        {
          label: "Lipase necessária",
          value: `${formatters?.formatUnits(lipaseUnitsNeeded) || Math.round(lipaseUnitsNeeded)} U`
        },
        {
          label: "Medicamento",
          value: treatment.medicationDisplayName
        },
        {
          label: "Unidades estimadas",
          value: `${unitsRounded} ${treatment.unitLabel}${unitsRounded === 1 ? "" : "s"}`
        }
      ]
    };
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    doseCalculator: {
      calculate
    }
  };
})();