const track = document.querySelector("#tutorialTrack");
const carousel = document.querySelector("#carousel");
const slides = Array.from(document.querySelectorAll(".tutorial-slide"));
const dotsContainer = document.querySelector("#tutorialDots");
const footer = document.querySelector("#tutorialFooter");
const profileBackBtn = document.querySelector("#profileBackBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

const pageQuery = new URLSearchParams(window.location.search);
const profileTarget = pageQuery.get("from") === "home" ? "home.html" : "profile.html";
const finishTargetLabel = profileTarget === "home.html" ? "Voltar para a home" : "Voltar para o perfil";
let currentIndex = 0;
let dragStartX = 0;
let dragStartY = 0;
let dragDeltaX = 0;
let dragging = false;
let horizontalDrag = false;

const dots = slides.map((_, index) => {
  const dot = document.createElement("button");
  dot.className = "dot-btn";
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir para página ${index + 1}`);
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
  return dot;
});

function goToProfile() {
  window.location.href = profileTarget;
}

function updateSlideState() {
  track.style.setProperty("--slide-index", currentIndex);
  footer.classList.toggle("is-first", currentIndex === 0);

  slides.forEach((slide, index) => {
    const active = index === currentIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });

  dots.forEach((dot, index) => {
    const active = index === currentIndex;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "step" : "false");
  });

  nextBtn.textContent = currentIndex === slides.length - 1 ? "Começar" : "Próximo";
  nextBtn.setAttribute("aria-label", currentIndex === slides.length - 1 ? finishTargetLabel : "Próxima página");
  window.PancreAIProgressDots?.scheduleRefresh?.(dotsContainer);
}

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  updateSlideState();
}

function goNext() {
  if (currentIndex === slides.length - 1) {
    goToProfile();
    return;
  }
  goToSlide(currentIndex + 1);
}

function goPrevious() {
  goToSlide(currentIndex - 1);
}

function resetDrag() {
  dragging = false;
  horizontalDrag = false;
  dragDeltaX = 0;
  carousel.classList.remove("is-dragging");
  track.style.transform = "";
}

function handlePointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  dragging = true;
  horizontalDrag = false;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragDeltaX = 0;
  carousel.classList.add("is-dragging");
  carousel.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event) {
  if (!dragging) return;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;

  if (!horizontalDrag && Math.abs(deltaX) > 8) {
    horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
  }

  if (!horizontalDrag) return;

  dragDeltaX = deltaX;
  const width = carousel.clientWidth || 1;
  const edgeResistance = (currentIndex === 0 && deltaX > 0) || (currentIndex === slides.length - 1 && deltaX < 0) ? 0.28 : 1;
  const dragPercent = (deltaX * edgeResistance / width) * 100;
  track.style.transform = `translate3d(calc(${currentIndex * -100}% + ${dragPercent}%), 0, 0)`;
}

function handlePointerUp() {
  if (!dragging) return;

  const width = carousel.clientWidth || 1;
  const threshold = Math.min(86, width * 0.18);
  const shouldMove = Math.abs(dragDeltaX) > threshold;

  if (shouldMove && dragDeltaX < 0) {
    goToSlide(currentIndex + 1);
  } else if (shouldMove && dragDeltaX > 0) {
    goToSlide(currentIndex - 1);
  }

  resetDrag();
}

profileBackBtn.addEventListener("click", goToProfile);
prevBtn.addEventListener("click", goPrevious);
nextBtn.addEventListener("click", goNext);

carousel.addEventListener("pointerdown", handlePointerDown);
carousel.addEventListener("pointermove", handlePointerMove);
carousel.addEventListener("pointerup", handlePointerUp);
carousel.addEventListener("pointercancel", resetDrag);
carousel.addEventListener("lostpointercapture", handlePointerUp);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goNext();
  if (event.key === "ArrowLeft") goPrevious();
  if (event.key === "Escape") goToProfile();
});

updateSlideState();
window.PancreAICore?.applyGlobalPreferences?.();