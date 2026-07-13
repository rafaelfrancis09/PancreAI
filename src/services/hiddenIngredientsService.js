(function () {
  "use strict";

  const MAX_SUGGESTIONS = 4;
  const hiddenIngredients = [
    { id: "oleo", label: "Óleo", fatPerTablespoon: 10.8, aliases: ["oleo vegetal", "óleo vegetal", "oil"] },
    { id: "azeite", label: "Azeite", fatPerTablespoon: 10.8, aliases: ["azeite de oliva", "olive oil"] },
    { id: "manteiga", label: "Manteiga", fatPerTablespoon: 8.2, aliases: ["butter"] },
    { id: "margarina", label: "Margarina", fatPerTablespoon: 8.2, aliases: ["margarine"] },
    { id: "maionese", label: "Maionese", fatPerTablespoon: 7.9, aliases: ["mayonnaise", "mayo"] },
    { id: "creme_de_leite", label: "Creme de leite", fatPerTablespoon: 6.8, aliases: ["creme", "cream"] },
    { id: "molho", label: "Molho", fatPerTablespoon: 4.0, aliases: ["molhos", "sauce"] }
  ];

  const contextRules = [
    { id: "creme_de_leite", pattern: /\b(strogonoff|estrogonofe|molho branco|molho cremoso|cremos[oa]|sopa creme|ganache)\b/ },
    { id: "maionese", pattern: /\b(hamburguer|sanduiche|lanche|salpicao|salada de batata|hot dog|cachorro quente)\b/ },
    { id: "molho", pattern: /\b(hamburguer|sanduiche|lanche|pizza|churrasco|hot dog|cachorro quente)\b/ },
    { id: "manteiga", pattern: /\b(pure|risoto|farofa|pao|torrada|panqueca|waffle|ovo mexido|shimeji|milho|massa)\b/ },
    { id: "azeite", pattern: /\b(salada|folhas?|legumes?|vegetais?|caprese|bruschetta|mediterrane[oa])\b/ },
    { id: "oleo", pattern: /\b(arroz|feijao|feijoada|frit[oa]|fritos|fritas|fritura|refogad[oa]|farofa|empanad[oa]|milanesa|pastel|coxinha|ovo frito|carne de panela)\b/ }
  ];

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function normalizeId(value) {
    return normalizeText(value).replace(/\s+/g, "_");
  }

  function findById(value) {
    const id = normalizeId(value);
    return hiddenIngredients.find((item) => item.id === id) || null;
  }

  function findByAlias(value) {
    const normalized = normalizeText(value);
    if (!normalized) return null;

    const exact = hiddenIngredients.find((item) => {
      return normalizeText(item.label) === normalized
        || item.aliases.some((alias) => normalizeText(alias) === normalized);
    });
    if (exact) return exact;

    if (/\bcreme de leite\b/.test(normalized)) return findById("creme_de_leite");
    if (/\bazeite\b/.test(normalized)) return findById("azeite");
    if (/\bmaionese\b/.test(normalized)) return findById("maionese");
    if (/\bmargarina\b/.test(normalized)) return findById("margarina");
    if (/\bmanteiga\b/.test(normalized)) return findById("manteiga");
    if (/\bmolhos?\b/.test(normalized)) return findById("molho");
    if (/\boleo\b/.test(normalized)) return findById("oleo");
    return null;
  }

  function resolveIngredient(value) {
    if (value && typeof value === "object") {
      if (Object.prototype.hasOwnProperty.call(value, "id")) {
        return findById(value.id);
      }
      return findByAlias(value.label || value.name || value.ingredient);
    }
    return findById(value) || findByAlias(value);
  }

  function safeRelatedItem(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function toSelection(rawSuggestion) {
    const ingredient = resolveIngredient(rawSuggestion);
    if (!ingredient) return null;
    const relatedItem = rawSuggestion && typeof rawSuggestion === "object"
      ? safeRelatedItem(rawSuggestion.relatedItem)
      : "";
    return {
      id: ingredient.id,
      label: ingredient.label,
      selected: false,
      amount: 1,
      fatPerAmount: ingredient.fatPerTablespoon,
      ...(relatedItem ? { relatedItem } : {})
    };
  }

  function normalizeSuggestions(rawSuggestions) {
    const seen = new Set();
    const selections = [];
    for (const rawSuggestion of Array.isArray(rawSuggestions) ? rawSuggestions : []) {
      const selection = toSelection(rawSuggestion);
      if (!selection || seen.has(selection.id)) continue;
      seen.add(selection.id);
      selections.push(selection);
      if (selections.length >= MAX_SUGGESTIONS) break;
    }
    return selections;
  }

  function getFoodLabel(food) {
    return safeRelatedItem(food?.name || food?.label || food?.originalName);
  }

  function isAlreadyDetected(ingredientId, foods) {
    return (foods || []).some((food) => {
      const label = getFoodLabel(food);
      return resolveIngredient(label)?.id === ingredientId;
    });
  }

  function inferContextualSuggestions({ mealName, category, foods } = {}) {
    const detectedFoods = Array.isArray(foods) ? foods : [];
    const contexts = detectedFoods
      .map((food) => ({ text: normalizeText(getFoodLabel(food)), relatedItem: getFoodLabel(food) }))
      .filter((item) => item.text);
    const mealLabel = safeRelatedItem(mealName || category);
    const mealText = normalizeText([mealName, category].filter(Boolean).join(" "));
    if (mealText) contexts.push({ text: mealText, relatedItem: mealLabel });

    const rawSuggestions = [];
    for (const rule of contextRules) {
      if (isAlreadyDetected(rule.id, detectedFoods)) continue;
      const context = contexts.find((item) => rule.pattern.test(item.text));
      if (!context) continue;
      rawSuggestions.push({ id: rule.id, relatedItem: context.relatedItem });
    }
    return normalizeSuggestions(rawSuggestions);
  }

  function getSuggestedSelections(context = {}) {
    const explicitSuggestions = [
      context.possibleHiddenIngredients,
      context.hiddenIngredientSuggestions,
      context.hiddenFats
    ].find((value) => Array.isArray(value));

    if (explicitSuggestions !== undefined) {
      return normalizeSuggestions(explicitSuggestions);
    }
    return inferContextualSuggestions(context);
  }

  function getDefaultSelections() {
    return [];
  }

  function calculateHiddenFat(selections) {
    return (selections || []).reduce((sum, selection) => {
      if (!selection?.selected) return sum;
      const ingredient = resolveIngredient(selection);
      if (!ingredient) return sum;
      const rawAmount = Number(selection.amount);
      const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? Math.min(rawAmount, 4) : 1;
      return sum + ingredient.fatPerTablespoon * amount;
    }, 0);
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    hiddenIngredientsService: {
      hiddenIngredients,
      getDefaultSelections,
      getSuggestedSelections,
      calculateHiddenFat
    }
  };
})();
