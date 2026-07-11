const app = document.querySelector("#app");

const analyzeBtn = document.querySelector("#analyzeBtn");
const favoritesBtn = document.querySelector("#favoritesBtn");
const tutorialBtn = document.querySelector("#tutorialBtn");
const reportBtn = document.querySelector("#reportBtn");
const overlayClose = document.querySelector("#overlayClose");
const cancelBtn = document.querySelector("#cancelBtn");
const cameraBtn = document.querySelector("#cameraBtn");
const galleryBtn = document.querySelector("#galleryBtn");
const cameraCloseBtn = document.querySelector("#cameraCloseBtn");
const cameraCancelBtn = document.querySelector("#cameraCancelBtn");
const cameraSwitchBtn = document.querySelector("#cameraSwitchBtn");
const captureBtn = document.querySelector("#captureBtn");
const galleryBackBtn = document.querySelector("#galleryBackBtn");
const galleryGrid = document.querySelector("#galleryGrid");
const galleryPrevBtn = document.querySelector("#galleryPrevBtn");
const galleryNextBtn = document.querySelector("#galleryNextBtn");
const galleryPagination = document.querySelector("#galleryPagination");
const previewBackBtn = document.querySelector("#previewBackBtn");
const capturePreview = document.querySelector("#capturePreview");
const capturePreviewCard = document.querySelector("#capturePreviewCard");
const realPhotoNotice = document.querySelector("#realPhotoNotice");
const previewActions = document.querySelector("#previewActions");
const usePhotoBtn = document.querySelector("#usePhotoBtn");
const retryPhotoBtn = document.querySelector("#retryPhotoBtn");
const imageErrorCard = document.querySelector("#imageErrorCard");
const imageRetryBtn = document.querySelector("#imageRetryBtn");
const imageErrorBackBtn = document.querySelector("#imageErrorBackBtn");
const adjustBtn = document.querySelector("#adjustBtn");
const confirmBtn = document.querySelector("#confirmBtn");
const historyBtn = document.querySelector("#historyBtn");
const profileBtn = document.querySelector("#profileBtn");
const mealPreview = document.querySelector("#mealPreview");
const cameraShell = document.querySelector(".camera-shell");
const cameraStatus = document.querySelector("#cameraStatus");
const cameraVideo = document.querySelector("#cameraVideo");
const cameraFileInput = document.querySelector("#cameraFileInput");
const galleryFileInput = document.querySelector("#galleryFileInput");
const deviceGalleryBtn = document.querySelector("#deviceGalleryBtn");
const resultDoseValue = document.querySelector("#resultDoseValue");
const resultDoseNote = document.querySelector("#resultDoseNote");
const resultDoseCapsule = document.querySelector("#resultDoseCapsule");
const doseCard = document.querySelector("#doseCard");
const resultMealTitle = document.querySelector("#resultMealTitle");
const resultTags = document.querySelector("#resultTags");
const resultFat = document.querySelector("#resultFat");
const resultProtein = document.querySelector("#resultProtein");
const resultCarbs = document.querySelector("#resultCarbs");
const estimateText = document.querySelector("#estimateText");
const favoriteBtn = document.querySelector("#favoriteBtn");
const explainBtn = document.querySelector("#explainBtn");
const analysisTitle = document.querySelector("#analysisTitle");
const analysisMessage = document.querySelector("#analysisMessage");
const progressFill = document.querySelector("#progressFill");
const analysisErrorActions = document.querySelector("#analysisErrorActions");
const analysisRetryBtn = document.querySelector("#analysisRetryBtn");
const analysisBackBtn = document.querySelector("#analysisBackBtn");
const analysisDemoBtn = document.querySelector("#analysisDemoBtn");
const analysisSourceNote = document.querySelector("#analysisSourceNote");
const confirmPreview = document.querySelector("#confirmPreview");
const confirmFoodList = document.querySelector("#confirmFoodList");
const confidenceBadge = document.querySelector("#confidenceBadge");
const confidenceBar = document.querySelector("#confidenceBar");
const confidenceHint = document.querySelector("#confidenceHint");
const qualityAlert = document.querySelector("#qualityAlert");
const unknownFoodCard = document.querySelector("#unknownFoodCard");
const packagingCard = document.querySelector("#packagingCard");
const analysisWarnings = document.querySelector("#analysisWarnings");
const reviewWarnings = document.querySelector("#reviewWarnings");
const resultWarnings = document.querySelector("#resultWarnings");
const addFoodBtn = document.querySelector("#addFoodBtn");
const confirmAnalysisBtn = document.querySelector("#confirmAnalysisBtn");
const reanalyzeBtn = document.querySelector("#reanalyzeBtn");
const hiddenFatsPanel = document.querySelector("#hiddenFatsPanel");
const hiddenFatsCard = document.querySelector("#hiddenFatsCard");
const learningCard = document.querySelector("#learningCard");
const learningMessage = document.querySelector("#learningMessage");
const applyLearningBtn = document.querySelector("#applyLearningBtn");
const dismissLearningBtn = document.querySelector("#dismissLearningBtn");
const foodSearchModal = document.querySelector("#foodSearchModal");
const foodSearchClose = document.querySelector("#foodSearchClose");
const foodSearchInput = document.querySelector("#foodSearchInput");
const foodSearchResults = document.querySelector("#foodSearchResults");
const explainModal = document.querySelector("#explainModal");
const explainClose = document.querySelector("#explainClose");
const explainContent = document.querySelector("#explainContent");
const childReviewPrompt = document.querySelector("#childReviewPrompt");
const portionModal = document.querySelector("#portionModal");
const portionClose = document.querySelector("#portionClose");
const portionTitle = document.querySelector("#portionTitle");
const portionOptions = document.querySelector("#portionOptions");

const core = window.PancreAICore;
const simulator = window.PancreAISimulator;
const captureService = window.PancreAIServices?.simulatedCaptureService;
const realCaptureService = window.PancreAIServices?.realImageCaptureService;
const realRecognitionProvider = window.PancreAIServices?.realMealRecognitionProvider;
const polish = window.PancreAIPolish;
const historyService = window.PancreAIServices?.historyService;
const medicalWarningsService = window.PancreAIServices?.medicalWarningsService;
const i18n = window.PancreAII18n;
const query = new URLSearchParams(window.location.search);

let analysisTimerId = null;
let analysisRequestId = 0;
let analysisAbortController = null;
let cameraStream = null;
let cameraOperationId = 0;
let activeObjectUrl = null;
let cameraCaptureTimerId = null;
let galleryRendered = false;
let galleryMeals = [];
let galleryPage = 0;
const GALLERY_PAGE_SIZE = 6;
let pendingFoodTarget = null;
let pendingPortionIndex = null;

const state = {
  patient: core.getPatient(),
  photoFile: null,
  photoSrc: "assets/prato.png",
  persistedPhoto: "assets/prato.png",
  photoFilename: null,
  simulatedMealId: null,
  simulatedFilename: null,
  captureSource: null,
  analysis: null,
  detectedFoods: [],
  foods: [],
  unknownFood: null,
  hiddenSelections: [],
  result: null,
  suggestion: null,
  reanalyses: 0,
  changes: [],
  addedItems: [],
  removedItems: [],
  selectedDose: Number(sessionStorage.getItem("pancreaiSelectedDose") || 0)
};

if (!core.isSetupComplete() && window.location.pathname.toLowerCase().endsWith("home.html")) {
  localStorage.setItem("pancreaiReturnTo", "home.html");
  window.location.replace("configuracao.html");
}

function setView(view) {
  if (app.dataset.view === view) return;
  app.dataset.view = view;
}

function cloneFoods(foods) {
  return foods.map((food) => ({ ...food }));
}


function translate(key, params) {
  return i18n?.t?.(key, params) || key;
}

function translateFoodLabel(value) {
  return window.PancreAIFoodI18n?.translateText?.(value) || i18n?.translatePhrase?.(value) || String(value ?? "");
}
function isChildModeActive() {
  return Boolean(core?.isChildMode?.());
}

function getFoodSource(food) {
  const custom = food?.nutritionPer100g;
  if (custom) {
    return {
      name: food.name,
      fat: Number(custom.fat || 0),
      protein: Number(custom.protein || 0),
      carbs: Number(custom.carbs || 0),
      calories: Number(custom.calories || 0)
    };
  }
  return simulator?.nutritionalDatabase?.find((item) => item.name === food?.name) || null;
}
function inferPortionCategory(food) {
  const source = getFoodSource(food) || food || {};
  const name = String(source.name || "").toLowerCase();
  const fat = Number(source.fat || food?.fat || 0);
  const protein = Number(source.protein || food?.protein || 0);
  const carbs = Number(source.carbs || food?.carbs || 0);

  if (/azeite|óleo|oleo|manteiga|maionese|molho|requeijão|queijo/.test(name) || fat >= 12) return "fat";
  if (/pão|pao|torrada|fatia/.test(name)) return "slice";
  if (protein >= carbs && protein >= 8) return "protein";
  if (carbs >= protein) return "carb";
  return "unknown";
}

