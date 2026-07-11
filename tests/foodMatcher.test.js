const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const foods = [
  { id: "arroz_branco", name: "Arroz branco", fatPer100g: 1.1, proteinPer100g: 2.6, carbsPer100g: 28.2, caloriesPer100g: 130 },
  { id: "arroz_integral", name: "Arroz integral", fatPer100g: 1, proteinPer100g: 2.7, carbsPer100g: 25.8, caloriesPer100g: 124 },
  { id: "feijao_preto", name: "Feijão preto", fatPer100g: 0.5, proteinPer100g: 8.9, carbsPer100g: 23.7, caloriesPer100g: 132 }
];

const nutritionDatabase = {
  foods,
  calculateFoodNutrients(id, grams) {
    const food = foods.find((item) => item.id === id);
    if (!food) return null;
    const factor = grams / 100;
    return {
      foodId: food.id,
      name: food.name,
      grams,
      fat: Number((food.fatPer100g * factor).toFixed(2)),
      protein: Number((food.proteinPer100g * factor).toFixed(2)),
      carbs: Number((food.carbsPer100g * factor).toFixed(2)),
      calories: Number((food.caloriesPer100g * factor).toFixed(2))
    };
  }
};

const context = {
  window: {
    PancreAIData: { nutritionDatabase },
    PancreAIUtils: {
      ids: { createId: (prefix) => `${prefix}_test` },
      formatters: { roundTo: (value, decimals) => Number(value.toFixed(decimals)) }
    }
  },
  console
};
vm.createContext(context);
const source = fs.readFileSync(path.join(__dirname, "..", "src", "services", "recognition", "foodMatcher.js"), "utf8");
vm.runInContext(source, context);

const matcher = context.window.PancreAIRecognition.foodMatcher;
assert.equal(matcher.matchFood("white rice").food.name, "Arroz branco");
assert.equal(matcher.matchFood("FEIJÃO PRETO").food.id, "feijao_preto");
assert.equal(matcher.matchFood("rice").matched, false, "generic labels must stay unknown");

const mapped = matcher.mapRecognizedItem({
  name: "white rice",
  portionGrams: 120,
  confidence: 0.91,
  nutrients: { fat: 9999 }
});
assert.equal(mapped.matched, true);
assert.equal(mapped.detectedItem.quantityGrams, 120);
assert.equal(mapped.detectedItem.confidence, 91);
assert.equal(mapped.detectedItem.nutrients.fat, 1.32, "nutrients must come from the local database");

const unknown = matcher.mapRecognizedItem({ name: "mystery stew", portionGrams: 80, confidence: 0.4 });
assert.equal(unknown.matched, false);
assert.equal(unknown.unknown.label, "mystery stew");
assert.equal(unknown.unknown.quantityGrams, 80);

console.log("foodMatcher: all tests passed");
