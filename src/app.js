(function () {
  window.PancreAIArchitecture = {
    productName: "PancreAI",
    currentRecognitionProvider: "RealMealRecognitionProvider + Gemini 2.5 Flash",
    currentRecognitionLabel: "Análise visual real pelo backend, com revisão obrigatória",
    centralMessage: "A IA reconhece a refeição. O usuário revisa. O banco local informa os nutrientes. O cálculo determinístico produz a estimativa.",
    modules: [
      { name: "Câmera e galeria reais", file: "src/services/realImageCaptureService.js", status: "funcional", label: "Captura, validação e compressão da foto" },
      { name: "Análise visual", file: "src/services/recognition/realMealRecognitionProvider.js", status: "funcional", label: "Foto enviada ao backend e analisada pelo Gemini 2.5 Flash" },
      { name: "Correspondência de alimentos", file: "src/services/recognition/foodMatcher.js", status: "funcional", label: "Sugestões ligadas ao catálogo local sem aceitar nutrientes da IA" },
      { name: "Banco nutricional", file: "src/data/nutritionDatabase.js", status: "funcional", label: "Fonte local dos valores por quantidade confirmada" },
      { name: "Revisão obrigatória", file: "home.js", status: "funcional", label: "Editar, remover, adicionar e confirmar" },
      { name: "Motor de cálculo", file: "src/services/doseCalculator.js", status: "funcional", label: "Gordura, lipase e unidades calculadas por regras locais" },
      { name: "Validação", file: "src/services/safetyValidator.js", status: "funcional", label: "Avisos antes do resultado" },
      { name: "Histórico local", file: "src/services/historyService.js", status: "funcional", label: "Refeições confirmadas salvas no navegador" },
      { name: "Modo infantil", file: "child-mode-guard.js", status: "visual", label: "Apresentação simplificada para uso supervisionado por responsável" }
    ],
    currentFlow: ["Foto real", "Backend seguro", "Gemini 2.5 Flash", "Revisão obrigatória", "Banco nutricional local", "Cálculo determinístico", "Validação", "Histórico local"]
  };
})();
