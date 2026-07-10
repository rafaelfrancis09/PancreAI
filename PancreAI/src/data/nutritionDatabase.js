(function () {
  const ids = window.PancreAIUtils?.ids;
  const formatters = window.PancreAIUtils?.formatters;
  const sourceCatalog = window.PancreAIMealDatabase?.foodCatalog || [];

  function normalizeFood(item) {
    const id = ids?.slugify(item.id || item.nome) || String(item.nome || "").toLowerCase();
    return {
      id,
      name: item.nome,
      fatPer100g: Number(item.fat || 0),
      proteinPer100g: Number(item.protein || 0),
      carbsPer100g: Number(item.carbs || 0),
      caloriesPer100g: Number(item.calories || 0),
      fiberPer100g: Number(item.fiber || 0),
      sodiumPer100g: Number(item.sodium || 0)
    };
  }

  const foods = sourceCatalog.map(normalizeFood);
  const byId = new Map(foods.map((food) => [food.id, food]));
  const byName = new Map(foods.map((food) => [food.name, food]));

  function getById(id) {
    return byId.get(id) || null;
  }

  function getByName(name) {
    return byName.get(name) || null;
  }

  function search(query) {
    const text = String(query || "").trim().toLowerCase();
    if (!text) {
      return foods.slice(0, 12);
    }
    return foods.filter((food) => food.name.toLowerCase().includes(text));
  }

  function calculateFoodNutrients(foodRef, grams) {
    const food = typeof foodRef === "string"
      ? getById(foodRef) || getByName(foodRef)
      : foodRef;
    if (!food) {
      return null;
    }

    const amount = Number(grams || 0);
    const factor = amount / 100;
    return {
      foodId: food.id,
      name: food.name,
      grams: amount,
      fat: formatters?.roundTo(food.fatPer100g * factor, 2) ?? Number((food.fatPer100g * factor).toFixed(2)),
      protein: formatters?.roundTo(food.proteinPer100g * factor, 2) ?? Number((food.proteinPer100g * factor).toFixed(2)),
      carbs: formatters?.roundTo(food.carbsPer100g * factor, 2) ?? Number((food.carbsPer100g * factor).toFixed(2)),
      calories: formatters?.roundTo(food.caloriesPer100g * factor, 2) ?? Number((food.caloriesPer100g * factor).toFixed(2))
    };
  }

  function asLegacyNutrition() {
    return foods.map((food) => ({
      name: food.name,
      fat: food.fatPer100g,
      protein: food.proteinPer100g,
      carbs: food.carbsPer100g,
      calories: food.caloriesPer100g
    }));
  }

  window.PancreAIData = {
    ...(window.PancreAIData || {}),
    nutritionDatabase: {
      foods,
      getById,
      getByName,
      search,
      calculateFoodNutrients,
      asLegacyNutrition
    }
  };
})();
