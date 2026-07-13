(function () {
  /**
   * Contrato compartilhado pelo fluxo de reconhecimento de refeições.
   * A imagem é enviada ao backend seguro, o Gemini sugere alimentos e porções,
   * e a tela de revisão liga os itens ao banco nutricional local.
   */
  const providerContract = {
    expectedMethod: "analyze(imageReference, options)",
    currentProvider: "RealMealRecognitionProvider",
    currentModel: "gemini-2.5-flash",
    execution: "secure-backend",
    analysisMode: "real",
    outputFields: [
      "provider",
      "providerLabel",
      "isSimulated",
      "mealName",
      "category",
      "confidence",
      "photoQuality",
      "detectedItems",
      "warnings",
      "unknownItems",
      "possibleHiddenIngredients",
      "packagingDetected"
    ]
  };

  window.PancreAIRecognition = {
    ...(window.PancreAIRecognition || {}),
    mealRecognitionProvider: { providerContract }
  };
})();
