(function () {
  window.PancreAIArchitecture = {
    productName: "PancreAI",
    currentRecognitionProvider: "SimulatedCaptureService + MockVision",
    currentRecognitionLabel: "Casos visuais preparados",
    futureRecognitionProvider: "AIVisionProvider",
    centralMessage: "A entrada visual evolui. Revisão, dados, cálculo e segurança permanecem.",
    modules: [
      { name: "Captura simulada", file: "src/services/simulatedCaptureService.js", status: "simulado", label: "Fotos ligadas a casos visuais" },
      { name: "Banco nutricional", file: "src/data/nutritionDatabase.js", status: "funcional", label: "Busca e cálculo por quantidade" },
      { name: "Banco de refeições", file: "src/data/mealDatabase.js", status: "funcional", label: "Combinações estruturadas" },
      { name: "Revisão da refeição", file: "home.js", status: "funcional", label: "Editar, remover e adicionar" },
      { name: "Motor de cálculo", file: "src/services/doseCalculator.js", status: "funcional", label: "Gordura, lipase e unidades" },
      { name: "Validação", file: "src/services/safetyValidator.js", status: "funcional", label: "Avisos antes do resultado" },
      { name: "Histórico local", file: "src/services/historyService.js", status: "funcional", label: "Refeições salvas no navegador" }
    ],
    currentFlow: ["Foto preparada", "MockVision", "Revisão", "Banco nutricional", "Cálculo", "Validação", "Histórico"],
    futureFlow: ["Foto real", "AIVisionProvider", "Revisão", "Banco nutricional", "Cálculo", "Validação", "Histórico"]
  };
})();
