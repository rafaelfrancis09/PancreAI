(function () {
  const ids = window.PancreAIUtils?.ids;
  const nutritionDatabase = window.PancreAIData?.nutritionDatabase;
  const sourceMeals = window.PancreAIMealDatabase?.meals || [];

  function normalizeMealItem(item) {
    const food = nutritionDatabase?.getByName(item.nome);
    return {
      foodId: food?.id || ids?.slugify(item.nome) || item.nome,
      name: item.nome,
      minGrams: Number(item.min || 0),
      maxGrams: Number(item.max || item.min || 0)
    };
  }

  const meals = sourceMeals.map((meal, index) => ({
    id: ids?.slugify(meal.nome) || `meal_${index + 1}`,
    name: meal.nome,
    category: meal.categoria,
    items: (meal.alimentos || []).map(normalizeMealItem),
    accompaniments: (meal.acompanhamentos || []).map(normalizeMealItem)
  }));

  function getAll() {
    return meals;
  }

  function getById(id) {
    return meals.find((meal) => meal.id === id) || null;
  }

  window.PancreAIData = {
    ...(window.PancreAIData || {}),
    mealDatabase: {
      meals,
      getAll,
      getById,
      accompanimentChance: window.PancreAIMealDatabase?.accompanimentChance || 0.2
    }
  };
})();
