(function () {
  const nutritionDatabase = window.PancreAIData?.nutritionDatabase;
  const mealDatabase = window.PancreAIData?.mealDatabase;
  const mockProvider = window.PancreAIServices?.mockMealRecognitionProvider;
  const doseCalculator = window.PancreAIServices?.doseCalculator;
  const safetyValidator = window.PancreAIServices?.safetyValidator;
  const confidenceService = window.PancreAIServices?.confidenceService;
  const hiddenIngredientsService = window.PancreAIServices?.hiddenIngredientsService;
  const captureService = window.PancreAIServices?.simulatedCaptureService;
  const core = window.PancreAICore;

  const legacyNutritionDatabase = nutritionDatabase?.asLegacyNutrition() || [];

  function toLegacyPhotoQuality(analysis) {
    return analysis?.photoQuality?.label || analysis?.photoQuality || "Foto boa";
  }

  function simulateAnalysis(mealId) {
    const canUseCapturedMeal = mealId && captureService?.buildMockAnalysisForMeal;
    if (!canUseCapturedMeal && !mockProvider?.analyze) {
      throw new Error("MockMealRecognitionProvider indispon\u00edvel.");
    }

    const analysis = canUseCapturedMeal
      ? captureService.buildMockAnalysisForMeal(mealId)
      : mockProvider.analyze();

    return {
      ...analysis,
      photoQualityDetails: analysis.photoQuality,
      photoQuality: toLegacyPhotoQuality(analysis),
      hiddenFats: analysis.hiddenFats || hiddenIngredientsService?.getDefaultSelections() || []
    };
  }
  function calculateMeal(analysis, patient, hiddenSelections) {
    const foods = analysis.foods || [];
    const calculation = doseCalculator.calculate({
      foods,
      patient,
      hiddenSelections
    });
    const safetyWarnings = safetyValidator.validate({
      foods,
      patient,
      calculation,
      analysis,
      history: core?.getHistory?.() || []
    });
    const missingNutritionCount = foods.filter((food) => food.missingNutrition).length;
    const calculationReliability = confidenceService.calculate({
      analysis,
      changes: analysis.changes || [],
      hiddenSelections,
      missingNutritionCount
    });

    const explanation = foods.map((item) => ({
      name: item.name,
      grams: item.grams,
      fat: item.fat,
      protein: item.protein,
      carbs: item.carbs,
      calories: item.calories
    }));

    const hiddenFatText = calculation.hiddenFatContribution > 0
      ? ` Ingredientes ocultos adicionaram ${calculation.hiddenFatContribution.toFixed(1)}g de gordura.`
      : "";

    return {
      analysisId: analysis.id,
      provider: analysis.provider || "mock",
      providerLabel: analysis.providerLabel || "MockVision",
      isSimulated: analysis.isSimulated !== false,
      mealName: analysis.mealName,
      category: analysis.category,
      foods,
      unknownFood: analysis.unknownFood || null,
      unknownItems: analysis.unknownItems || [],
      selectedAccompaniment: analysis.selectedAccompaniment,
      packaging: analysis.packaging,
      photoQuality: toLegacyPhotoQuality(analysis),
      photoQualityDetails: analysis.photoQualityDetails || analysis.photoQuality,
      confidence: analysis.confidence,
      qualityWarning: analysis.qualityWarning,
      hiddenSelections,
      totalFat: Number(calculation.totalFatGrams.toFixed(2)),
      totalProtein: Number(calculation.totalProteinGrams.toFixed(2)),
      totalCarbs: Number(calculation.totalCarbsGrams.toFixed(2)),
      totalCalories: Number(calculation.totalCalories.toFixed(2)),
      hiddenFatContribution: calculation.hiddenFatContribution,
      lipaseUnits: calculation.lipaseUnitsNeeded,
      lipaseUnitsNeeded: calculation.lipaseUnitsNeeded,
      lipaseDose: calculation.lipaseDose,
      prescribedUnitsPerGramFat: calculation.prescribedUnitsPerGramFat,
      capsuleStrength: calculation.lipaseUnitsPerUnit,
      lipaseUnitsPerUnit: calculation.lipaseUnitsPerUnit,
      lipaseUnitsDelivered: calculation.lipaseUnitsDelivered,
      unitLabel: calculation.unitLabel,
      treatment: calculation.treatment,
      capsulesExact: calculation.unitsExact,
      capsules: calculation.unitsRounded,
      unitsExact: calculation.unitsExact,
      unitsRounded: calculation.unitsRounded,
      calculationSchemaVersion: calculation.calculationSchemaVersion,
      calculationSteps: calculation.calculationSteps,
      safetyWarnings,
      calculationReliability,
      consistencyWarning: safetyWarnings.some((warning) => warning.type === "warning" || warning.type === "critical"),
      estimateText: `Estimativa baseada na refeição simulada "${analysis.mealName}", na dose prescrita e no medicamento cadastrado.${hiddenFatText}`,
      explanation,
      createdAt: new Date().toISOString()
    };
  }

  function runAnalysis(patient) {
    const analysis = simulateAnalysis();
    const result = calculateMeal(analysis, patient, analysis.hiddenFats);
    return { analysis, result };
  }

  function searchFoods(query) {
    return (nutritionDatabase?.search(query) || []).map((food) => ({
      name: food.name,
      fat: food.fatPer100g,
      protein: food.proteinPer100g,
      carbs: food.carbsPer100g,
      calories: food.caloriesPer100g
    }));
  }

  window.PancreAISimulator = {
    nutritionalDatabase: legacyNutritionDatabase,
    mealDatabase: mealDatabase?.meals || [],
    hiddenFatOptions: hiddenIngredientsService?.hiddenIngredients.map((item) => item.label) || [],
    simulateAnalysis,
    calculateMeal,
    runAnalysis,
    searchFoods
  };
})();
