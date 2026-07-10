const childModeDemo = document.querySelector('#childModeDemo');
const toggleChildModeBtn = document.querySelector('#toggleChildMode');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');

function syncChildModeButton() {
  if (!childModeDemo || !toggleChildModeBtn) {
    return;
  }

  const enabled = childModeDemo.dataset.child === 'true';
  toggleChildModeBtn.textContent = enabled ? 'Voltar para versao padrao' : 'Ativar versao infantil';
}

function toggleChildMode() {
  if (!childModeDemo) {
    return;
  }

  childModeDemo.dataset.child = childModeDemo.dataset.child === 'true' ? 'false' : 'true';
  syncChildModeButton();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  modal.style.display = 'block';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  modal.style.display = 'none';
}

if (toggleChildModeBtn) {
  toggleChildModeBtn.addEventListener('click', toggleChildMode);
  syncChildModeButton();
}

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.openModal));
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.dataset.closeModal));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  document.querySelectorAll('[id][style*="display: block"]').forEach((modal) => {
    modal.style.display = 'none';
  });
});