function getPortionOptions(food) {
  if (Array.isArray(food?.portionOptions) && food.portionOptions.length) {
    return food.portionOptions.map((option, index) => ({
      key: `custom-${index}`,
      label: option.label,
      grams: Number(option.quantityGrams ?? option.grams ?? 0)
    }));
  }
  const category = inferPortionCategory(food);
  if (category === "fat") {
    return [
      { key: "little", label: "Um pouquinho", grams: 5 },
      { key: "medium", label: "Médio", grams: 10 },
      { key: "much", label: "Bastante", grams: 15 }
    ];
  }
  if (category === "slice") {
    return [
      { key: "half", label: "Meio", grams: 25 },
      { key: "one", label: "Um", grams: 50 },
      { key: "two", label: "Dois", grams: 100 }
    ];
  }
  if (category === "carb") {
    return [
      { key: "little", label: "Pouco", grams: 60 },
      { key: "medium", label: "Médio", grams: 120 },
      { key: "much", label: "Muito", grams: 180 }
    ];
  }
  if (category === "protein") {
    return [
      { key: "little", label: "Pouco", grams: 50 },
      { key: "medium", label: "Médio", grams: 100 },
      { key: "much", label: "Muito", grams: 150 }
    ];
  }
  return [
    { key: "little", label: "Pouco", grams: 50 },
    { key: "medium", label: "Médio", grams: 100 },
    { key: "much", label: "Muito", grams: 150 }
  ];
}

function getClosestPortion(food) {
  const grams = Number(food?.grams || 0);
  return getPortionOptions(food).reduce((closest, option) => {
    return Math.abs(option.grams - grams) < Math.abs(closest.grams - grams) ? option : closest;
  });
}

function getSimplePortionText(food) {
  const portion = getClosestPortion(food);
  return {
    label: food?.portionLabel || portion.label,
    grams: `aprox. ${Math.round(Number(food?.grams || portion.grams))} g`
  };
}

function buildFoodAtGrams(food, grams, label) {
  const source = getFoodSource(food);
  if (!source) return null;
  return {
    ...food,
    name: source.name,
    grams,
    quantityGrams: grams,
    portionLabel: label || food.portionLabel,
    fat: Number((source.fat * grams / 100).toFixed(2)),
    protein: Number((source.protein * grams / 100).toFixed(2)),
    carbs: Number((source.carbs * grams / 100).toFixed(2)),
    calories: Number((source.calories * grams / 100).toFixed(2))
  };
}
function applyHomeChildModeState() {
  const childMode = isChildModeActive();
  const title = document.querySelector(".home-header h1");
  const subtitle = document.querySelector(".home-header p");
  const infoCards = Array.from(document.querySelectorAll(".info-card"));
  const shortcutTitle = infoCards[1]?.querySelector("h2");
  const analyzeLabel = document.querySelector("#analyzeBtn .analyze-card__label");
  const historyLabel = document.querySelector("#historyBtn small");
  const profileLabel = document.querySelector("#profileBtn small");

  infoCards[0]?.classList.toggle("hide-in-child-mode", childMode);
  document.body.classList.toggle("home-child-mode", childMode);

  if (childMode) {
    if (title) title.textContent = "Minha refeição";
    if (subtitle) subtitle.textContent = "Fotografe o prato ou use uma refeição salva.";
    if (analyzeLabel) analyzeLabel.textContent = "Fotografar prato";
    if (shortcutTitle) shortcutTitle.textContent = "Ações rápidas";
    if (favoritesBtn) favoritesBtn.textContent = "Usar refeição salva";
    if (tutorialBtn) tutorialBtn.textContent = "Refeições de hoje";
    if (reportBtn) reportBtn.textContent = "Chamar responsável";
    if (historyLabel) historyLabel.textContent = "Refeições";
    if (profileLabel) profileLabel.textContent = "Responsável";
  }
}

function applyHomeCopy() {
  const textMap = [
    [".home-header h1", "home.welcome"],
    [".home-header p", "home.ready"],
    ["#analyzeBtn .analyze-card__label", "home.analyzeMeal"],
    ["#mealSourceTitle", "Adicionar refeição"],
    ["#mealSourceLead", "Escolha como deseja analisar sua refeição."],
    ["#cameraBtn strong", "Tirar foto"],
    ["#galleryBtn strong", "Escolher da galeria"],
    ["#deviceGalleryBtn strong", "home.chooseDevicePhoto"],
    ["#deviceGalleryBtn small", "home.chooseDevicePhotoHint"],
    [".gallery-demo-label", "home.demoPhotos"],
    ["#analysisDemoBtn", "analysis.useDemo"],
    ["#realPhotoNotice", "analysis.realPhotoNotice"],
    ["#cancelBtn", "common.cancel"],
    [".screen--confirm .result-page__top h2", "analysis.confirmTitle"],
    [".summary-card__header h3", "analysis.detectedFoods"],
    ["#confidenceHint", "analysis.reviewBeforeCalculate"],
    ["#addFoodBtn", "analysis.addFood"],
    ["#confirmAnalysisBtn", "analysis.confirm"],
    ["#reanalyzeBtn", "analysis.reanalyze"],
    [".screen--result .result-page__top h2", "result.title"],
    [".nutrition h3", "result.summary"],
    ["#explainBtn", "result.fullCalculation"],
    ["#favoriteBtn", "result.saveFavorite"],
    ["#adjustBtn", "result.adjustDose"],
    ["#confirmBtn", "common.finish"],
    ["#foodSearchModal h2", "analysis.addFood"],
    ["#explainModal h2", "result.fullCalculation"],
    ["#historyBtn small", "nav.history"],
    ["#profileBtn small", "nav.profile"]
  ];

  textMap.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = key.includes(".") ? translate(key) : key;
  });

  const homeNavLabel = document.querySelector(".bottom-nav__item--active small");
  if (homeNavLabel) homeNavLabel.textContent = translate("nav.home");

  const infoCards = Array.from(document.querySelectorAll(".info-card"));
  if (infoCards[0]) {
    const title = infoCards[0].querySelector("h2");
    const text = infoCards[0].querySelector("p");
    if (title) title.textContent = translate("home.howItWorks");
    if (text) text.textContent = translate("home.howItWorksText");
  }
  if (infoCards[1]) {
    const title = infoCards[1].querySelector("h2");
    if (title) title.textContent = translate("home.shortcuts");
  }

  const nutritionLabels = document.querySelectorAll(".nutrition__row span");
  if (nutritionLabels[0]) nutritionLabels[0].textContent = translate("result.fat");
  if (nutritionLabels[1]) nutritionLabels[1].textContent = translate("result.protein");
  if (nutritionLabels[2]) nutritionLabels[2].textContent = translate("result.carbs");
  if (foodSearchInput) foodSearchInput.placeholder = "Pesquisar alimento";
  applyHomeChildModeState();
}
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearAnalysisTimer() {
  if (analysisTimerId) {
    window.clearTimeout(analysisTimerId);
    analysisTimerId = null;
  }
}

function cancelActiveAnalysis() {
  analysisRequestId += 1;
  analysisAbortController?.abort();
  analysisAbortController = null;
  clearAnalysisTimer();
}

function revokePhotoUrl() {
  if (!activeObjectUrl) return;
  window.URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = null;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
    reader.addEventListener("error", () => reject(new Error("Não foi possível preparar a prévia da foto.")), { once: true });
    reader.readAsDataURL(file);
  });
}

function setSoftMessage(element, message) {
  if (!element) return;
  if (element.textContent === message) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion || isChildModeActive()) {
    element.textContent = message;
    return;
  }
  element.classList.remove("is-changing");
  void element.offsetWidth;
  element.classList.add("is-changing");
  window.setTimeout(() => {
    element.textContent = message;
    element.classList.remove("is-changing");
  }, 180);
}

function setAnalysisMessage(message) {
  setSoftMessage(analysisMessage, message);
}

function setCameraMessage(message) {
  setSoftMessage(cameraStatus, message);
}

function syncPhotoElements() {
  mealPreview.src = state.photoSrc;
  confirmPreview.src = state.photoSrc;
  capturePreview.src = state.photoSrc;
}

async function setPhoto(source, options = {}) {
  if (typeof source === "string" && source) {
    revokePhotoUrl();
    state.photoFile = null;
    state.photoSrc = source;
    state.persistedPhoto = source;
    state.photoFilename = options.filename || source.split("/").pop()?.split("?")[0] || null;
    syncPhotoElements();
    return null;
  }

  if (source) {
    if (!realCaptureService?.prepareImageFile) {
      throw new Error("O preparador de imagens não está disponível.");
    }
    const preparedFile = options.prepared
      ? source
      : await realCaptureService.prepareImageFile(source);
    const thumbnailFile = await realCaptureService.prepareImageFile(preparedFile, {
      maxDimension: 720,
      maxOutputBytes: 350 * 1024,
      quality: 0.72
    });
    const persistedPhoto = await readFileAsDataUrl(thumbnailFile);

    revokePhotoUrl();
    state.photoFile = preparedFile;
    state.photoFilename = preparedFile.name || source.name || `refeicao-${Date.now()}.jpg`;
    activeObjectUrl = window.URL.createObjectURL(preparedFile);
    state.photoSrc = activeObjectUrl;
    state.persistedPhoto = persistedPhoto;
    syncPhotoElements();
    return preparedFile;
  }

  if (!state.simulatedMealId) {
    revokePhotoUrl();
    state.photoFile = null;
    state.photoSrc = "assets/prato.png";
    state.persistedPhoto = "assets/prato.png";
    state.photoFilename = "prato.png";
    syncPhotoElements();
  }
  return null;
}

