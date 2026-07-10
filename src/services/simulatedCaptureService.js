(function () {
  const FALLBACK_MEAL_ID = "arroz_feijao_batata_tomate_alface";

  const simulatedMeals = [
    {
      id: FALLBACK_MEAL_ID,
      filename: "arrozfeijaobatatatomatealface.jpg",
      title: "Arroz, feijão, carne e batata",
      subtitle: "Com tomate e alface",
      description: "Arroz, feijão, carne bovina, batata frita, tomate e alface.",
      category: "Prato brasileiro",
      confidenceRange: [0.84, 0.93],
      quality: "boa",
      foods: [
        { name: "Arroz branco", category: "carboidrato", portionLabel: "média", quantityGrams: 120, fatGrams: 0.4, proteinGrams: 3.1, carbsGrams: 33.8, calories: 156 },
        { name: "Feijão", category: "leguminosa", portionLabel: "média", quantityGrams: 100, fatGrams: 1.2, proteinGrams: 5.0, carbsGrams: 14.0, calories: 82 },
        { name: "Carne bovina", category: "proteína", portionLabel: "média", quantityGrams: 100, fatGrams: 10, proteinGrams: 26.0, carbsGrams: 0, calories: 210 },
        { name: "Batata frita", category: "gordura/carboidrato", portionLabel: "média", quantityGrams: 80, fatGrams: 12, proteinGrams: 2.8, carbsGrams: 31.0, calories: 250 },
        { name: "Tomate", category: "vegetal", portionLabel: "pequena", quantityGrams: 40, fatGrams: 0.1, proteinGrams: 0.4, carbsGrams: 1.6, calories: 8 },
        { name: "Alface", category: "vegetal", portionLabel: "pequena", quantityGrams: 25, fatGrams: 0.1, proteinGrams: 0.3, carbsGrams: 0.7, calories: 4 }
      ],
      hiddenIngredientSuggestions: ["Óleo", "Molho", "Azeite"],
      specialResult: null
    },
    {
      id: "estrogonofe_frango_arroz_batata_palha",
      filename: "estrogonofe.jpg",
      title: "Estrogonofe de frango",
      subtitle: "Com arroz e batata palha",
      description: "Estrogonofe de frango com arroz e batata palha.",
      category: "Prato brasileiro",
      confidenceRange: [0.82, 0.91],
      quality: "boa",
      foods: [
        { name: "Arroz branco", category: "carboidrato", portionLabel: "média", quantityGrams: 120, fatGrams: 0.4, proteinGrams: 3.1, carbsGrams: 33.8, calories: 156 },
        { name: "Estrogonofe de frango", category: "proteína/molho", portionLabel: "média", quantityGrams: 180, fatGrams: 16, proteinGrams: 27.0, carbsGrams: 14.4, calories: 306 },
        { name: "Batata palha", category: "gordura/carboidrato", portionLabel: "média", quantityGrams: 30, fatGrams: 11, proteinGrams: 1.8, carbsGrams: 15.6, calories: 171 }
      ],
      hiddenIngredientSuggestions: ["Creme de leite", "Manteiga", "Óleo"],
      specialResult: null
    },
    {
      id: "salada_de_frutas",
      filename: "saladadefrutas.jpg",
      title: "Salada de frutas",
      subtitle: "Manga, morango, kiwi e frutas vermelhas",
      description: "Salada de frutas com manga, morango, kiwi, jabuticaba e raspberry.",
      category: "Frutas",
      confidenceRange: [0.88, 0.96],
      quality: "boa",
      foods: [
        { name: "Manga", category: "fruta", portionLabel: "média", quantityGrams: 80, fatGrams: 0.3, proteinGrams: 0.6, carbsGrams: 12.0, calories: 48 },
        { name: "Morango", category: "fruta", portionLabel: "média", quantityGrams: 70, fatGrams: 0.2, proteinGrams: 0.5, carbsGrams: 5.4, calories: 22 },
        { name: "Kiwi", category: "fruta", portionLabel: "média", quantityGrams: 60, fatGrams: 0.3, proteinGrams: 0.7, carbsGrams: 8.8, calories: 37 },
        { name: "Jabuticaba", category: "fruta", portionLabel: "pequena", quantityGrams: 40, fatGrams: 0.1, proteinGrams: 0.2, carbsGrams: 6.4, calories: 23 },
        { name: "Raspberry", category: "fruta", portionLabel: "pequena", quantityGrams: 35, fatGrams: 0.2, proteinGrams: 0.4, carbsGrams: 4.2, calories: 18 }
      ],
      hiddenIngredientSuggestions: ["Não tinha"],
      specialResult: {
        type: "no_enzyme_needed",
        requiresEnzymes: false,
        title: "Não precisa de enzimas",
        primaryText: "Não precisa de enzimas",
        supportingText: "Essa refeição é composta por frutas e não precisa de enzimas.",
        estimatedEnzymeUnits: 0,
        capsules: 0
      }
    },
    {
      id: "feijoada_arroz_farofa_couve_laranja",
      filename: "feijoada.jpg",
      title: "Feijoada",
      subtitle: "Com arroz, farofa, couve e laranja",
      description: "Feijoada com arroz, farofa, couve e laranja.",
      category: "Prato brasileiro",
      confidenceRange: [0.80, 0.90],
      quality: "boa",
      foods: [
        { name: "Feijoada", category: "prato principal", portionLabel: "média", quantityGrams: 220, fatGrams: 22, proteinGrams: 28.6, carbsGrams: 39.6, calories: 484 },
        { name: "Arroz branco", category: "carboidrato", portionLabel: "média", quantityGrams: 120, fatGrams: 0.4, proteinGrams: 3.1, carbsGrams: 33.8, calories: 156 },
        { name: "Farofa", category: "acompanhamento", portionLabel: "média", quantityGrams: 45, fatGrams: 7, proteinGrams: 1.5, carbsGrams: 19.9, calories: 131 },
        { name: "Couve", category: "vegetal", portionLabel: "pequena", quantityGrams: 50, fatGrams: 1.5, proteinGrams: 1.3, carbsGrams: 3.0, calories: 33 },
        { name: "Laranja", category: "fruta", portionLabel: "pequena", quantityGrams: 60, fatGrams: 0.1, proteinGrams: 0.6, carbsGrams: 7.1, calories: 28 }
      ],
      hiddenIngredientSuggestions: ["Óleo", "Gordura da carne", "Manteiga na farofa"],
      specialResult: null
    },
    {
      id: "hamburger_com_ovo_bacon_queijos",
      filename: "hamburgercomovo.jpg",
      title: "Hambúrguer grande",
      subtitle: "Com ovo, bacon e dois queijos",
      description: "Hambúrguer grande com pão, carne, queijo cheddar, bacon, tomate, alface, ovo e queijo mussarela.",
      category: "Fast food",
      confidenceRange: [0.83, 0.92],
      quality: "boa",
      foods: [
        { name: "Pão de hambúrguer", category: "carboidrato", portionLabel: "1 unidade", quantityGrams: 70, fatGrams: 3, proteinGrams: 5.6, carbsGrams: 32.9, calories: 189 },
        { name: "Carne bovina", category: "proteína", portionLabel: "grande", quantityGrams: 130, fatGrams: 22, proteinGrams: 31.2, carbsGrams: 0, calories: 323 },
        { name: "Queijo cheddar", category: "laticínio", portionLabel: "média", quantityGrams: 25, fatGrams: 8, proteinGrams: 6.0, carbsGrams: 0.3, calories: 101 },
        { name: "Bacon", category: "proteína/gordura", portionLabel: "média", quantityGrams: 25, fatGrams: 10, proteinGrams: 9.3, carbsGrams: 0.4, calories: 125 },
        { name: "Ovo", category: "proteína", portionLabel: "1 unidade", quantityGrams: 50, fatGrams: 5, proteinGrams: 6.3, carbsGrams: 0.6, calories: 72 },
        { name: "Queijo mussarela", category: "laticínio", portionLabel: "média", quantityGrams: 25, fatGrams: 6, proteinGrams: 6.0, carbsGrams: 0.6, calories: 80 },
        { name: "Tomate", category: "vegetal", portionLabel: "pequena", quantityGrams: 30, fatGrams: 0.1, proteinGrams: 0.3, carbsGrams: 1.2, calories: 5 },
        { name: "Alface", category: "vegetal", portionLabel: "pequena", quantityGrams: 20, fatGrams: 0.1, proteinGrams: 0.3, carbsGrams: 0.6, calories: 3 }
      ],
      hiddenIngredientSuggestions: ["Maionese", "Molho", "Manteiga no pão"],
      specialResult: null
    },
    {
      id: "pizza_mussarela_presunto",
      filename: "pizzadepresunto.jpg",
      title: "Pizza de mussarela com presunto",
      subtitle: "Porção de 2 fatias",
      description: "Pizza de mussarela com presunto.",
      category: "Pizza",
      confidenceRange: [0.86, 0.94],
      quality: "boa",
      foods: [
        {
          name: "Pizza de mussarela com presunto",
          category: "massa/laticínio",
          portionLabel: "2 fatias",
          quantityGrams: 180,
          fatGrams: 22,
          proteinGrams: 25.2,
          carbsGrams: 61.2,
          calories: 504,
          portionOptions: [
            { label: "1 fatia", quantityGrams: 90, fatGrams: 11 },
            { label: "2 fatias", quantityGrams: 180, fatGrams: 22 },
            { label: "3 fatias", quantityGrams: 270, fatGrams: 33 },
            { label: "4 fatias", quantityGrams: 360, fatGrams: 44 }
          ]
        }
      ],
      hiddenIngredientSuggestions: ["Azeite", "Queijo extra"],
      specialResult: null
    },
    {
      id: "petit_gateau_sorvete",
      filename: "petitgeteau.jpg",
      title: "Petit gâteau com sorvete",
      subtitle: "Com uma bola de sorvete de creme",
      description: "Petit gâteau com uma bola de sorvete de creme.",
      category: "Sobremesa",
      confidenceRange: [0.84, 0.92],
      quality: "boa",
      foods: [
        { name: "Petit gâteau", category: "sobremesa", portionLabel: "1 unidade", quantityGrams: 90, fatGrams: 18, proteinGrams: 5.4, carbsGrams: 45.0, calories: 360 },
        { name: "Sorvete de creme", category: "sobremesa/laticínio", portionLabel: "1 bola", quantityGrams: 60, fatGrams: 7, proteinGrams: 2.1, carbsGrams: 14.4, calories: 126 }
      ],
      hiddenIngredientSuggestions: ["Calda", "Manteiga", "Chocolate"],
      specialResult: null
    },
    {
      id: "spaghetti_molho_tomate",
      filename: "macarrao.jpg",
      title: "Spaghetti com molho de tomate",
      subtitle: "Massa ao molho de tomate",
      description: "Spaghetti com molho de tomate.",
      category: "Massa",
      confidenceRange: [0.83, 0.91],
      quality: "boa",
      foods: [
        { name: "Spaghetti", category: "massa", portionLabel: "média", quantityGrams: 180, fatGrams: 2, proteinGrams: 10.4, carbsGrams: 55.8, calories: 284 },
        { name: "Molho de tomate", category: "molho", portionLabel: "média", quantityGrams: 90, fatGrams: 2, proteinGrams: 1.3, carbsGrams: 6.3, calories: 55 }
      ],
      hiddenIngredientSuggestions: ["Azeite", "Queijo ralado", "Manteiga"],
      specialResult: null
    },
    {
      id: "churrasco_carne_linguica_farofa",
      filename: "churrasco.jpg",
      title: "Churrasco",
      subtitle: "Carne bovina, linguiça e farofa",
      description: "Carne bovina, linguiça e farofa.",
      category: "Prato brasileiro",
      confidenceRange: [0.82, 0.91],
      quality: "boa",
      foods: [
        { name: "Carne bovina", category: "proteína", portionLabel: "média", quantityGrams: 140, fatGrams: 22, proteinGrams: 35.0, carbsGrams: 0, calories: 338 },
        { name: "Linguiça", category: "proteína/gordura", portionLabel: "média", quantityGrams: 80, fatGrams: 20, proteinGrams: 12.8, carbsGrams: 1.6, calories: 238 },
        { name: "Farofa", category: "acompanhamento", portionLabel: "média", quantityGrams: 45, fatGrams: 7, proteinGrams: 1.5, carbsGrams: 19.9, calories: 131 }
      ],
      hiddenIngredientSuggestions: ["Óleo", "Manteiga na farofa", "Molho"],
      specialResult: null
    }
  ].map((meal) => ({
    ...meal,
    imageUrl: `assets/${meal.filename}`
  }));

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  }

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function findInternalMeal(id) {
    return simulatedMeals.find((meal) => meal.id === id)
      || simulatedMeals.find((meal) => meal.id === FALLBACK_MEAL_ID);
  }

  function getSimulatedMealImages() {
    return clone(simulatedMeals);
  }

  function getRandomSimulatedMeal() {
    return clone(simulatedMeals[randomInteger(0, simulatedMeals.length - 1)]);
  }

  function getSimulatedMealById(id) {
    return clone(findInternalMeal(id));
  }

  function getHiddenFatPerAmount(label) {
    const normalized = String(label || "").toLocaleLowerCase("pt-BR");
    if (normalized === "não tinha") return 0;
    if (normalized.includes("gordura da carne")) return 10;
    if (normalized.includes("queijo extra")) return 7;
    if (normalized.includes("maionese")) return 7;
    if (normalized.includes("creme de leite")) return 7;
    if (normalized.includes("calda") || normalized.includes("chocolate")) return 4;
    return 5;
  }

  function buildLegacyFood(food) {
    const grams = Number(food.quantityGrams || 0);
    const protein = Number(food.proteinGrams || 0);
    const carbs = Number(food.carbsGrams || 0);
    const calories = Number(food.calories || 0);
    const per100Factor = grams > 0 ? 100 / grams : 0;

    return {
      name: food.name,
      grams,
      quantityGrams: grams,
      fat: Number(food.fatGrams || 0),
      fatGrams: Number(food.fatGrams || 0),
      protein,
      carbs,
      calories,
      category: food.category,
      portionLabel: food.portionLabel,
      ...(food.portionOptions ? { portionOptions: clone(food.portionOptions) } : {}),
      nutritionPer100g: {
        fat: round(Number(food.fatGrams || 0) * per100Factor),
        protein: round(protein * per100Factor),
        carbs: round(carbs * per100Factor),
        calories: round(calories * per100Factor)
      }
    };
  }

  function createDetectedItem(food, analysisConfidence, index) {
    const itemConfidence = Math.max(1, Math.min(99, analysisConfidence - (index % 3)));
    return {
      id: `sim_item_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`,
      foodId: String(food.name || "alimento").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
      name: food.name,
      quantityGrams: food.grams,
      confidence: itemConfidence,
      source: "simulated-capture",
      category: food.category,
      portionLabel: food.portionLabel,
      ...(food.portionOptions ? { portionOptions: clone(food.portionOptions) } : {}),
      nutrients: {
        name: food.name,
        grams: food.grams,
        fat: food.fat,
        protein: food.protein,
        carbs: food.carbs,
        calories: food.calories
      }
    };
  }

  function buildMockAnalysisForMeal(mealId) {
    const meal = findInternalMeal(mealId);
    const confidenceMin = Math.round(Number(meal.confidenceRange[0]) * 100);
    const confidenceMax = Math.round(Number(meal.confidenceRange[1]) * 100);
    const confidence = randomInteger(confidenceMin, confidenceMax);
    const foods = meal.foods.map(buildLegacyFood);
    const photoQuality = {
      label: "Foto boa",
      level: "good",
      value: meal.quality,
      confidenceMin,
      confidenceMax,
      message: "A foto permite uma boa estimativa visual."
    };

    const analysis = {
      id: `mock_analysis_${meal.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      provider: "mock",
      providerLabel: "MockVision",
      isSimulated: true,
      mealId: meal.id,
      filename: meal.filename,
      imageUrl: meal.imageUrl,
      mealName: meal.title,
      mealSubtitle: meal.subtitle,
      description: meal.description,
      category: meal.category,
      confidence,
      confidenceRange: clone(meal.confidenceRange),
      photoQuality,
      detectedItems: foods.map((food, index) => createDetectedItem(food, confidence, index)),
      warnings: [],
      unknownItems: [],
      unknownFood: null,
      packagingDetected: false,
      packaging: null,
      selectedAccompaniment: null,
      foods,
      qualityWarning: false,
      hiddenIngredientSuggestions: clone(meal.hiddenIngredientSuggestions),
      hiddenFats: meal.hiddenIngredientSuggestions.map((label) => ({
        label,
        selected: false,
        amount: 1,
        fatPerAmount: getHiddenFatPerAmount(label)
      })),
      specialResult: clone(meal.specialResult)
    };

    return clone(analysis);
  }

  function startSimulatedCameraCapture() {
    return {
      ...getRandomSimulatedMeal(),
      captureSource: "camera_simulated"
    };
  }

  function startSimulatedGallerySelection(id) {
    return {
      ...getSimulatedMealById(id),
      captureSource: "gallery_simulated"
    };
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    simulatedCaptureService: {
      getSimulatedMealImages,
      getRandomSimulatedMeal,
      getSimulatedMealById,
      buildMockAnalysisForMeal,
      startSimulatedCameraCapture,
      startSimulatedGallerySelection
    }
  };
})();
