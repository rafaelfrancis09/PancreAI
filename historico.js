const emptyState = document.querySelector("#emptyState");
const contentState = document.querySelector("#contentState");
const historyList = document.querySelector("#historyList");
const detailScreen = document.querySelector("#detailScreen");
const historicoScreen = document.querySelector(".screen--historico");
const detailContent = document.querySelector("#detailContent");
const analyzeFirstBtn = document.querySelector("#analyzeFirstBtn");
const backFromDetailBtn = document.querySelector("#backFromDetailBtn");
const homeNav = document.querySelector("#homeNav");
const profileNav = document.querySelector("#profileNav");
const core = window.PancreAICore;
const i18n = window.PancreAII18n;

function translate(key, params) {
  return i18n?.t?.(key, params) || key;
}

function translateFoodLabel(value) {
  return window.PancreAIFoodI18n?.translateText?.(value) || i18n?.translatePhrase?.(value) || String(value ?? "");
}

if (!core.isSetupComplete()) {
  localStorage.setItem("pancreaiReturnTo", "historico.html");
  window.location.replace("configuracao.html");
}

function isChildModeActive() {
  return Boolean(core?.isChildMode?.());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pluralize(value, singular, plural) {
  return `${value} ${Number(value) === 1 ? singular : plural}`;
}

function isTodayMeal(meal) {
  const today = new Date().toLocaleDateString("pt-BR");
  if (meal.confirmedAt || meal.createdAt) {
    const date = new Date(meal.confirmedAt || meal.createdAt);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString("pt-BR") === today;
  }
  return meal.date === today;
}

function getHistoryItems() {
  const history = core.getHistory();
  return isChildModeActive() ? history.filter(isTodayMeal) : history;
}

function applyHistoryChildModeState() {
  const childMode = isChildModeActive();
  const title = document.querySelector(".historico-header h1");
  const subtitle = document.querySelector(".historico-header p");
  const activeLabel = document.querySelector(".bottom-nav__item--active small");
  const profileLabel = document.querySelector("#profileNav small");
  const homeLabel = document.querySelector("#homeNav small");
  const emptyTitle = document.querySelector("#emptyState h2");
  const emptyText = document.querySelector("#emptyState p");

  document.body.classList.toggle("history-child-mode", childMode);
  if (title) title.textContent = childMode ? "Refeições de hoje" : "Histórico";
  if (subtitle) subtitle.textContent = childMode ? "Um resumo simples do dia" : "Suas refeições anteriores";
  if (activeLabel) activeLabel.textContent = childMode ? "Refeições" : translate("nav.history");
  if (homeLabel) homeLabel.textContent = translate("nav.home");
  if (profileLabel) profileLabel.textContent = childMode ? "Responsável" : translate("nav.profile");
  if (emptyTitle) emptyTitle.textContent = childMode ? "Nenhuma refeição hoje" : "Nenhuma refeição analisada";
  if (emptyText) emptyText.textContent = childMode
    ? "Quando você salvar uma refeição, ela aparecerá aqui."
    : "Quando você analisar sua primeira refeição, ela aparecerá aqui.";
}

function renderHistory() {
  applyHistoryChildModeState();
  const history = getHistoryItems();
  const childMode = isChildModeActive();

  if (!history.length) {
    emptyState.hidden = false;
    contentState.hidden = true;
    historyList.innerHTML = "";
    return;
  }

  emptyState.hidden = true;
  contentState.hidden = false;
  const summaryLabel = childMode ? "refeições hoje" : "refeições registradas";
  historyList.innerHTML = `
    <section class="history-overview" aria-label="Resumo do histórico">
      <div class="history-overview__count">
        <strong>${history.length}</strong>
        <span>${summaryLabel}</span>
      </div>
      <p>Toque em uma refeição para ver os detalhes.</p>
    </section>
    <div class="history-meals">
      ${history.map((meal, index) => {
        const units = Number(meal.capsules || meal.dose || 0);
        return `
          <button class="meal-item${childMode ? " meal-item--child" : ""}" type="button" data-index="${index}">
            <img class="meal-item__image" src="${escapeHtml(meal.image || "assets/prato.png")}" alt="" />
            <span class="meal-item__info">
              <strong class="meal-item__title">${escapeHtml(translateFoodLabel(meal.name))}</strong>
              <span class="meal-item__date">${childMode ? "Revisado" : `${escapeHtml(meal.date)} · ${escapeHtml(meal.time)}`}</span>
              <span class="meal-item__metrics">
                <span>${core.formatDecimal(meal.totalFat, 1)} g de gordura</span>
                <span>${pluralize(units, "unidade", "unidades")}</span>
              </span>
            </span>
            <span class="meal-item__arrow" aria-hidden="true">
              <svg class="app-icon" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>
            </span>
          </button>`;
      }).join("")}
    </div>
    ${childMode ? '<button class="analyze-first-btn history-responsible-btn" id="fullHistoryBtn" type="button">Ver histórico completo</button>' : ""}
  `;
}

function detailHeader(icon, title, subtitle) {
  return `
    <header class="history-section-heading">
      <span class="history-section-heading__icon" data-pa-icon="${icon}" aria-hidden="true"></span>
      <span><h3>${title}</h3><p>${subtitle}</p></span>
    </header>`;
}

function showDetail(index) {
  const history = getHistoryItems();
  const meal = history[index];
  if (!meal) return;

  const childMode = isChildModeActive();
  const units = Number(meal.capsules || meal.dose || 0);
  const foods = Array.isArray(meal.foods) ? meal.foods : [];
  const changes = Array.isArray(meal.changes) ? meal.changes : [];
  historicoScreen.classList.add("hidden");
  detailScreen.classList.remove("hidden");
  detailContent.scrollTop = 0;

  detailContent.innerHTML = `
    <section class="history-detail-hero">
      <img src="${escapeHtml(meal.image || "assets/prato.png")}" alt="Foto da refeição" />
      <div class="history-detail-hero__copy">
        <span>${childMode ? "Refeição de hoje" : "Refeição registrada"}</span>
        <h2>${escapeHtml(translateFoodLabel(meal.name))}</h2>
        <p>${childMode ? escapeHtml(meal.time || "") : `${escapeHtml(meal.date)} · ${escapeHtml(meal.time)}`}</p>
      </div>
    </section>

    <section class="history-detail-summary" aria-label="Resumo da refeição">
      <div><span>Gordura</span><strong>${core.formatDecimal(meal.totalFat, 1)} g</strong></div>
      <div><span>Enzima</span><strong>${units}</strong><small>${Number(units) === 1 ? "unidade" : "unidades"}</small></div>
      <div><span>Calorias</span><strong>${core.formatDecimal(meal.totalCalories, 0)}</strong><small>kcal</small></div>
    </section>

    ${childMode ? `
      <section class="history-detail-section history-detail-section--notice">
        ${detailHeader("info", "Conferência do responsável", "Resultado estimado")}
        <p class="history-detail-note">Um responsável deve conferir este resultado antes do uso.</p>
      </section>
    ` : `
      <section class="history-detail-section">
        ${detailHeader("food", "Alimentos", pluralize(foods.length, "item identificado", "itens identificados"))}
        <div class="history-food-list">
          ${foods.length ? foods.map((food) => `
            <div><strong>${escapeHtml(translateFoodLabel(food.name))}</strong><span>${core.formatQuantity(food.grams)}</span></div>
          `).join("") : '<p class="history-detail-empty">Nenhum alimento registrado.</p>'}
        </div>
      </section>

      <section class="history-detail-section history-detail-section--soft">
        ${detailHeader("info", "Detalhes da análise", "Informações complementares")}
        <div class="history-detail-grid">
          <div><span>Proteína</span><strong>${core.formatDecimal(meal.totalProtein, 1)} g</strong></div>
          <div><span>Carboidrato</span><strong>${core.formatDecimal(meal.totalCarbs, 1)} g</strong></div>
          <div><span>Confiança</span><strong>${Number(meal.confidence || 0)}%</strong></div>
          <div><span>Qualidade da foto</span><strong>${escapeHtml(meal.photoQuality || "—")}</strong></div>
        </div>
        ${meal.estimateText ? `<p class="history-detail-note">${escapeHtml(meal.estimateText)}</p>` : ""}
        ${meal.consistencyWarning ? '<p class="history-detail-warning">Revise os alimentos: o resultado ficou fora do padrão esperado.</p>' : ""}
        ${changes.length ? `
          <div class="history-changes">
            <strong>Ajustes realizados</strong>
            <ul>${changes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        ` : ""}
      </section>
    `}
  `;

  window.PancreAIIcons?.mount?.(detailContent);
}

function goBack() {
  detailScreen.classList.add("hidden");
  historicoScreen.classList.remove("hidden");
}

historyList.addEventListener("click", (event) => {
  if (event.target.closest("#fullHistoryBtn")) {
    window.location.href = "profile.html?responsible=1";
    return;
  }
  const button = event.target.closest("button[data-index]");
  if (button) showDetail(Number(button.dataset.index));
});

analyzeFirstBtn.addEventListener("click", () => { window.location.href = "home.html"; });
backFromDetailBtn.addEventListener("click", goBack);
homeNav.addEventListener("click", () => { window.location.href = "home.html"; });
profileNav.addEventListener("click", () => { window.location.href = "profile.html"; });

core.applyGlobalPreferences();
renderHistory();
