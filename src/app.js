(function () {
  window.PancreAIArchitecture = {
    productName: "PancreAI",
    currentRecognitionProvider: "RealMealRecognitionProvider + OpenAI Vision",
    currentRecognitionLabel: "Análise real por imagem, com revisão obrigatória",
    demoRecognitionProvider: "SimulatedCaptureService + MockVision",
    centralMessage: "A IA sugere. O usuário revisa. O banco local informa os nutrientes. O cálculo determinístico produz a estimativa.",
    modules: [
      { name: "Câmera e galeria reais", file: "src/services/realImageCaptureService.js", status: "funcional", label: "Captura, validação e compressão da foto" },
      { name: "Análise visual", file: "src/services/recognition/realMealRecognitionProvider.js", status: "funcional", label: "OpenAI Vision acessada por backend protegido" },
      { name: "Correspondência de alimentos", file: "src/services/recognition/foodMatcher.js", status: "funcional", label: "Nomes ligados ao catálogo local sem inventar nutrientes" },
      { name: "Banco nutricional", file: "src/data/nutritionDatabase.js", status: "funcional", label: "Fonte local dos valores por quantidade" },
      { name: "Revisão obrigatória", file: "home.js", status: "funcional", label: "Editar, remover, adicionar e confirmar" },
      { name: "Motor de cálculo", file: "src/services/doseCalculator.js", status: "funcional", label: "Gordura, lipase e unidades por regras determinísticas" },
      { name: "Validação", file: "src/services/safetyValidator.js", status: "funcional", label: "Avisos antes do resultado" },
      { name: "Histórico local", file: "src/services/historyService.js", status: "funcional", label: "Refeições confirmadas salvas no navegador" },
      { name: "Modo demonstrativo", file: "src/services/simulatedCaptureService.js", status: "opcional", label: "Casos preparados somente quando escolhidos explicitamente" }
    ],
    currentFlow: ["Foto real", "Backend protegido", "OpenAI Vision", "Revisão obrigatória", "Banco nutricional local", "Cálculo determinístico", "Validação", "Histórico"],
    demoFlow: ["Modo demonstrativo explícito", "Caso preparado", "Revisão obrigatória", "Banco nutricional local", "Cálculo determinístico", "Validação", "Histórico"]
  };
})();