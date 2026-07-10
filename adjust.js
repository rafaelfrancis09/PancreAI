const params = new URLSearchParams(window.location.search);
const suggestedDose = Number(params.get("suggested") || sessionStorage.getItem("pancreaiSuggestedDose") || 3);
const initialDose = Number(params.get("current") || sessionStorage.getItem("pancreaiSelectedDose") || suggestedDose);
const core = window.PancreAICore;
const draftMeal = core.getDraftMeal();

const backBtn = document.querySelector("#backBtn");
const decreaseBtn = document.querySelector("#decreaseBtn");
const increaseBtn = document.querySelector("#increaseBtn");
const confirmBtn = document.querySelector("#confirmBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const doseValue = document.querySelector("#doseValue");
const suggestionValue = document.querySelector("#suggestionValue");
const doseDelta = document.querySelector("#doseDelta");
const totalUnits = document.querySelector("#totalUnits");
const mealTitle = document.querySelector(".meal-summary h2");
const mealFat = document.querySelector(".meal-summary p");
const mealImage = document.querySelector(".meal-summary__image");
const capsuleDetails = document.querySelectorAll(".dose-details__row strong");

const minDose = Math.max(1, suggestedDose - 1);
const maxDose = suggestedDose + 1;
let currentDose = clamp(initialDose, minDose, maxDose);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateView() {
  doseValue.textContent = String(currentDose);
  suggestionValue.textContent = `${suggestedDose} cápsulas`;
  totalUnits.textContent = `${(currentDose * (draftMeal?.capsuleStrength || core.getPatient().capsuleStrength)).toLocaleString("pt-BR")} UI`;

  if (currentDose === suggestedDose) {
    doseDelta.textContent = "Dose igual à sugestão";
    doseDelta.style.color = "#f5a623";
  } else if (currentDose > suggestedDose) {
    doseDelta.textContent = `+${currentDose - suggestedDose} acima da sugestão`;
    doseDelta.style.color = "#ff9f1c";
  } else {
    doseDelta.textContent = `-${suggestedDose - currentDose} abaixo da sugestão`;
    doseDelta.style.color = "#47b57b";
  }

  decreaseBtn.disabled = currentDose <= minDose;
  increaseBtn.disabled = currentDose >= maxDose;
}

function goHomeResult() {
  sessionStorage.setItem("pancreaiSuggestedDose", String(suggestedDose));
  sessionStorage.setItem("pancreaiSelectedDose", String(currentDose));

  if (draftMeal) {
    draftMeal.capsules = currentDose;
    draftMeal.dose = currentDose;
    core.saveDraftMeal(draftMeal);
    const history = core.getHistory();
    const index = history.findIndex((item) => item.id === draftMeal.id);
    if (index >= 0) {
      history[index] = draftMeal;
      core.saveHistory(history);
      localStorage.setItem("pancreaiLastMeal", JSON.stringify(history[0]));
    }
  }

  window.location.href = "home.html?view=result";
}

decreaseBtn.addEventListener("click", () => {
  currentDose = clamp(currentDose - 1, minDose, maxDose);
  updateView();
});

increaseBtn.addEventListener("click", () => {
  currentDose = clamp(currentDose + 1, minDose, maxDose);
  updateView();
});

confirmBtn.addEventListener("click", goHomeResult);
cancelBtn.addEventListener("click", () => {
  window.location.href = "home.html?view=result";
});
backBtn.addEventListener("click", () => {
  window.location.href = "home.html?view=result";
});

if (draftMeal) {
  mealTitle.textContent = draftMeal.name || "Refeição analisada";
  mealFat.textContent = `Gordura estimada: ${core.formatDecimal(draftMeal.totalFat || 0, 1)}g`;
  mealImage.src = draftMeal.image || "assets/prato.png";
  capsuleDetails[0].textContent = `Creon ${Number(draftMeal.capsuleStrength || core.getPatient().capsuleStrength).toLocaleString("pt-BR")}`;
  capsuleDetails[2].textContent = `${core.formatDecimal(draftMeal.totalFat || 0, 1)}g`;
}

core.applyGlobalPreferences();
updateView();
