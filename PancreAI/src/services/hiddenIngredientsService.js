(function () {
  const hiddenIngredients = [
    { label: "Oleo", fatPerTablespoon: 10.8 },
    { label: "Azeite", fatPerTablespoon: 10.8 },
    { label: "Manteiga", fatPerTablespoon: 8.2 },
    { label: "Margarina", fatPerTablespoon: 8.2 },
    { label: "Maionese", fatPerTablespoon: 7.9 },
    { label: "Creme de leite", fatPerTablespoon: 6.8 },
    { label: "Molhos", fatPerTablespoon: 4.0 },
    { label: "Outro", fatPerTablespoon: 5.5 }
  ];

  function getDefaultSelections() {
    return hiddenIngredients.map((item) => ({
      label: item.label,
      selected: false,
      amount: 1
    }));
  }

  function calculateHiddenFat(selections) {
    return (selections || []).reduce((sum, selection) => {
      if (!selection.selected) {
        return sum;
      }
      const ingredient = hiddenIngredients.find((item) => item.label === selection.label);
      const configuredFat = Number(selection.fatPerAmount);
      const fatPerAmount = Number.isFinite(configuredFat) && configuredFat >= 0
        ? configuredFat
        : ingredient?.fatPerTablespoon || 5.5;
      return sum + fatPerAmount * Number(selection.amount || 1);
    }, 0);
  }
  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    hiddenIngredientsService: {
      hiddenIngredients,
      getDefaultSelections,
      calculateHiddenFat
    }
  };
})();
