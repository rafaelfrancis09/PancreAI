(function () {
  "use strict";

  const nutritionDatabase = window.PancreAIData?.nutritionDatabase;
  const ids = window.PancreAIUtils?.ids;
  const formatters = window.PancreAIUtils?.formatters;

  // Aliases are intentionally conservative. Ambiguous labels such as "rice",
  // "beans" or "chicken" stay unknown until the user chooses a precise food.
  const aliasGroups = {
    "Arroz branco": ["white rice", "arroz cozido branco", "arroz branco cozido"],
    "Arroz integral": ["brown rice", "arroz integral cozido"],
    "Feijão carioca": ["pinto beans", "carioca beans", "feijao carioca cozido"],
    "Feijão preto": ["black beans", "feijao preto cozido"],
    "Feijão fradinho": ["black eyed peas", "black-eyed peas", "cowpeas"],
    "Peito de frango grelhado": ["grilled chicken breast", "chicken breast grilled", "file de frango grelhado"],
    "Frango desfiado": ["shredded chicken", "pulled chicken"],
    "Coxa de frango assada": ["roasted chicken thigh", "baked chicken thigh"],
    "Bife grelhado": ["grilled steak", "beef steak grilled"],
    "Patinho moído": ["ground beef", "lean ground beef", "carne moida magra"],
    "Carne de panela": ["beef stew", "stewed beef", "braised beef"],
    "Carne assada": ["roast beef", "roasted beef"],
    "Tilápia grelhada": ["grilled tilapia", "tilapia fillet grilled"],
    "Salmão grelhado": ["grilled salmon", "salmon fillet grilled"],
    "Ovo frito": ["fried egg"],
    "Ovo cozido": ["boiled egg", "hard boiled egg"],
    "Ovos mexidos": ["scrambled eggs"],
    "Batata frita": ["french fries", "fried potatoes", "fries"],
    "Mandioca cozida": ["boiled cassava", "cooked cassava", "boiled yuca", "cozido de mandioca"],
    "Macarrão ao sugo": ["spaghetti with tomato sauce", "pasta with tomato sauce", "spaghetti tomato sauce"],
    "Macarrão à bolonhesa": ["spaghetti bolognese", "pasta bolognese", "spaghetti with meat sauce"],
    "Macarrão alho e óleo": ["garlic and oil pasta", "spaghetti aglio e olio"],
    "Strogonoff de frango": ["chicken stroganoff", "chicken strogonoff", "estrogonofe de frango"],
    "Strogonoff de carne": ["beef stroganoff", "beef strogonoff", "estrogonofe de carne"],
    "Feijoada": ["brazilian black bean stew", "feijoada brasileira"],
    "Farofa temperada": ["toasted cassava flour", "seasoned cassava flour", "farofa"],
    "Salada verde": ["green salad", "leafy green salad", "mixed green salad"],
    "Salada de tomate": ["tomato salad"],
    "Brócolis cozido": ["cooked broccoli", "steamed broccoli", "boiled broccoli"],
    "Purê de batata": ["mashed potatoes", "mashed potato"],
    "Pão francês": ["french bread roll", "brazilian bread roll", "pao frances"],
    "Pão integral": ["whole wheat bread", "wholemeal bread"],
    "Pão de forma": ["sandwich bread", "sliced bread", "white sandwich bread"],
    "Café com leite": ["coffee with milk", "milk coffee", "cafe com leite"],
    "Café preto": ["black coffee", "coffee without milk"],
    "Suco de laranja": ["orange juice"],
    "Suco de uva": ["grape juice"],
    "Iogurte natural": ["plain yogurt", "natural yogurt", "plain yoghurt"],
    "Banana": ["banana slices", "sliced banana"],
    "Maçã": ["apple", "apple slices", "sliced apple"],
    "Mamão": ["papaya", "papaya pieces"],
    "Morango": ["strawberry", "strawberries"],
    "Aveia": ["oats", "oatmeal flakes", "rolled oats"],
    "Manteiga": ["butter"],
    "Queijo minas": ["minas cheese", "brazilian fresh cheese"],
    "Queijo coalho": ["coalho cheese", "brazilian grilling cheese"],
    "Presunto": ["ham", "sliced ham"],
    "Tomate": ["tomato", "tomato slices", "sliced tomato"],
    "Alface": ["lettuce", "lettuce leaves"],
    "Granola": ["granola cereal"],
    "Pasta de amendoim": ["peanut butter"],
    "Amendoim torrado": ["roasted peanuts"],
    "Castanha-do-pará": ["brazil nut", "brazil nuts"]
  };

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .replace(/&/g, " e ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function normalizeConfidence(value, fallback = null) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    const percent = numeric <= 1 ? numeric * 100 : numeric;
    return Math.max(0, Math.min(100, Math.round(percent)));
  }

  function normalizeGrams(value) {
    const numeric = Number(String(value ?? "").replace(",", "."));
    if (!Number.isFinite(numeric) || numeric <= 0 || numeric > 5000) return null;
    return formatters?.roundTo?.(numeric, 1) ?? Math.round(numeric * 10) / 10;
  }

  function getFoods() {
    return Array.isArray(nutritionDatabase?.foods) ? nutritionDatabase.foods : [];
  }

  function buildIndexes() {
    const exact = new Map();
    const aliases = new Map();

    getFoods().forEach((food) => {
      const normalizedName = normalizeText(food.name);
      if (normalizedName) exact.set(normalizedName, food);
    });

    Object.entries(aliasGroups).forEach(([canonicalName, labels]) => {
      const canonical = exact.get(normalizeText(canonicalName));
      if (!canonical) return;
      labels.forEach((label) => {
        const normalizedAlias = normalizeText(label);
        if (normalizedAlias && !exact.has(normalizedAlias)) aliases.set(normalizedAlias, canonical);
      });
    });

    return { exact, aliases };
  }

  function tokenize(value) {
    return new Set(normalizeText(value).split(" ").filter((token) => token.length > 1));
  }

  function tokenScore(left, right) {
    const a = tokenize(left);
    const b = tokenize(right);
    if (!a.size || !b.size) return 0;
    let intersection = 0;
    a.forEach((token) => {
      if (b.has(token)) intersection += 1;
    });
    return intersection / new Set([...a, ...b]).size;
  }

  function matchFood(label, options = {}) {
    const query = normalizeText(label);
    if (!query) return { matched: false, food: null, method: "empty", score: 0, query };

    const { exact, aliases } = buildIndexes();
    if (exact.has(query)) {
      return { matched: true, food: exact.get(query), method: "exact", score: 1, query };
    }
    if (aliases.has(query)) {
      return { matched: true, food: aliases.get(query), method: "alias", score: 1, query };
    }

    if (options.allowFuzzy === false) {
      return { matched: false, food: null, method: "none", score: 0, query };
    }

    // Fuzzy matching is only accepted when almost every significant token
    // agrees. This prevents a generic label from silently selecting a food.
    let best = null;
    getFoods().forEach((food) => {
      const score = tokenScore(query, food.name);
      if (!best || score > best.score) best = { food, score };
    });
    const threshold = Number(options.fuzzyThreshold || 0.86);
    if (best && best.score >= threshold) {
      return { matched: true, food: best.food, method: "tokens", score: best.score, query };
    }
    return { matched: false, food: null, method: "none", score: best?.score || 0, query };
  }

  function readItemName(item) {
    return String(
      item?.name ?? item?.foodName ?? item?.food_name ?? item?.label ?? item?.nome ?? ""
    ).replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function readItemGrams(item) {
    return normalizeGrams(
      item?.quantityGrams ?? item?.portionGrams ?? item?.portion_grams ??
      item?.estimatedGrams ?? item?.estimated_grams ?? item?.grams ?? item?.amountGrams
    );
  }

  function toUnknownItem(item, index, reason) {
    const label = readItemName(item) || "Alimento não identificado";
    return {
      id: item?.id || ids?.createId?.("unknown") || `unknown_${Date.now()}_${index}`,
      label,
      originalLabel: label,
      quantityGrams: readItemGrams(item),
      confidence: normalizeConfidence(item?.confidence ?? item?.score),
      reason,
      source: "ai-unmatched"
    };
  }

  function mapRecognizedItem(item, index = 0) {
    const originalName = readItemName(item);
    const match = matchFood(originalName);
    if (!match.matched) {
      return { matched: false, unknown: toUnknownItem(item, index, "not-in-local-database") };
    }

    const grams = readItemGrams(item);
    const nutrients = grams == null
      ? null
      : nutritionDatabase?.calculateFoodNutrients?.(match.food.id, grams) || null;
    const missingNutrition = !nutrients;
    const detectedItem = {
      id: item?.id || ids?.createId?.("ai_item") || `ai_item_${Date.now()}_${index}`,
      foodId: match.food.id,
      name: match.food.name,
      originalName,
      quantityGrams: grams,
      confidence: normalizeConfidence(item?.confidence ?? item?.score),
      source: "ai-local-database",
      matchMethod: match.method,
      matchScore: Number(match.score.toFixed(3)),
      missingQuantity: grams == null,
      missingNutrition,
      nutrients
    };

    return { matched: true, detectedItem };
  }

  function toLegacyFood(item) {
    return {
      foodId: item.foodId,
      name: item.name,
      originalName: item.originalName,
      grams: item.quantityGrams,
      fat: item.nutrients?.fat ?? null,
      protein: item.nutrients?.protein ?? null,
      carbs: item.nutrients?.carbs ?? null,
      calories: item.nutrients?.calories ?? null,
      confidence: item.confidence,
      source: item.source,
      missingNutrition: item.missingNutrition,
      missingQuantity: item.missingQuantity
    };
  }

  function normalizeDetectedItems(items) {
    const detectedItems = [];
    const unknownItems = [];
    (Array.isArray(items) ? items : []).slice(0, 12).forEach((item, index) => {
      const mapped = mapRecognizedItem(item, index);
      if (mapped.matched) detectedItems.push(mapped.detectedItem);
      else unknownItems.push(mapped.unknown);
    });
    return {
      detectedItems,
      unknownItems,
      foods: detectedItems.map(toLegacyFood)
    };
  }

  window.PancreAIRecognition = {
    ...(window.PancreAIRecognition || {}),
    foodMatcher: {
      normalizeText,
      normalizeConfidence,
      normalizeGrams,
      matchFood,
      mapRecognizedItem,
      normalizeDetectedItems,
      toLegacyFood,
      aliasGroups
    }
  };
})();