function stopLiveCamera() {
  if (cameraStream) realCaptureService?.stopCamera?.(cameraStream);
  cameraStream = null;
  if (cameraVideo) {
    cameraVideo.pause?.();
    cameraVideo.srcObject = null;
    cameraVideo.hidden = true;
  }
  cameraShell.dataset.cameraSource = "none";
}

function resetCameraUi() {
  if (cameraCaptureTimerId) {
    window.clearTimeout(cameraCaptureTimerId);
    cameraCaptureTimerId = null;
  }
  cameraShell.classList.remove("is-capturing", "has-captured-image");
  cameraShell.dataset.cameraState = "ready";
  captureBtn.disabled = false;
}

function closeCamera() {
  cameraOperationId += 1;
  stopLiveCamera();
  resetCameraUi();
  cameraStatus.textContent = isChildModeActive() ? "Coloque o prato no centro" : "Posicione o prato no centro";
  setView("sheet");
}

function renderGalleryPage() {
  const totalPages = Math.max(1, Math.ceil(galleryMeals.length / GALLERY_PAGE_SIZE));
  galleryPage = Math.max(0, Math.min(galleryPage, totalPages - 1));
  const start = galleryPage * GALLERY_PAGE_SIZE;
  const visibleMeals = galleryMeals.slice(start, start + GALLERY_PAGE_SIZE);

  galleryGrid.innerHTML = visibleMeals.map((meal) => `
    <button class="gallery-item" type="button" role="listitem" data-meal-id="${escapeHtml(meal.id)}" aria-label="${escapeHtml(meal.title)}">
      <img src="${escapeHtml(meal.imageUrl)}" alt="${escapeHtml(meal.title)}" loading="eager" />
      <span class="gallery-item__fallback">Não foi possível carregar.<br />Toque para tentar novamente.</span>
    </button>
  `).join("");

  galleryPrevBtn.disabled = galleryPage === 0;
  galleryNextBtn.disabled = galleryPage >= totalPages - 1;
  galleryPagination.innerHTML = Array.from({ length: totalPages }, (_, index) => `
    <span class="gallery-pagination__dot${index === galleryPage ? " is-active" : ""}" aria-label="Página ${index + 1} de ${totalPages}"></span>
  `).join("");
}

function changeGalleryPage(direction) {
  const totalPages = Math.max(1, Math.ceil(galleryMeals.length / GALLERY_PAGE_SIZE));
  const nextPage = Math.max(0, Math.min(galleryPage + direction, totalPages - 1));
  if (nextPage === galleryPage) return;
  galleryPage = nextPage;
  renderGalleryPage();
}

function renderGallery() {
  galleryMeals = captureService?.getSimulatedMealImages?.() || [];
  galleryPage = 0;
  renderGalleryPage();
  galleryRendered = true;
}

function openGallery() {
  cameraOperationId += 1;
  stopLiveCamera();
  resetCameraUi();
  if (!galleryRendered) renderGallery();
  const subtitle = document.querySelector(".screen--gallery .capture-header p");
  if (subtitle) subtitle.textContent = isChildModeActive() ? "Escolha uma foto" : "Selecione uma imagem para analisar";
  setView("gallery");
}

async function showCapturePreview(meal, source) {
  const selected = meal || captureService?.getSimulatedMealById?.(null);
  if (!selected) return;
  state.simulatedMealId = selected.id;
  state.simulatedFilename = selected.filename;
  state.captureSource = source || selected.captureSource || "gallery_demo";
  state.analysis = null;
  state.detectedFoods = [];
  realPhotoNotice.hidden = true;
  await setPhoto(selected.imageUrl, { filename: selected.filename });
  capturePreviewCard.hidden = false;
  previewActions.hidden = false;
  imageErrorCard.hidden = true;
  setView("preview");
}

async function showRealCapturePreview(file, source, options = {}) {
  state.simulatedMealId = null;
  state.simulatedFilename = null;
  state.captureSource = source;
  state.analysis = null;
  state.detectedFoods = [];
  realPhotoNotice.hidden = false;
  await setPhoto(file, { prepared: Boolean(options.prepared) });
  capturePreviewCard.hidden = false;
  previewActions.hidden = false;
  imageErrorCard.hidden = true;
  setView("preview");
}

function showPreviewImageError() {
  if (app.dataset.view !== "preview") return;
  capturePreviewCard.hidden = true;
  realPhotoNotice.hidden = true;
  previewActions.hidden = true;
  imageErrorCard.hidden = false;
}

function restorePreviewImage() {
  capturePreviewCard.hidden = false;
  realPhotoNotice.hidden = !state.photoFile;
  previewActions.hidden = false;
  imageErrorCard.hidden = true;
}

function retryPreviewImage() {
  restorePreviewImage();
  const separator = state.photoSrc.includes("?") ? "&" : "?";
  capturePreview.src = `${state.photoSrc}${separator}retry=${Date.now()}`;
}

function returnToCaptureSource() {
  cancelActiveAnalysis();
  if (["camera_real", "camera_file"].includes(state.captureSource)) openCamera();
  else openGallery();
}
async function handleRealImageSelection(input, source) {
  const file = input?.files?.[0];
  if (input) input.value = "";
  if (!file) return;

  const isCameraFallback = source === "camera_file";
  const trigger = isCameraFallback ? captureBtn : deviceGalleryBtn;
  if (trigger) trigger.disabled = true;
  if (isCameraFallback) {
    cameraOperationId += 1;
    stopLiveCamera();
    cameraShell.classList.add("is-capturing");
    setCameraMessage("Preparando foto...");
  } else {
    polish?.showToast("Preparando foto...");
  }

  try {
    await showRealCapturePreview(file, source);
  } catch (error) {
    polish?.showToast(error?.message || "Não foi possível preparar esta foto.");
    if (isCameraFallback) {
      cameraShell.classList.remove("is-capturing");
      cameraShell.dataset.cameraState = "error";
      setView("camera");
      setCameraMessage(error?.message || "Não foi possível preparar esta foto.");
    } else {
      setView("gallery");
    }
  } finally {
    if (trigger) trigger.disabled = false;
  }
}
function openSheet() {
  setView("sheet");
}

function closeSheet() {
  setView("home");
}

function openModal(element) {
  element.setAttribute("aria-hidden", "false");
  element.dataset.open = "true";
}

function closeModal(element) {
  element.setAttribute("aria-hidden", "true");
  element.dataset.open = "false";
}

function syncHiddenSelections() {
  const rows = Array.from(hiddenFatsPanel.querySelectorAll(".hidden-fat-item"));
  if (!rows.length) {
    state.hiddenSelections = [];
    return;
  }
  state.hiddenSelections = rows.map((row) => {
    const checkbox = row.querySelector("input[type='checkbox']");
    const select = row.querySelector("select");
    return {
      label: checkbox.dataset.label,
      selected: checkbox.checked,
      amount: Number(select.value || 1),
      fatPerAmount: Number(row.dataset.fatPerAmount || 5)
    };
  });
}
function shouldUseNoEnzymeResult() {
  const hasSpecialRule = state.analysis?.specialResult?.type === "no_enzyme_needed";
  const hasHiddenFat = state.hiddenSelections.some((item) => item.selected);
  const onlyFruit = state.foods.length > 0 && state.foods.every((food) => food.category === "fruta");
  return hasSpecialRule && onlyFruit && !hasHiddenFat && state.addedItems.length === 0;
}

function applyNoEnzymeResult(result) {
  if (!shouldUseNoEnzymeResult()) return result;
  const special = state.analysis.specialResult;
  return {
    ...result,
    specialResult: special,
    lipaseUnits: 0,
    lipaseUnitsNeeded: 0,
    lipaseUnitsDelivered: 0,
    capsulesExact: 0,
    capsules: 0,
    unitsExact: 0,
    unitsRounded: 0,
    consistencyWarning: false,
    safetyWarnings: [],
    estimateText: special.supportingText,
    calculationSteps: [
      { label: "Gordura total", value: `${Number(result.totalFat || 0).toFixed(1)} g` },
      { label: "Enzima estimada", value: "0" }
    ]
  };
}

