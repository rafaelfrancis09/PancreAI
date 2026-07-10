const backBtn = document.querySelector("#backBtn");
const printBtn = document.querySelector("#printBtn");
const reportContent = document.querySelector("#reportContent");
const core = window.PancreAICore;
const countryDatabase = window.PancreAICountryDatabase;
const i18n = window.PancreAII18n;
const pageQuery = new URLSearchParams(window.location.search);
const backTarget = pageQuery.get("from") === "home" ? "home.html" : "profile.html";

function translateReportText(value) {
  return window.PancreAIFoodI18n?.translateText?.(value) || i18n?.translatePhrase?.(value) || String(value ?? "");
}

function asNumber(value) {
  return Number(value || 0);
}

function average(items, selector) {
  const values = items.map(selector).map(asNumber).filter((value) => value > 0);
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pluralizeUnit(count, unitLabel) {
  const unit = String(unitLabel || "unidade").trim();
  const pluralMap = {
    "cápsula": "cápsulas",
    "comprimido": "comprimidos",
    "sachê": "sachês",
    "unidade": "unidades",
    "g": "g",
    "scoop": "scoops"
  };
  if (Number(count) === 1) return unit;
  return pluralMap[unit] || (unit.endsWith("s") ? unit : `${unit}s`);
}

function formatUnits(value, unitLabel) {
  const units = asNumber(value);
  if (!units) return "Sem registro";
  return `${units.toLocaleString("pt-BR")} ${pluralizeUnit(units, unitLabel)}`;
}

function formatDate(value) {
  if (!value) return "Sem registro";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem registro";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getDoseSummary(history) {
  const confirmed = history.length;
  const manualAdjustments = history.filter((meal) => asNumber(meal.capsules || meal.dose) !== asNumber(meal.suggestedCapsules || meal.unitsRounded));
  const latest = history[0] || null;
  const lastDose = latest ? asNumber(latest.capsules || latest.dose || latest.unitsRounded) : 0;
  const lastSuggested = latest ? asNumber(latest.suggestedCapsules || latest.unitsRounded) : 0;
  const totalChanges = history.reduce((sum, meal) => sum + ((meal.changes || []).length), 0);
  const totalReanalyses = history.reduce((sum, meal) => sum + asNumber(meal.reanalyses), 0);

  return {
    confirmed,
    manualAdjustments: manualAdjustments.length,
    avgSuggested: average(history, (meal) => meal.suggestedCapsules || meal.unitsRounded),
    avgUsed: average(history, (meal) => meal.capsules || meal.dose || meal.unitsRounded),
    lastDose,
    lastSuggested,
    lastDate: latest?.confirmedAt || latest?.createdAt,
    totalChanges,
    totalReanalyses
  };
}

function row(label, value) {
  return `<div class="report-row"><strong>${label}</strong><span>${value}</span></div>`;
}

function render() {
  const patient = core.getPatient();
  const treatment = core.getTreatment?.() || patient.treatment || {};
  const country = countryDatabase?.getCountryByCode?.(treatment.countryCode);
  const history = core.getHistory();
  const summary = getDoseSummary(history);
  const unitLabel = core.getUnit ? core.getUnit() : "gramas";
  const medicationUnit = treatment.unitLabel || "unidade";
  const warningsEnabled = core.isMedicalWarningsEnabled ? core.isMedicalWarningsEnabled() : false;

  reportContent.innerHTML = `
    <section class="report-section">
      <div class="report-section__title">
        <span class="report-section__icon" data-pa-icon="profile" aria-hidden="true"></span>
        <h2>Seus dados</h2>
      </div>
      ${row("Peso cadastrado", patient.weight ? `${core.formatDecimal(patient.weight, 1)} kg` : "Não informado")}
      ${row("Dose prescrita", `${Number(patient.lipaseDose).toLocaleString("pt-BR")} U/g de gordura`)}
      ${row("País/região", translateReportText(country?.namePt || treatment.countryCode || "Não informado"))}
      ${row("Medicamento", treatment.medicationDisplayName || "Não informado")}
      ${row("Potência", treatment.lipaseUnitsPerUnit ? `${Number(treatment.lipaseUnitsPerUnit).toLocaleString("pt-BR")} U de lipase por ${medicationUnit}` : "Não informada")}
      ${row("Unidade de medida", unitLabel === "porcoes" ? "Porções" : unitLabel.charAt(0).toUpperCase() + unitLabel.slice(1))}
    </section>

    <section class="report-section">
      <div class="report-section__title">
        <span class="report-section__icon" data-pa-icon="calculator" aria-hidden="true"></span>
        <h2>Configuração de cálculo</h2>
      </div>
      ${row("Base do cálculo", "Gordura estimada x dose prescrita")}
      ${row("Divisor", "Unidades de lipase por unidade do medicamento")}
      ${row("Arredondamento", "Conversão para unidades inteiras")}
      ${row("Avisos médicos", warningsEnabled ? "Ativados" : "Desativados")}
      ${row("Cálculos confirmados", summary.confirmed ? summary.confirmed.toLocaleString("pt-BR") : "Nenhum ainda")}
    </section>

    <section class="report-section">
      <div class="report-section__title">
        <span class="report-section__icon" data-pa-icon="lipase" aria-hidden="true"></span>
        <h2>Mudanças na dose</h2>
      </div>
      ${row("Ajustes manuais", summary.manualAdjustments ? `${summary.manualAdjustments} registro${summary.manualAdjustments === 1 ? "" : "s"}` : "Nenhum ajuste manual")}
      ${row("Dose sugerida média", summary.avgSuggested ? formatUnits(Math.round(summary.avgSuggested), medicationUnit) : "Sem cálculos confirmados")}
      ${row("Dose usada média", summary.avgUsed ? formatUnits(Math.round(summary.avgUsed), medicationUnit) : "Sem cálculos confirmados")}
      ${row("Última dose usada", summary.lastDose ? `${formatUnits(summary.lastDose, medicationUnit)}${summary.lastSuggested ? `, sugestão de ${formatUnits(summary.lastSuggested, medicationUnit)}` : ""}` : "Sem registro")}
      ${row("Último cálculo", formatDate(summary.lastDate))}
    </section>

    <section class="report-section report-section--soft">
      <div class="report-section__title">
        <span class="report-section__icon" data-pa-icon="info" aria-hidden="true"></span>
        <h2>Observações</h2>
      </div>
      ${row("Reanálises feitas", summary.totalReanalyses ? summary.totalReanalyses.toLocaleString("pt-BR") : "Nenhuma")}
      ${row("Correções manuais", summary.totalChanges ? `${summary.totalChanges} alteração${summary.totalChanges === 1 ? "" : "ões"}` : "Nenhuma")}
      <p class="report-note">Este relatório organiza informações cadastradas no app para facilitar a conversa com profissionais de saúde. Ele não substitui orientação médica.</p>
    </section>
  `;

  window.PancreAIIcons?.mount(reportContent);
}

backBtn.addEventListener("click", () => {
  window.location.href = backTarget;
});

printBtn.addEventListener("click", () => {
  window.print();
});

core.applyGlobalPreferences();
render();