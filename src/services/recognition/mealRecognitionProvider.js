(function () {
  /**
   * Contrato esperado para provedores de reconhecimento de refeições.
   *
   * Um provider recebe uma imagem, arquivo ou referencia visual e retorna uma
   * análise estruturada com refeição, alimentos, quantidades, confiança,
   * qualidade da foto, avisos e possiveis itens desconhecidos.
   *
   * Hoje o app usa MockMealRecognitionProvider. Futuramente este contrato pode
   * ser implementado por um AIVisionProvider real sem trocar o cálculo, a
   * segurança, a confirmação humana ou o histórico.
   */
  const providerContract = {
    expectedMethod: "analyze(imageReference)",
    currentProvider: "MockMealRecognitionProvider",
    futureProvider: "AIVisionProvider",
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
      "packagingDetected"
    ]
  };

  window.PancreAIRecognition = {
    ...(window.PancreAIRecognition || {}),
    mealRecognitionProvider: {
      providerContract
    }
  };
})();