function calculateResult() {
  syncHiddenSelections();
  const calculated = simulator.calculateMeal(
    {
      ...state.analysis,
      foods: cloneFoods(state.foods),
      unknownFood: state.unknownFood,
      changes: [...state.changes]
    },
    state.patient,
    state.hiddenSelections
  );
  state.result = applyNoEnzymeResult(calculated);
  state.selectedDose = Number(sessionStorage.getItem("pancreaiSelectedDose") ?? state.result.capsules);
  sessionStorage.setItem("pancreaiSuggestedDose", String(state.result.capsules));
  if (sessionStorage.getItem("pancreaiSelectedDose") === null) {
    sessionStorage.setItem("pancreaiSelectedDose", String(state.result.capsules));
    state.selectedDose = state.result.capsules;
  }
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

function getUnitLabel(count) {
  return pluralizeUnit(count, state.result?.unitLabel || state.patient.treatment?.unitLabel || core.getCurrentUnitLabel?.() || "unidade");
}

function getDoseValueText(value) {
  return `${value} ${getUnitLabel(value)}`;
}

function getDoseText() {
  const treatment = state.result?.treatment || state.patient.treatment || core.getTreatment?.();
  const medication = treatment?.medicationDisplayName || "Medicamento cadastrado";
  const lipaseUnits = Number(treatment?.lipaseUnitsPerUnit || state.result?.lipaseUnitsPerUnit || state.patient.capsuleStrength || 0);
  const unit = treatment?.unitLabel || state.result?.unitLabel || "unidade";
  return lipaseUnits
    ? `${medication} · ${lipaseUnits.toLocaleString("pt-BR")} U por ${unit}`
    : medication;
}
function renderLearningSuggestion() {
  state.suggestion = state.foods.map((food) => core.getLearningSuggestion(food.name)).find(Boolean) || null;
  if (!state.suggestion) {
    learningCard.hidden = true;
    return;
  }
  learningCard.hidden = false;
  learningMessage.textContent = state.suggestion.message;
}

function renderHiddenFats() {
  const suggestions = (state.hiddenSelections || []).filter((item) => {
    return String(item.label || "").toLocaleLowerCase("pt-BR") !== "n\u00e3o tinha";
  });
  hiddenFatsCard.hidden = false;
  if (!suggestions.length) {
    hiddenFatsPanel.innerHTML = `<p class="hidden-fat-empty">Nenhum ingrediente oculto foi sugerido para esta refei\u00e7\u00e3o.</p>`;
    return;
  }
  hiddenFatsPanel.innerHTML = suggestions.map((item) => `
    <article class="hidden-fat-item" data-fat-per-amount="${Number(item.fatPerAmount || 5)}">
      <label class="hidden-fat-item__copy">
        <span><input type="checkbox" data-label="${escapeHtml(item.label)}" ${item.selected ? "checked" : ""} /> <strong>${escapeHtml(item.label)}</strong></span>
        <small>Pode alterar a gordura estimada</small>
      </label>
      <div class="hidden-fat-item__controls">
        <select aria-label="Quantidade de ${escapeHtml(item.label)}">
          <option value="1" ${Number(item.amount) === 1 ? "selected" : ""}>Pouco</option>
          <option value="1.5" ${Number(item.amount) === 1.5 ? "selected" : ""}>M\u00e9dio</option>
          <option value="2" ${Number(item.amount) === 2 ? "selected" : ""}>Bastante</option>
        </select>
      </div>
    </article>
  `).join("");
}
function getMedicalWarningContext(stage) {
  return {
    stage,
    analysis: state.analysis,
    foods: cloneFoods(state.foods),
    hiddenSelections: state.hiddenSelections,
    changes: [...state.changes],
    result: state.result,
    patient: state.patient,
    history: core.getHistory(),
    educationalEnabled: core.isMedicalWarningsEnabled()
  };
}

function renderWarningList(container, warnings) {
  if (!container) {
    return;
  }

  const items = warnings || [];
  container.hidden = items.length === 0;
  container.innerHTML = items.map((warning) => {
    const icon = warning.severity === "critical" ? "warning" : "info";
    return `
      <article class="medical-warning-card medical-warning-card--${escapeHtml(warning.severity || "info")}">
        <span class="medical-warning-card__icon" data-pa-icon="${icon}" aria-hidden="true"></span>
        <div>
          <h3>${escapeHtml(warning.title)}</h3>
          <p>${escapeHtml(warning.message)}</p>
        </div>
      </article>
    `;
  }).join("");

  window.PancreAIIcons?.mount(container);
}

function renderMedicalWarnings(stage, container) {
  const warnings = medicalWarningsService?.generateMedicalWarnings(getMedicalWarningContext(stage)) || [];
  renderWarningList(container, warnings);
}

function renderFoodList() {
  confirmFoodList.innerHTML = "";
  const childMode = isChildModeActive();

  state.foods.forEach((food, index) => {
    const item = document.createElement("article");
    const isConfirmed = childMode && Boolean(food.confirmed);
    item.className = `food-item${childMode ? " food-item--child" : ""}${isConfirmed ? " food-item--confirmed" : ""} ui-enter`;
    const portion = getSimplePortionText(food);

    item.innerHTML = childMode ? `
      <div class="food-item__main">
        <strong>${escapeHtml(translateFoodLabel(food.name))}</strong>
        <p>Quantidade: ${escapeHtml(portion.label)}</p>
        <small>${escapeHtml(portion.grams)}</small>
      </div>
      ${isConfirmed ? `
        <span class="food-item__confirmed">
          <svg class="app-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>
          Confirmado
        </span>
      ` : `      <div class="food-item__actions food-item__actions--child">
        <button class="food-item__button food-item__button--ok" data-action="confirm" data-index="${index}" type="button">Está certo</button>
        <button class="food-item__button" data-action="edit" data-index="${index}" type="button">Mudar quantidade</button>
        <button class="food-item__button" data-action="remove" data-index="${index}" type="button">Remover</button>
      </div>
      `}
    ` : `
      <div>
        <strong>${escapeHtml(translateFoodLabel(food.name))}</strong>
        <p>${escapeHtml(food.portionLabel || core.formatQuantity(food.grams))}${food.portionLabel ? ` &middot; ${core.formatQuantity(food.grams)}` : ""}</p>
      </div>
      <div class="food-item__actions">
        <button class="food-item__button" data-action="edit" data-index="${index}" type="button">Editar</button>
        <button class="food-item__button" data-action="remove" data-index="${index}" type="button">Remover</button>
      </div>
    `;
    confirmFoodList.appendChild(item);
    requestAnimationFrame(() => item.classList.remove("ui-enter"));
  });

  if (state.unknownFood) {
    unknownFoodCard.hidden = false;
    unknownFoodCard.innerHTML = childMode ? `
      <h3>Tem algo que não reconhecemos</h3>
      <p>Peça para um responsável conferir ou substitua pelo alimento correto.</p>
      <div class="food-item__actions food-item__actions--child">
        <button class="food-item__button" data-unknown-action="replace" type="button">Substituir</button>
        <button class="food-item__button" data-unknown-action="remove" type="button">Remover</button>
      </div>
    ` : `
      <h3>Alimento não identificado</h3>
      <p>O módulo de análise encontrou um item sem identificação confiável.</p>
      <div class="food-item__actions">
        <button class="food-item__button" data-unknown-action="edit" type="button">Editar</button>
        <button class="food-item__button" data-unknown-action="replace" type="button">Substituir</button>
        <button class="food-item__button" data-unknown-action="remove" type="button">Remover</button>
      </div>
    `;
  } else {
    unknownFoodCard.innerHTML = "";
    unknownFoodCard.hidden = true;
  }
  confirmAnalysisBtn.disabled = state.foods.length === 0;
}
function renderConfirmation() {
  confirmPreview.src = state.photoSrc;
  renderFoodList();
  confirmAnalysisBtn.disabled = state.foods.length === 0;
  renderHiddenFats();
  calculateResult();
  renderLearningSuggestion();

  const confidenceColor = state.analysis.confidence >= 85 ? "#2d8a52" : state.analysis.confidence >= 70 ? "#de7d21" : "#c6503f";
  confidenceBadge.textContent = `${state.analysis.confidence}%`;
  confidenceBadge.style.background = `${confidenceColor}1f`;
  confidenceBadge.style.color = confidenceColor;
  confidenceBar.style.width = `${state.analysis.confidence}%`;
  confidenceBar.style.background = confidenceColor;
  confidenceHint.textContent = state.analysis.confidence < 70
    ? "Esta análise possui baixa confiança. Recomendamos fotografar novamente."
    : state.analysis.confidence < 85
      ? "A precisão pode ser reduzida devido às condições da foto."
      : state.analysis.isSimulated
        ? "Confiança alta no exemplo demonstrativo."
        : "Boa confiança visual. Revise os alimentos antes do cálculo.";
  const shouldShowQualityAlert = state.analysis.confidence < 70;
  qualityAlert.hidden = !shouldShowQualityAlert;
  qualityAlert.innerHTML = shouldShowQualityAlert ? `
    <h3>Revise a foto</h3>
    <p>${escapeHtml(state.analysis.photoQuality?.label || state.analysis.photoQuality || "Qualidade não informada")}</p>
    <small>Confira os alimentos antes de calcular.</small>
  ` : "";
  if (state.analysis.packaging) {
    packagingCard.hidden = false;
    packagingCard.innerHTML = `<h3>Embalagem detectada</h3><p>${escapeHtml(translateFoodLabel(state.analysis.packaging))}</p><small>Parece que há um alimento embalado. No futuro será possível ler automaticamente a tabela nutricional.</small>`;
  } else {
    packagingCard.innerHTML = "";
    packagingCard.hidden = true;
  }

  renderMedicalWarnings("analysis", analysisWarnings);
  renderMedicalWarnings("review", reviewWarnings);
  applyConfirmationChildModeState();
}

function applyConfirmationChildModeState() {
  const childMode = isChildModeActive();
  const confirmTitle = document.querySelector(".screen--confirm .result-page__top h2");
  const confidenceBarWrap = document.querySelector(".screen--confirm .confidence-bar");

  if (confirmTitle) confirmTitle.textContent = childMode ? "Vamos revisar seu prato" : translate("analysis.confirmTitle");
  if (confidenceBadge) confidenceBadge.hidden = childMode;
  confidenceBarWrap?.classList.toggle("hide-in-child-mode", childMode);
  if (confidenceHint && childMode) confidenceHint.textContent = "Confira se os alimentos estão certos. Um responsável pode revisar depois.";
  if (addFoodBtn) addFoodBtn.textContent = childMode ? "Adicionar algo que faltou" : translate("analysis.addFood");
  if (confirmAnalysisBtn) confirmAnalysisBtn.textContent = childMode ? "Tudo certo" : translate("analysis.confirm");
  reanalyzeBtn?.classList.toggle("hide-in-child-mode", childMode);
}

function applyResultChildModeState() {
  const childMode = isChildModeActive();
  const special = Boolean(state.result?.specialResult);
  const resultTitle = document.querySelector(".screen--result .result-page__top h2");
  const nutritionTitle = document.querySelector(".nutrition h3");
  const nutritionRows = Array.from(document.querySelectorAll(".nutrition__row"));

  if (childReviewPrompt) childReviewPrompt.hidden = !childMode;
  if (resultTitle) resultTitle.textContent = childMode ? "Resultado estimado" : translate("result.title");
  if (nutritionTitle) nutritionTitle.textContent = childMode ? "Gordura da refei\u00e7\u00e3o" : translate("result.summary");
  nutritionRows.forEach((row, index) => row.classList.toggle("hide-in-child-mode", childMode && index > 0));
  resultTags?.classList.toggle("hide-in-child-mode", childMode);
  adjustBtn?.classList.toggle("hide-in-child-mode", childMode);

  if (!childMode) return;

  if (special) {
    resultDoseValue.textContent = state.result.specialResult.title;
    resultDoseCapsule.textContent = "Enzima estimada: 0";
    resultDoseNote.textContent = state.result.specialResult.supportingText;
    estimateText.textContent = state.result.specialResult.supportingText;
  } else {
    resultDoseCapsule.textContent = "Enzima estimada";
    resultDoseNote.textContent = "Um respons\u00e1vel deve conferir este resultado.";
    estimateText.textContent = "Esse resultado \u00e9 uma estimativa. Chame um respons\u00e1vel antes de usar.";
  }
  favoriteBtn.textContent = "Salvar refei\u00e7\u00e3o";
  explainBtn.textContent = "Ver explica\u00e7\u00e3o para respons\u00e1vel";
  confirmBtn.textContent = "Tudo certo";
  if (!special) {
    explainContent.innerHTML = `
      <div class="explain-summary explain-summary--child">
        <p><strong>1.</strong> Primeiro, somamos a gordura dos alimentos.</p>
        <p><strong>2.</strong> Depois, usamos a dose cadastrada pelo respons\u00e1vel.</p>
        <p><strong>3.</strong> Por fim, o app calcula quantas unidades da enzima seriam necess\u00e1rias.</p>
        <p>Esse resultado precisa ser conferido por um respons\u00e1vel.</p>
      </div>
    `;
  }
}
function renderResult() {
  calculateResult();
  const special = Boolean(state.result.specialResult);
  favoriteBtn.disabled = false;
  favoriteBtn.textContent = translate("result.saveFavorite");
  resultMealTitle.textContent = translateFoodLabel(state.analysis?.mealName || state.foods.slice(0, 3).map((food) => food.name).join(", ") || "Refei\u00e7\u00e3o analisada");
  resultTags.innerHTML = [state.analysis?.category, ...state.foods.slice(0, 3).map((food) => food.name)]
    .filter(Boolean)
    .map((item) => `<span>${escapeHtml(translateFoodLabel(item))}</span>`)
    .join("");
  resultFat.textContent = `${core.formatDecimal(state.result.totalFat, 1)}g`;
  resultProtein.textContent = `${core.formatDecimal(state.result.totalProtein, 1)}g`;
  resultCarbs.textContent = `${core.formatDecimal(state.result.totalCarbs, 1)}g`;
  doseCard.classList.toggle("capsule-card--no-enzyme", special);
  adjustBtn.hidden = special;

  if (special) {
    resultDoseValue.textContent = state.result.specialResult.title;
    resultDoseCapsule.textContent = "Enzima estimada: 0";
    resultDoseNote.textContent = state.result.specialResult.supportingText;
    estimateText.textContent = state.result.specialResult.supportingText;
  } else {
    resultDoseValue.textContent = getDoseValueText(state.selectedDose);
    resultDoseCapsule.textContent = getDoseText();
    resultDoseNote.textContent = state.selectedDose === state.result.capsules
      ? translate("result.estimatedNote")
      : translate("result.adjustedDoseNote", { dose: getDoseValueText(state.result.capsules) });
    estimateText.textContent = state.result.estimateText;
  }

  const existingWarning = document.querySelector(".consistency-note");
  if (existingWarning) existingWarning.remove();
  if (state.result.consistencyWarning) {
    const note = document.createElement("p");
    note.className = "consistency-note";
    note.textContent = translate("result.unusual");
    estimateText.parentElement.appendChild(note);
  }

  renderMedicalWarnings("result", resultWarnings);

  explainContent.innerHTML = special ? `
    <div class="explain-summary">
      <p>${translate("result.totalFat")}: <strong>${core.formatDecimal(state.result.totalFat, 1)}g</strong></p>
      <p>Enzima estimada: <strong>0</strong></p>
      <p>${escapeHtml(state.result.specialResult.supportingText)}</p>
    </div>
  ` : `
    ${state.result.explanation.map((item) => `
      <div class="explain-row">
        <strong>${escapeHtml(translateFoodLabel(item.name))}</strong>
        <span>${core.formatQuantity(item.grams)}</span>
        <small>${core.formatDecimal(item.fat, 1)}g ${translate("result.fat").toLowerCase()}</small>
      </div>
    `).join("")}
    <div class="explain-summary">
      <p>${translate("result.totalFat")}: <strong>${core.formatDecimal(state.result.totalFat, 1)}g</strong></p>
      <p>${translate("result.prescribedDose")}: <strong>${Number(state.patient.lipaseDose).toLocaleString("pt-BR")} U/g</strong></p>
      <p>${translate("result.medication")}: <strong>${escapeHtml(state.result.treatment?.medicationDisplayName || "Medicamento cadastrado")}</strong></p>
      <p>${translate("result.power")}: <strong>${Number(state.result.lipaseUnitsPerUnit).toLocaleString("pt-BR")} U por ${escapeHtml(state.result.unitLabel || "unidade")}</strong></p>
      <p>${translate("result.requiredLipase")}: <strong>${Number(state.result.lipaseUnits).toLocaleString("pt-BR")} U</strong></p>
      <p>${translate("result.calculation")}: <strong>${Number(state.result.unitsExact || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ${getUnitLabel(state.result.unitsExact || 0)}</strong></p>
      <p>${translate("result.estimatedUnits")}: <strong>${getDoseValueText(state.result.capsules)}</strong></p>
      <p>${translate("result.unitsInUse")}: <strong>${getDoseValueText(state.selectedDose)}</strong></p>
      <p>${translate("result.deliveredLipase")}: <strong>${Number(state.result.lipaseUnitsDelivered || 0).toLocaleString("pt-BR")} U</strong></p>
    </div>
  `;
  applyResultChildModeState();
}
function buildMealRecord() {
  const now = new Date();
  const treatment = state.result?.treatment || state.patient.treatment || core.getTreatment?.() || {};
  const country = window.PancreAICountryDatabase?.getCountryByCode?.(treatment.countryCode);
  const selectedLipaseUnitsDelivered = Number(state.selectedDose || 0) * Number(state.result?.lipaseUnitsPerUnit || treatment.lipaseUnitsPerUnit || 0);
  return {
    id: `meal-${now.getTime()}`,
    provider: state.result?.provider || state.analysis?.provider || "mock",
    providerLabel: state.result?.providerLabel || state.analysis?.providerLabel || "MockVision",
    isSimulated: state.result?.isSimulated !== false,
    mealId: state.simulatedMealId || state.analysis?.mealId || null,
    filename: state.simulatedFilename || state.photoFilename || state.analysis?.filename || null,
    captureSource: state.captureSource || null,
    name: state.analysis?.mealName || state.foods.slice(0, 3).map((food) => food.name).join(", ") || "Refeição analisada",
    category: state.analysis?.category || null,
    image: state.persistedPhoto,
    date: now.toLocaleDateString("pt-BR"),
    time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    createdAt: now.toISOString(),
    foods: cloneFoods(state.foods),
    detectedFoods: cloneFoods(state.detectedFoods),
    reviewedFoods: cloneFoods(state.foods),
    hiddenIngredientsAdded: state.hiddenSelections.filter((item) => item.selected).map((item) => ({ ...item })),
    finalFat: state.result.totalFat,
    finalResult: {
      lipaseUnits: state.result.lipaseUnits,
      capsules: state.selectedDose,
      suggestedCapsules: state.result.capsules,
      specialResult: state.result.specialResult || null
    },
    specialResult: state.result.specialResult || null,
    quantities: state.foods.map((food) => core.formatQuantity(food.grams)),
    totalFat: state.result.totalFat,
    totalProtein: state.result.totalProtein,
    totalCarbs: state.result.totalCarbs,
    totalCalories: state.result.totalCalories,
    lipaseUnits: state.result.lipaseUnits,
    capsules: state.selectedDose,
    suggestedCapsules: state.result.capsules,
    capsuleStrength: state.result.lipaseUnitsPerUnit || state.patient.capsuleStrength,
    countryCode: treatment.countryCode || null,
    countryName: country?.namePt || treatment.countryCode || null,
    medicationId: treatment.medicationId || null,
    medicationBrand: treatment.medicationBrand || null,
    medicationDisplayName: treatment.medicationDisplayName || null,
    medicationForm: treatment.medicationForm || null,
    medicationUnitLabel: treatment.unitLabel || state.result.unitLabel || "unidade",
    medicationVerificationLevel: treatment.verificationLevel || null,
    medicationSourceRefs: treatment.sourceRefs || [],
    lipaseUnitsPerUnit: state.result.lipaseUnitsPerUnit || treatment.lipaseUnitsPerUnit || null,
    amylaseUnitsPerUnit: treatment.amylaseUnitsPerUnit || null,
    proteaseUnitsPerUnit: treatment.proteaseUnitsPerUnit || null,
    prescribedUnitsPerGramFat: state.result.prescribedUnitsPerGramFat || state.patient.lipaseDose,
    weightKg: state.patient.weight,
    lipaseUnitsNeeded: state.result.lipaseUnitsNeeded || state.result.lipaseUnits,
    unitsExact: state.result.unitsExact,
    unitsRounded: state.result.unitsRounded || state.result.capsules,
    lipaseUnitsDelivered: selectedLipaseUnitsDelivered || state.result.lipaseUnitsDelivered,
    calculationSchemaVersion: state.result.calculationSchemaVersion || "treatment-v1",
    confidence: state.analysis.confidence,
    photoQuality: state.analysis.photoQuality,
    packaging: state.analysis.packaging,
    hiddenSelections: state.hiddenSelections.filter((item) => item.selected),
    changes: [...state.changes],
    addedItems: [...state.addedItems],
    removedItems: [...state.removedItems],
    reanalyses: state.reanalyses,
    consistencyWarning: state.result.consistencyWarning,
    safetyWarnings: state.result.safetyWarnings || [],
    calculationReliability: state.result.calculationReliability || null,
    hiddenFatContribution: state.result.hiddenFatContribution || 0,
    estimateText: state.result.estimateText,
    dose: state.selectedDose,
    fat: `${core.formatDecimal(state.result.totalFat, 1)}g`,
    protein: `${core.formatDecimal(state.result.totalProtein, 1)}g`,
    carbs: `${core.formatDecimal(state.result.totalCarbs, 1)}g`,
    tags: state.foods.slice(0, 4).map((food) => food.name)
  };
}

function finalizeAnalysis() {
  calculateResult();
  const record = buildMealRecord();
  (historyService || core).saveMealRecord(record);
  core.saveDraftMeal(record);
  setView("result");
  renderResult();
  polish?.showToast("Histórico atualizado");
}

function applyAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") {
    throw new Error("O serviço retornou uma análise inválida.");
  }
  const confidence = Number(analysis.confidence);
  state.analysis = {
    ...analysis,
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, Math.round(confidence))) : 50
  };
  state.detectedFoods = cloneFoods(Array.isArray(state.analysis.foods) ? state.analysis.foods : []);
  state.foods = cloneFoods(state.detectedFoods);
  state.unknownFood = state.analysis.unknownFood ? { ...state.analysis.unknownFood } : null;
  state.hiddenSelections = (Array.isArray(state.analysis.hiddenFats) ? state.analysis.hiddenFats : [])
    .map((item) => ({ ...item }));
  sessionStorage.removeItem("pancreaiSelectedDose");
}

