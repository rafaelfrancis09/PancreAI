(function () {
  function assertClose(label, received, expected) {
    if (Math.abs(Number(received) - Number(expected)) > 0.001) {
      throw new Error(`${label}: esperado ${expected}, recebido ${received}`);
    }
  }

  function makePatient(lipaseDose, weight, lipaseUnitsPerUnit, unitLabel = "cápsula") {
    return {
      lipaseDose,
      weight,
      capsuleStrength: lipaseUnitsPerUnit,
      treatment: {
        countryCode: "BR",
        medicationId: lipaseUnitsPerUnit === 25000 ? "creon_25000_br" : "creon_10000_br",
        medicationDisplayName: lipaseUnitsPerUnit === 25000 ? "Creon 25.000" : "Creon 10.000",
        medicationBrand: "Creon",
        medicationForm: "capsule",
        unitLabel,
        lipaseUnitsPerUnit,
        verificationLevel: "verified",
        sourceRefs: ["abbott-br-creon"]
      }
    };
  }

  function food(totalFatGrams) {
    return [{ name: "Teste", grams: 100, fat: totalFatGrams, protein: 0, carbs: 0, calories: 0 }];
  }

  function runTreatmentCalculationSmokeTests() {
    const doseCalculator = window.PancreAIServices?.doseCalculator;
    const safetyValidator = window.PancreAIServices?.safetyValidator;

    if (!doseCalculator || !safetyValidator) {
      throw new Error("Serviços de cálculo ainda não carregados.");
    }

    const test1 = doseCalculator.calculate({ foods: food(20), patient: makePatient(1000, 40, 10000), hiddenSelections: [] });
    assertClose("Teste 1 lipase", test1.lipaseUnitsNeeded, 20000);
    assertClose("Teste 1 unidades exatas", test1.unitsExact, 2);
    assertClose("Teste 1 unidades arredondadas", test1.unitsRounded, 2);
    assertClose("Teste 1 lipase entregue", test1.lipaseUnitsDelivered, 20000);

    const test2 = doseCalculator.calculate({ foods: food(21), patient: makePatient(1000, 40, 10000), hiddenSelections: [] });
    assertClose("Teste 2 lipase", test2.lipaseUnitsNeeded, 21000);
    assertClose("Teste 2 unidades exatas", test2.unitsExact, 2.1);
    assertClose("Teste 2 unidades arredondadas", test2.unitsRounded, 3);
    assertClose("Teste 2 lipase entregue", test2.lipaseUnitsDelivered, 30000);

    const test3 = doseCalculator.calculate({ foods: food(10), patient: makePatient(1000, 20, 25000), hiddenSelections: [] });
    assertClose("Teste 3 lipase", test3.lipaseUnitsNeeded, 10000);
    assertClose("Teste 3 unidades exatas", test3.unitsExact, 0.4);
    assertClose("Teste 3 unidades arredondadas", test3.unitsRounded, 1);
    assertClose("Teste 3 lipase entregue", test3.lipaseUnitsDelivered, 25000);

    const warningTest = safetyValidator.validate({
      foods: food(20),
      patient: makePatient(1000, 20, 10000),
      calculation: { ...test1, lipaseUnitsDelivered: 60000 },
      analysis: {},
      history: []
    });
    if (!warningTest.some((item) => item.type === "warning" || item.type === "critical")) {
      throw new Error("Teste de segurança não gerou aviso.");
    }

    return {
      ok: true,
      tests: 4
    };
  }

  window.runTreatmentCalculationSmokeTests = runTreatmentCalculationSmokeTests;
})();
