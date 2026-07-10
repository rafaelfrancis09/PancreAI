const backBtn = document.querySelector("#backBtn");
const unidadeOptions = document.querySelectorAll(".unidade-option");
const core = window.PancreAICore;

// Carregar unidade salva
function loadSelectedUnidade() {
  const saved = core.getUnit();
  updateSelection(saved);
}

// Atualizar visualmente qual está selecionado
function updateSelection(value) {
  unidadeOptions.forEach(option => {
    if (option.dataset.value === value) {
      option.classList.add("unidade-option--selected");
    } else {
      option.classList.remove("unidade-option--selected");
    }
  });
}

// Eventos dos botões
unidadeOptions.forEach(option => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;
    core.setUnit(value);
    core.applyGlobalPreferences();
    updateSelection(value);
  });
});

// Voltar para perfil
backBtn.addEventListener("click", () => {
  window.location.href = "profile.html";
});

// Inicializar
loadSelectedUnidade();
core.applyGlobalPreferences();