function simulateAnalysis() {
  const simulation = simulator.simulateAnalysis(state.simulatedMealId);
  simulation.captureSource = state.captureSource;
  applyAnalysis(simulation);
}

function showAnalysisError(error) {
  const message = error?.message || "Tente novamente ou volte para escolher outra foto.";
  analysisTitle.textContent = "Não foi possível analisar esta imagem.";
  analysisMessage.textContent = message;
  progressFill.style.width = "0%";
  analysisErrorActions.hidden = false;
  analysisDemoBtn.hidden = !(simulator?.simulateAnalysis && captureService?.getSimulatedMealById);
  analysisSourceNote.hidden = analysisDemoBtn.hidden;
  analysisSourceNote.textContent = analysisDemoBtn.hidden
    ? ""
    : translate("analysis.demoSourceNote");
}

async function startDemoFallback() {
  const fallback = captureService?.getSimulatedMealById?.(state.simulatedMealId || null);
  if (!fallback) return;
  await showCapturePreview(fallback, "demo_fallback");
  await startAnalysis(null, { preserveCounters: true, useDemoFallback: true });
}

async function startAnalysis(file, options = {}) {
  const preserveCounters = Boolean(options.preserveCounters);
  const useDemoFallback = Boolean(options.useDemoFallback);
  if (!core.isSetupComplete()) {
    localStorage.setItem("pancreaiReturnTo", "home.html");
    window.location.href = "configuracao.html";
    return;
  }

  try {
    if (file) await setPhoto(file);
  } catch (error) {
    setView("analyzing");
    showAnalysisError(error);
    return;
  }

  if (!state.photoFile && !state.photoSrc) {
    setView("analyzing");
    showAnalysisError(new Error("Escolha uma foto antes de iniciar a análise."));
    return;
  }

  analysisAbortController?.abort();
  const controller = new AbortController();
  analysisAbortController = controller;
  const requestId = ++analysisRequestId;
  state.patient = core.getPatient();
  state.analysis = null;
  state.detectedFoods = [];
  state.foods = [];
  state.unknownFood = null;
  state.result = null;
  state.selectedDose = 0;
  if (!preserveCounters) {
    state.reanalyses = 0;
    state.changes = [];
    state.addedItems = [];
    state.removedItems = [];
  }

  setView("analyzing");
  clearAnalysisTimer();
  analysisErrorActions.hidden = true;
  analysisDemoBtn.hidden = true;
  analysisSourceNote.hidden = true;

  const quickChildFlow = isChildModeActive();
  const steps = useDemoFallback ? [
    "Preparando demonstração...",
    "Carregando exemplo...",
    "Preparando revisão..."
  ] : [
    "Analisando imagem...",
    "Identificando alimentos...",
    "Estimando porções...",
    "Conferindo possíveis ingredientes...",
    "Preparando revisão..."
  ];
  let progress = 8;
  let stepIndex = 0;
  analysisTitle.textContent = steps[0];
  analysisMessage.textContent = steps[Math.min(1, steps.length - 1)];
  progressFill.style.width = `${progress}%`;

  const tick = () => {
    if (requestId !== analysisRequestId || app.dataset.view !== "analyzing") return;
    progress = Math.min(progress + 7 + Math.random() * 9, 92);
    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    setAnalysisMessage(steps[stepIndex]);
    progressFill.style.width = `${progress}%`;
    if (progress < 92) {
      analysisTimerId = window.setTimeout(tick, quickChildFlow ? 320 : 520 + Math.random() * 220);
    }
  };
  analysisTimerId = window.setTimeout(tick, quickChildFlow ? 220 : 360);

  try {
    let analysis;
    if (useDemoFallback) {
      await new Promise((resolve) => window.setTimeout(resolve, quickChildFlow ? 320 : 620));
      if (requestId !== analysisRequestId) return;
      analysis = simulator.simulateAnalysis(state.simulatedMealId);
      analysis.captureSource = state.captureSource;
      analysis.fallbackReason = "explicit-demo";
    } else {
      if (!realRecognitionProvider?.isAvailable?.()) {
        throw new Error("O serviço de análise por IA não está disponível neste navegador.");
      }
      const imageReference = state.photoFile || {
        url: state.photoSrc,
        filename: state.photoFilename || state.simulatedFilename || "refeicao.jpg"
      };
      analysis = await realRecognitionProvider.analyze(imageReference, {
        locale: i18n?.getCurrentLanguage?.() || document.documentElement.lang || "pt-BR",
        credentials: "omit",
        signal: controller.signal
      });
    }

    if (requestId !== analysisRequestId) return;
    clearAnalysisTimer();
    applyAnalysis(analysis);
    progressFill.style.width = "100%";
    renderConfirmation();
    setView("confirm");
  } catch (error) {
    if (requestId !== analysisRequestId) return;
    clearAnalysisTimer();
    showAnalysisError(error);
  } finally {
    if (requestId === analysisRequestId) analysisAbortController = null;
  }
}

