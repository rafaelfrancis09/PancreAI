const backBtn = document.querySelector("#backBtn");
const pageQuery = new URLSearchParams(window.location.search);
const backTarget = pageQuery.get("from") === "home" ? "home.html" : "profile.html";
const favoritesContent = document.querySelector("#favoritesContent");
const title = document.querySelector(".topbar h1");
const core = window.PancreAICore;
const favorites = core.getFavorites();

function isChildModeActive() {
  return Boolean(core?.isChildMode?.());
}

function translateFoodLabel(value) {
  return window.PancreAIFoodI18n?.translateText?.(value) || window.PancreAII18n?.translatePhrase?.(value) || String(value ?? "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openFavorite(item) {
  core.saveDraftMeal({
    ...item,
    name: item.name || "Refeição salva",
    image: item.image || "assets/prato.png",
    foods: item.foods || [],
    totalFat: Number(item.totalFat || 0),
    capsules: Number(item.capsules || 0),
    dose: Number(item.capsules || 0),
    confidence: 88,
    photoQuality: "Refeição salva",
    changes: ["Refeição favorita reutilizada"],
    hiddenSelections: [],
    confirmed: true,
    confirmedAt: new Date().toISOString()
  });
  window.location.href = "home.html?view=result";
}

function render() {
  const childMode = isChildModeActive();
  if (title) title.textContent = childMode ? "Refeições salvas" : "Favoritos";
  document.body.classList.toggle("favorites-child-mode", childMode);

  if (!favorites.length) {
    favoritesContent.innerHTML = `<div class="empty"><div><h2>${childMode ? "Nenhuma refeição salva" : "Nenhuma refeição favorita"}</h2><p>${childMode ? "As refeições salvas aparecerão aqui." : "Salve uma refeição após o cálculo para vê-la aqui."}</p></div></div>`;
    return;
  }

  favoritesContent.innerHTML = favorites.map((item, index) => childMode ? `
    <article class="card favorite-card favorite-card--child">
      <h2>${escapeHtml(translateFoodLabel(item.name || "Refeição salva"))}</h2>
      <p>${escapeHtml((item.foods || []).slice(0, 3).map((food) => translateFoodLabel(food.name)).join(", ") || "Refeição salva")}</p>
      <small>${core.formatDecimal(item.totalFat, 1)}g de gordura • ${item.capsules || 0} unidade${Number(item.capsules || 0) === 1 ? "" : "s"}</small>
      <div class="favorite-card__actions">
        <button class="favorite-card__primary" type="button" data-use-favorite="${index}">Comi isso</button>
        <button class="favorite-card__secondary" type="button" data-review-favorite="${index}">Revisar</button>
      </div>
    </article>
  ` : `
    <article class="card favorite-card">
      <h2>${escapeHtml(translateFoodLabel(item.name || "Refeição favorita"))}</h2>
      <p>${escapeHtml((item.foods || []).map((food) => translateFoodLabel(food.name)).join(", "))}</p>
      <small>${core.formatDecimal(item.totalFat, 1)}g de gordura • ${item.capsules} cápsulas</small>
    </article>
  `).join("");
}

favoritesContent.addEventListener("click", (event) => {
  const useButton = event.target.closest("button[data-use-favorite]");
  const reviewButton = event.target.closest("button[data-review-favorite]");
  const index = Number(useButton?.dataset.useFavorite ?? reviewButton?.dataset.reviewFavorite ?? -1);
  const item = favorites[index];
  if (!item) return;
  openFavorite(item);
});

backBtn.addEventListener("click", () => {
  window.location.href = backTarget;
});

core.applyGlobalPreferences();
render();