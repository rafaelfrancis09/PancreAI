(function () {
  const ids = window.PancreAIUtils?.ids;
  const mealDatabase = window.PancreAIData?.mealDatabase;
  const nutritionDatabase = window.PancreAIData?.nutritionDatabase;
  const hiddenIngredientsService = window.PancreAIServices?.hiddenIngredientsService;

  const photoQualities = [
    { label: "Foto excelente", level: "excellent", confidenceMin: 92, confidenceMax: 98, message: "A foto permite uma estimativa visual muito favoravel." },
    { label: "Foto boa", level: "good", confidenceMin: 86, confidenceMax: 95, message: "A foto permite uma boa estimativa visual." },
    { label: "Pouca iluminação", level: "medium", confidenceMin: 75, confidenceMax: 88, message: "A iluminação pode reduzir a precisão da estimativa." },
    { label: "Imagem tremida", level: "medium", confidenceMin: 72, confidenceMax: 86, message: "A imagem tremida exige revisão manual cuidadosa." },
    { label: "Prato parcialmente cortado", level: "medium", confidenceMin: 70, confidenceMax: 84, message: "Parte do prato pode ter ficado fora do quadro." },
    { label: "Muito distante", level: "low", confidenceMin: 68, confidenceMax: 82, message: "A foto distante dificulta estimar porções." }
  ];

  const packagedFoods = new Set([
    "Barra de cereal",
    "Iogurte natural",
    "Iogurte grego",
    "Refrigerante cola",
    "Suco de caixinha",
    "Água de coco"
  ]);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomBoolean(probability) {
    return Math.random() < probability;
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function buildDetectedItem(item) {
    const grams = randomInt(item.minGrams, item.maxGrams);
    const nutrients = nutritionDatabase?.calculateFoodNutrients(item.foodId, grams);
    return {
      id: ids?.createId("item") || `item_${Date.now()}`,
      foodId: item.foodId,
      name: item.name,
      quantityGrams: grams,
      confidence: randomInt(82, 96),
      source: "mock-database",
      nutrients
    };
  }

  function maybeAddAccompaniment(meal, detectedItems) {
    if (!meal.accompaniments?.length || !randomBoolean(mealDatabase?.accompanimentChance || 0.2)) {
      return null;
    }
    const accompaniment = pickRandom(meal.accompaniments);
    const detected = buildDetectedItem(accompaniment);
    detectedItems.push(detected);
    return detected.name;
  }

  function detectPackaging(detectedItems) {
    const candidates = detectedItems.filter((item) => packagedFoods.has(item.name));
    if (!candidates.length || !randomBoolean(0.35)) {
      return null;
    }
    return pickRandom(candidates).name;
  }

  function buildLegacyFood(detectedItem) {
    const nutrients = detectedItem.nutrients;
    return {
      foodId: detectedItem.foodId,
      name: detectedItem.name,
      grams: detectedItem.quantityGrams,
      fat: Number(nutrients?.fat || 0),
      protein: Number(nutrients?.protein || 0),
      carbs: Number(nutrients?.carbs || 0),
      calories: Number(nutrients?.calories || 0),
      confidence: detectedItem.confidence
    };
  }

  function analyze() {
    const meals = mealDatabase?.getAll() || [];
    if (!meals.length) {
      throw new Error("Banco de refeições indisponível.");
    }

    // MockVision simula uma refeição inteira e coerente; ele não mistura alimentos aleatórios.
    const meal = pickRandom(meals);
    const photoQuality = pickRandom(photoQualities);
    const detectedItems = meal.items.map(buildDetectedItem);
    const selectedAccompaniment = maybeAddAccompaniment(meal, detectedItems);
    const packaging = detectPackaging(detectedItems);
    const unknownItems = randomBoolean(0.08)
      ? [{ id: ids?.createId("unknown") || `unknown_${Date.now()}`, label: "Alimento não identificado", confidence: randomInt(38, 58) }]
      : [];
    const confidence = randomInt(photoQuality.confidenceMin, photoQuality.confidenceMax);
    const warnings = [];

    if (photoQuality.level === "low" || photoQuality.level === "medium") {
      warnings.push("Revise a foto antes do cálculo.");
    }
    if (unknownItems.length) {
      warnings.push("Há alimento desconhecido para revisar.");
    }
    if (packaging) {
      warnings.push("Foi simulada a deteccao de uma embalagem.");
    }

    return {
      id: ids?.createId("mock_analysis") || `mock_analysis_${Date.now()}`,
      provider: "mock",
      providerLabel: "MockVision",
      isSimulated: true,
      mealName: meal.name,
      category: meal.category,
      confidence,
      photoQuality,
      detectedItems,
      warnings,
      unknownItems,
      unknownFood: unknownItems[0] || null,
      packagingDetected: Boolean(packaging),
      packaging,
      selectedAccompaniment,
      foods: detectedItems.map(buildLegacyFood),
      qualityWarning: photoQuality.level === "medium" || photoQuality.level === "low",
      hiddenFats: hiddenIngredientsService?.getDefaultSelections() || []
    };
  }

  window.PancreAIRecognition = {
    ...(window.PancreAIRecognition || {}),
    mockMealRecognitionProvider: {
      analyze
    }
  };

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    mockMealRecognitionProvider: {
      analyze
    }
  };
})();