async function openCamera() {
  const operationId = ++cameraOperationId;
  stopLiveCamera();
  resetCameraUi();
  setView("camera");
  cameraStatus.textContent = "Iniciando câmera...";

  if (!realCaptureService?.startCamera || !cameraVideo) {
    cameraShell.dataset.cameraState = "error";
    setCameraMessage("Câmera indisponível. Toque no botão central para usar a câmera do dispositivo.");
    return;
  }

  try {
    const stream = await realCaptureService.startCamera();
    if (operationId !== cameraOperationId || app.dataset.view !== "camera") {
      realCaptureService.stopCamera(stream);
      return;
    }
    cameraStream = stream;
    cameraVideo.srcObject = stream;
    cameraVideo.hidden = false;
    cameraShell.dataset.cameraSource = "real";
    await cameraVideo.play();
    if (operationId !== cameraOperationId) return;
    cameraShell.dataset.cameraState = "ready";
    setCameraMessage(isChildModeActive() ? "Coloque o prato no centro" : "Posicione o prato no centro");
  } catch (error) {
    if (operationId !== cameraOperationId) return;
    stopLiveCamera();
    cameraShell.dataset.cameraState = "error";
    setCameraMessage(`${error?.message || "Câmera indisponível."} Toque no botão central para escolher uma foto.`);
  }
}

