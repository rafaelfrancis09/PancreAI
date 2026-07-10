const backBtn = document.querySelector("#backBtn");
const continueBtn = document.querySelector("#continueBtn");
const content = document.querySelector("#demoContent");
const core = window.PancreAICore;
const query = new URLSearchParams(window.location.search);

const source = query.get("source") || "profile";
const nextTarget = query.get("next") || "profile.html";

function getBackTarget() {
  if (source === "intro") {
    return "index.html";
  }
  return "profile.html";
}

function getContinueTarget() {
  if (source === "intro") {
    return nextTarget;
  }
  return "profile.html";
}

continueBtn.textContent = source === "intro" ? "Continuar" : "Voltar ao perfil";

backBtn.addEventListener("click", () => {
  window.location.href = getBackTarget();
});

continueBtn.addEventListener("click", () => {
  window.location.href = getContinueTarget();
});

window.PancreAIDemoExplanationView.render(content);
core.applyGlobalPreferences();
