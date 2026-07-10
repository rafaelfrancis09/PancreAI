const page1 = document.querySelector(".screen--page-1");
const page2 = document.querySelector(".screen--page-2");
const backBtn = document.querySelector("#backBtn");
const backBtn2 = document.querySelector("#backBtn2");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");

function goProfile() {
  window.location.href = "profile.html";
}

function showPage(page) {
  const showFirstPage = page === 1;
  page1.classList.toggle("hidden", !showFirstPage);
  page2.classList.toggle("hidden", showFirstPage);
  page1.toggleAttribute("hidden", !showFirstPage);
  page2.toggleAttribute("hidden", showFirstPage);
}

backBtn.addEventListener("click", goProfile);
backBtn2.addEventListener("click", goProfile);
nextBtn.addEventListener("click", () => showPage(2));
prevBtn.addEventListener("click", () => showPage(1));

showPage(page1.classList.contains("hidden") ? 2 : 1);