async function captureFromCamera() {
  if (captureBtn.disabled) return;
  if (!cameraStream || !cameraVideo || cameraVideo.readyState < 2) {
    cameraFileInput.value = "";
    cameraFileInput.click();
    return;
  }

  const operationId = ++cameraOperationId;
  captureBtn.disabled = true;
  cameraShell.classList.add("is-capturing", "has-captured-image");
  cameraShell.dataset.cameraState = "capturing";
  polish?.triggerSoftHaptic();
  setCameraMessage("Capturando...");

  try {
    const capturedFile = await realCaptureService.captureVideoFrame(cameraVideo);
    if (operationId !== cameraOperationId) return;
    await showRealCapturePreview(capturedFile, "camera_real");
    if (operationId !== cameraOperationId) return;
    stopLiveCamera();
  } catch (error) {
    if (operationId !== cameraOperationId) return;
    cameraShell.classList.remove("is-capturing", "has-captured-image");
    cameraShell.dataset.cameraState = "ready";
    captureBtn.disabled = false;
    setCameraMessage(error?.message || "Não foi possível capturar. Tente novamente.");
  }
}
function openPortionModal(index) {
  const food = state.foods[index];
  if (!food) return;
  pendingPortionIndex = index;
  const options = getPortionOptions(food);
  const current = getClosestPortion(food);
  portionTitle.textContent = `Quanto tinha de ${translateFoodLabel(food.name)}?`;
  portionOptions.innerHTML = options.map((option) => `
    <button class="portion-option${option.key === current.key ? " is-selected" : ""}" type="button" data-grams="${option.grams}" data-label="${option.label}">
      <strong>${option.label}</strong>
      <small>aprox. ${option.grams} g</small>
    </button>
  `).join("");
  openModal(portionModal);
}

function applyPortionChoice(grams, label) {
  const index = pendingPortionIndex;
  const food = state.foods[index];
  if (!food) return;
  const updated = buildFoodAtGrams(food, grams, label);
  if (!updated) return;

  core.registerFoodAdjustment(food.name, food.grams, grams);
  state.changes.push(`${food.name}: ${Math.round(food.grams)}g para ${Math.round(grams)}g (${label})`);
  state.foods[index] = updated;
  pendingPortionIndex = null;
  closeModal(portionModal);
  renderConfirmation();
  polish?.showToast("Quantidade atualizada");
}
function editFood(index) {
  const food = state.foods[index];
  if (!food) return;
  if (isChildModeActive() || food.portionOptions?.length) {
    openPortionModal(index);
    return;
  }

  const nextValue = window.prompt(`Editar quantidade de ${food.name} em gramas:`, String(Math.round(food.grams)));
  if (!nextValue) return;
  const grams = Number(String(nextValue).replace(",", "."));
  if (!Number.isFinite(grams) || grams <= 0) return;
  const updated = buildFoodAtGrams(food, grams, food.portionLabel);
  if (!updated) return;

  core.registerFoodAdjustment(food.name, food.grams, grams);
  state.changes.push(`${food.name}: ${Math.round(food.grams)}g para ${Math.round(grams)}g`);
  state.foods[index] = updated;
  renderConfirmation();
  polish?.highlight(confirmFoodList.querySelectorAll(".food-item")[index]);
  polish?.showToast("Altera\u00e7\u00e3o salva");
}
function removeFood(index, element) {
  const commitRemoval = () => {
    const [removed] = state.foods.splice(index, 1);
    if (!removed) {
      return;
    }
    state.removedItems.push(removed.name);
    state.changes.push(`${removed.name} removido da análise`);
    renderConfirmation();
    polish?.showToast("Alimento removido");
  };

  if (element && polish?.animateRemoveElement) {
    polish.animateRemoveElement(element, commitRemoval);
    return;
  }
  commitRemoval();
}

function openFoodSearch(target) {
  pendingFoodTarget = target;
  foodSearchInput.value = "";
  renderFoodSearchResults(simulator.searchFoods(""));
  openModal(foodSearchModal);
  foodSearchInput.focus();
}

function renderFoodSearchResults(results) {
  foodSearchResults.innerHTML = results.slice(0, 12).map((food) => `
    <button class="search-result" type="button" data-name="${food.name}">
      <strong>${escapeHtml(translateFoodLabel(food.name))}</strong>
      <small>${core.formatDecimal(food.fat, 1)}g ${translate("result.fat").toLowerCase()} / 100g</small>
    </button>
  `).join("");
}

function addFoodByName(foodName) {
  const source = simulator.nutritionalDatabase.find((item) => item.name === foodName);
  if (!source) {
    return;
  }
  let grams = getPortionOptions(source)[1]?.grams || 100;
  if (!isChildModeActive()) {
    const entered = window.prompt(`Quantidade de ${foodName} em gramas:`, "100");
    if (!entered) {
      return;
    }
    grams = Number(String(entered).replace(",", "."));
    if (!Number.isFinite(grams) || grams <= 0) {
      return;
    }
  }

  if (pendingFoodTarget === "replace-unknown") {
    state.unknownFood = null;
    state.changes.push(`Alimento não identificado substituído por ${foodName}`);
  }

  state.foods.push({
    name: source.name,
    grams,
    fat: Number((source.fat * grams / 100).toFixed(2)),
    protein: Number((source.protein * grams / 100).toFixed(2)),
    carbs: Number((source.carbs * grams / 100).toFixed(2)),
    calories: Number((source.calories * grams / 100).toFixed(2))
  });
  state.addedItems.push(source.name);
  closeModal(foodSearchModal);
  renderConfirmation();
  polish?.showToast("Alimento adicionado");
}

function handleUnknownFood(action) {
  if (action === "remove") {
    state.unknownFood = null;
    state.changes.push("Alimento não identificado removido");
    renderConfirmation();
    return;
  }
  openFoodSearch("replace-unknown");
}

