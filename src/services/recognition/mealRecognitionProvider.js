(function () {
  /**
   * Contrato compartilhado pelos provedores de reconhecimento de refeições.
   *
   * O fluxo real usa uma rede Food-101 executada em um worker do navegador.
   * O provedor simulado permanece separado e só é usado quando a demonstração
   * é escolhida explicitamente. Ambos entregam o mesmo formato à tela de revisão.
   */
  const providerContract = {
    expectedMethod: "analyze(imageReference, options)",
    currentProvider: "RealMealRecognitionProvider",
    currentModel: "onnx-community/swin-finetuned-food101-ONNX",
    execution: "browser-worker",
    demoProvider: "MockMealRecognitionProvider",
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
    mealRecognitionProvider: { providerContract }
  };
})();
