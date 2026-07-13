const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const serviceSource = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "services", "hiddenIngredientsService.js"),
  "utf8"
);

function createService() {
  const context = { window: { PancreAIServices: {} } };
  vm.runInNewContext(serviceSource, context, { filename: "hiddenIngredientsService.js" });
  return context.window.PancreAIServices.hiddenIngredientsService;
}

test("normaliza sugestões da IA, limita a quatro e nunca pré-seleciona", () => {
  const service = createService();
  const selections = service.getSuggestedSelections({
    possibleHiddenIngredients: [
      { id: "oleo", relatedItem: "Arroz branco", selected: true, fatPerAmount: 999 },
      { id: "molho", relatedItem: "Hambúrguer" },
      { id: "manteiga", relatedItem: "Farofa" },
      { id: "azeite", relatedItem: "Salada" },
      { id: "maionese", relatedItem: "Sanduíche" }
    ]
  });

  assert.deepEqual(Array.from(selections, (item) => item.id), ["oleo", "molho", "manteiga", "azeite"]);
  assert.equal(selections.every((item) => item.selected === false), true);
  assert.equal(selections.every((item) => item.amount === 1), true);
  assert.equal(selections[0].fatPerAmount, 10.8);
  assert.equal(selections[0].relatedItem, "Arroz branco");
});

test("aceita aliases antigos, remove duplicatas e ignora ingredientes fora da lista segura", () => {
  const service = createService();
  const selections = service.getSuggestedSelections({
    hiddenIngredientSuggestions: ["Óleo", "oleo vegetal", "Molhos", "Manteiga na farofa", "Outro"]
  });

  assert.deepEqual(Array.from(selections, (item) => item.id), ["oleo", "molho", "manteiga"]);
  assert.equal(selections.every((item) => item.selected === false), true);
});

test("usa fallback contextual somente quando a IA não envia o campo", () => {
  const service = createService();
  const salad = service.getSuggestedSelections({
    mealName: "Salada com frango",
    foods: [{ name: "Folhas e tomate" }, { name: "Frango grelhado" }]
  });
  const burger = service.getSuggestedSelections({
    mealName: "Hambúrguer artesanal",
    foods: [{ name: "Pão de hambúrguer" }, { name: "Carne bovina" }]
  });

  assert.deepEqual(Array.from(salad, (item) => item.id), ["azeite"]);
  assert.deepEqual(Array.from(burger, (item) => item.id), ["maionese", "molho", "manteiga"]);
  assert.deepEqual(Array.from(service.getSuggestedSelections({
    possibleHiddenIngredients: [],
    mealName: "Hambúrguer artesanal"
  })), []);
  assert.deepEqual(Array.from(service.getSuggestedSelections({ mealName: "Banana" })), []);
});

test("cálculo usa apenas gordura local por id ou alias e ignora valor externo", () => {
  const service = createService();
  const total = service.calculateHiddenFat([
    { id: "oleo", label: "Óleo", selected: true, amount: 1, fatPerAmount: 999 },
    { label: "Manteiga na farofa", selected: true, amount: 2, fatPerAmount: 999 },
    { id: "desconhecido", label: "Maionese", selected: true, amount: 1, fatPerAmount: 999 },
    { id: "azeite", selected: false, amount: 1 }
  ]);

  assert.equal(total, 27.2);
  assert.deepEqual(Array.from(service.getDefaultSelections()), []);
});