function restoreDraftResult() {
  const draft = core.getDraftMeal();
  if (!draft || query.get("view") !== "result") return false;

  state.patient = core.getPatient();
  state.photoSrc = draft.image || "assets/prato.png";
  state.persistedPhoto = draft.image || "assets/prato.png";
  state.simulatedMealId = draft.mealId || null;
  state.simulatedFilename = draft.filename || null;
  state.captureSource = draft.captureSource || null;
  state.detectedFoods = cloneFoods(draft.detectedFoods || draft.foods || []);
  state.foods = cloneFoods(draft.reviewedFoods || draft.foods || []);
  state.hiddenSelections = (draft.hiddenSelections || draft.hiddenIngredientsAdded || []).map((item) => ({ ...item }));
  const draftPhotoQuality = draft.photoQuality || "Foto boa";
  const draftQualityLevel = typeof draftPhotoQuality === "object"
    ? String(draftPhotoQuality.level || "").toLowerCase()
    : "";
  const draftQualityLabel = typeof draftPhotoQuality === "object"
    ? draftPhotoQuality.label
    : draftPhotoQuality;
  state.analysis = {
    mealId: draft.mealId || null,
    filename: draft.filename || null,
    mealName: draft.name || "Refei\u00e7\u00e3o analisada",
    category: draft.category || null,
    confidence: draft.confidence || 85,
    photoQuality: draftPhotoQuality,
    packaging: draft.packaging || null,
    qualityWarning: draftQualityLevel ? ["medium", "low", "poor", "bad"].includes(draftQualityLevel) : !["Foto excelente", "Foto boa"].includes(draftQualityLabel),
    specialResult: draft.specialResult || draft.finalResult?.specialResult || null
  };
  state.reanalyses = draft.reanalyses || 0;
  state.changes = draft.changes || [];
  state.addedItems = draft.addedItems || [];
  state.removedItems = draft.removedItems || [];
  syncPhotoElements();
  const restoredDose = Number(draft.capsules ?? draft.dose ?? 0);
  sessionStorage.setItem("pancreaiSelectedDose", String(restoredDose));
  renderHiddenFats();
  calculateResult();
  state.selectedDose = restoredDose;
  setView("result");
  renderResult();
  return true;
}
analyzeBtn.addEventListener("click", openSheet);
if (favoritesBtn) {
  favoritesBtn.addEventListener("click", () => {
    window.location.href = "favoritos.html?from=home";
  });
}
if (tutorialBtn) {
  tutorialBtn.addEventListener("click", () => {
    window.location.href = isChildModeActive() ? "historico.html?from=home" : "tutorial.html?from=home";
  });
}
if (reportBtn) {
  reportBtn.addEventListener("click", () => {
    window.location.href = isChildModeActive() ? "profile.html?responsible=1" : "relatorio.html?from=home";
  });
}
overlayClose.addEventListener("click", closeSheet);
cancelBtn.addEventListener("click", closeSheet);
cameraBtn.addEventListener("click", () => {
  closeSheet();
  openCamera();
});
galleryBtn.addEventListener("click", openGallery);
deviceGalleryBtn.addEventListener("click", () => {
  galleryFileInput.value = "";
  galleryFileInput.click();
});
galleryFileInput.addEventListener("change", () => handleRealImageSelection(galleryFileInput, "gallery_upload"));
cameraFileInput.addEventListener("change", () => handleRealImageSelection(cameraFileInput, "camera_file"));
cameraCloseBtn.addEventListener("click", closeCamera);
cameraCancelBtn.addEventListener("click", closeCamera);
cameraSwitchBtn.addEventListener("click", openGallery);
captureBtn.addEventListener("click", captureFromCamera);
galleryBackBtn.addEventListener("click", () => setView("sheet"));
galleryPrevBtn.addEventListener("click", () => changeGalleryPage(-1));
galleryNextBtn.addEventListener("click", () => changeGalleryPage(1));
previewBackBtn.addEventListener("click", returnToCaptureSource);
retryPhotoBtn.addEventListener("click", returnToCaptureSource);
imageErrorBackBtn.addEventListener("click", returnToCaptureSource);
imageRetryBtn.addEventListener("click", retryPreviewImage);
usePhotoBtn.addEventListener("click", () => startAnalysis());
capturePreview.addEventListener("error", showPreviewImageError);
capturePreview.addEventListener("load", restorePreviewImage);
analysisRetryBtn.addEventListener("click", () => startAnalysis(null, { preserveCounters: true }));
analysisDemoBtn.addEventListener("click", startDemoFallback);
analysisBackBtn.addEventListener("click", returnToCaptureSource);

galleryGrid.addEventListener("error", (event) => {
  const image = event.target.closest("img");
  image?.closest(".gallery-item")?.classList.add("has-load-error");
}, true);

galleryGrid.addEventListener("click", (event) => {
  const item = event.target.closest("button[data-meal-id]");
  if (!item) return;
  if (item.classList.contains("has-load-error")) {
    const image = item.querySelector("img");
    item.classList.remove("has-load-error");
    image.src = `${image.src.split("?")[0]}?retry=${Date.now()}`;
    return;
  }
  const meal = captureService?.startSimulatedGallerySelection?.(item.dataset.mealId);
  if (!meal) return;
  item.classList.add("is-selecting");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  window.setTimeout(() => {
    item.classList.remove("is-selecting");
    void showCapturePreview(meal, "gallery_demo");
  }, reducedMotion ? 20 : 160);
});
confirmFoodList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }
  const index = Number(button.dataset.index || -1);
  if (button.dataset.action === "confirm") {
    const food = state.foods[index];
    if (!food) return;
    state.foods[index] = { ...food, confirmed: true };
    renderFoodList();
    polish?.showToast("Alimento confirmado");
    return;
  }  if (button.dataset.action === "edit") {
    editFood(index);
  }
  if (button.dataset.action === "remove") {
    removeFood(index, button.closest(".food-item"));
  }
});

unknownFoodCard.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-unknown-action]");
  if (!button) {
    return;
  }
  handleUnknownFood(button.dataset.unknownAction);
});

hiddenFatsPanel.addEventListener("change", (event) => {
  const row = event.target.closest(".hidden-fat-item");
  if (!row) return;
  const checkbox = row.querySelector("input[type='checkbox']");
  if (event.target.matches("select")) checkbox.checked = true;
  syncHiddenSelections();
});
addFoodBtn.addEventListener("click", () => {
  openFoodSearch("add");
});
foodSearchClose.addEventListener("click", () => closeModal(foodSearchModal));
foodSearchInput.addEventListener("input", () => {
  renderFoodSearchResults(simulator.searchFoods(foodSearchInput.value));
});

portionClose?.addEventListener("click", () => {
  pendingPortionIndex = null;
  closeModal(portionModal);
});

portionOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-grams]");
  if (!button) return;
  applyPortionChoice(Number(button.dataset.grams), button.dataset.label || "Médio");
});
foodSearchResults.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-name]");
  if (!button) {
    return;
  }
  addFoodByName(button.dataset.name);
});

confirmAnalysisBtn.addEventListener("click", finalizeAnalysis);
reanalyzeBtn.addEventListener("click", () => {
  state.reanalyses += 1;
  state.changes.push(`Nova captura solicitada (${state.reanalyses})`);
  returnToCaptureSource();
});

applyLearningBtn.addEventListener("click", () => {
  if (!state.suggestion) {
    return;
  }
  const targetIndex = state.foods.findIndex((food) => food.name === state.suggestion.foodName);
  if (targetIndex >= 0) {
    const food = state.foods[targetIndex];
    const nextGrams = food.grams + state.suggestion.delta;
    core.registerFoodAdjustment(food.name, food.grams, nextGrams);
    const source = simulator.nutritionalDatabase.find((item) => item.name === food.name);
    if (source) {
      state.foods[targetIndex] = {
        name: source.name,
        grams: nextGrams,
        fat: Number((source.fat * nextGrams / 100).toFixed(2)),
        protein: Number((source.protein * nextGrams / 100).toFixed(2)),
        carbs: Number((source.carbs * nextGrams / 100).toFixed(2)),
        calories: Number((source.calories * nextGrams / 100).toFixed(2))
      };
      state.changes.push(`${food.name}: ajuste sugerido aplicado (+${Math.round(state.suggestion.delta)}g)`);
      renderConfirmation();
    }
  }
  core.markLearningSuggestionShown(state.suggestion.foodName);
  learningCard.hidden = true;
});

dismissLearningBtn.addEventListener("click", () => {
  learningCard.hidden = true;
});

favoriteBtn.addEventListener("click", () => {
  polish?.playPopAnimation(favoriteBtn);
  const record = buildMealRecord();
  core.saveFavorite(record);
  favoriteBtn.textContent = translate("result.favoriteSaved");
  favoriteBtn.disabled = true;
  polish?.showToast(translate("result.favoriteSavedToast"));
});

confirmBtn.addEventListener("click", () => {
  core.clearDraftMeal();
  favoriteBtn.textContent = translate("result.saveFavorite");
  favoriteBtn.disabled = false;
  setView("home");
});

adjustBtn.addEventListener("click", () => {
  if (isChildModeActive()) {
    window.location.href = "profile.html?responsible=1";
    return;
  }
  core.saveDraftMeal(buildMealRecord());
  window.location.href = `adjust.html?suggested=${state.result.capsules}&current=${state.selectedDose}`;
});

explainBtn.addEventListener("click", () => {
  openModal(explainModal);
});
explainClose.addEventListener("click", () => closeModal(explainModal));

historyBtn.addEventListener("click", () => {
  window.location.href = "historico.html";
});
profileBtn.addEventListener("click", () => {
  window.location.href = "profile.html";
});

window.addEventListener("beforeunload", () => {
  cancelActiveAnalysis();
  stopLiveCamera();
  revokePhotoUrl();
  if (cameraCaptureTimerId) window.clearTimeout(cameraCaptureTimerId);
});

applyHomeCopy();
syncPhotoElements();
core.applyGlobalPreferences();
window.addEventListener("pancreai:childmodechange", () => {
  applyHomeCopy();
  if (app.dataset.view === "confirm") renderConfirmation();
  if (app.dataset.view === "result") renderResult();
});

if (!restoreDraftResult()) {
  setView("home");
}


