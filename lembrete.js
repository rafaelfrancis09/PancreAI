const backBtn = document.querySelector("#backBtn");
const homeNav = document.querySelector("#homeNav");
const historyNav = document.querySelector("#historyNav");
const profileNav = document.querySelector("#profileNav");
const reminderList = document.querySelector("#reminderList");
const addReminderBtn = document.querySelector("#addReminderBtn");

const STORAGE_KEY = "pancreaiMealReminders";
const STORAGE_TOUCHED_KEY = "pancreaiMealRemindersCustomized";
const MAX_REMINDERS = 7;
const i18n = window.PancreAII18n;
const LEGACY_KEYS = {
  breakfast: "pancreaiBreakfastReminder",
  lunch: "pancreaiLunchReminder",
  dinner: "pancreaiDinnerReminder"
};

const DEFAULT_REMINDERS = [
  { id: "breakfast", label: "Café da manhã", time: "07:30", enabled: false, isDefault: true },
  { id: "lunch", label: "Almoço", time: "12:00", enabled: false, isDefault: true },
  { id: "dinner", label: "Jantar", time: "19:30", enabled: false, isDefault: true }
];

function translateText(text) {
  return i18n?.translatePhrase?.(text) || text;
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function normalizeReminder(reminder, index) {
  const fallback = DEFAULT_REMINDERS[index] || {};
  const label = String(reminder?.label || fallback.label || "Novo horário").trim();
  const time = /^\d{2}:\d{2}$/.test(reminder?.time || "") ? reminder.time : fallback.time || "15:00";

  return {
    id: String(reminder?.id || `reminder-${Date.now()}-${index}`),
    label,
    time,
    enabled: Boolean(reminder?.enabled),
    isDefault: Boolean(reminder?.isDefault)
  };
}

function getLegacyDefaultReminders() {
  return DEFAULT_REMINDERS.map((reminder) => {
    const legacyValue = localStorage.getItem(LEGACY_KEYS[reminder.id]);
    return {
      ...reminder,
      enabled: legacyValue === "true"
    };
  });
}

function loadReminders() {
  const hasSavedList = localStorage.getItem(STORAGE_KEY) !== null || localStorage.getItem(STORAGE_TOUCHED_KEY) === "true";
  const stored = readJson(STORAGE_KEY, []);
  const source = hasSavedList && Array.isArray(stored) ? stored : getLegacyDefaultReminders();
  const normalized = source
    .map(normalizeReminder)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, MAX_REMINDERS);

  if (hasSavedList && Array.isArray(stored) && stored.length !== normalized.length) {
    localStorage.setItem(STORAGE_TOUCHED_KEY, "true");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

let reminders = loadReminders();

function saveReminders() {
  reminders = reminders
    .map(normalizeReminder)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, MAX_REMINDERS);
  localStorage.setItem(STORAGE_TOUCHED_KEY, "true");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function createReminder() {
  const suggestions = ["10:00", "15:30", "21:00"];
  const usedTimes = new Set(reminders.map((reminder) => reminder.time));
  const time = suggestions.find((item) => !usedTimes.has(item)) || "15:00";

  return {
    id: `custom-${Date.now()}`,
    label: "Novo horário",
    time,
    enabled: true,
    isDefault: false
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderReminder(reminder) {
  const removable = true;
  const label = escapeHtml(reminder.label);

  return `
    <article class="reminder-card" data-id="${reminder.id}">
      <div class="reminder-card__main">
        <span class="reminder-card__icon" data-pa-icon="time" aria-hidden="true">
          <svg class="app-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
        </span>
        <div class="reminder-card__fields">
          <label class="reminder-field">
            <span>Nome</span>
            <input class="reminder-name" type="text" value="${label}" maxlength="28" data-field="label" aria-label="Nome do lembrete" />
          </label>
          <label class="reminder-field">
            <span>Hor\u00e1rio</span>
            <input class="reminder-time" type="time" value="${reminder.time}" data-field="time" aria-label="Hor\u00e1rio do lembrete" />
          </label>
        </div>
        <div class="reminder-card__tools">
          <label class="switch" aria-label="Ativar ${label}">
            <input type="checkbox" data-field="enabled" ${reminder.enabled ? "checked" : ""} />
            <span class="switch__track"></span>
          </label>
          <button class="remove-reminder-btn" data-pa-icon="close" data-action="remove" type="button" aria-label="Remover ${label}" ${removable ? "" : "hidden"}>
            <svg class="app-icon" viewBox="0 0 24 24"><path d="M6 6l12 12"></path><path d="M18 6 6 18"></path></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}
function renderReminders(focusId = null) {
  reminderList.innerHTML = reminders.map(renderReminder).join("");
  window.PancreAIIcons?.mount(reminderList);

  if (focusId) {
    const input = reminderList.querySelector(`[data-id="${focusId}"] .reminder-name`);
    input?.focus();
    input?.select();
  }
}

function findReminderFromEvent(event) {
  const card = event.target.closest(".reminder-card");
  if (!card) {
    return null;
  }
  return reminders.find((reminder) => reminder.id === card.dataset.id) || null;
}

function updateReminder(event) {
  const reminder = findReminderFromEvent(event);
  if (!reminder) {
    return;
  }

  const field = event.target.dataset.field;
  if (field === "label") {
    reminder.label = event.target.value.trim() || "Novo horário";
  }
  if (field === "time" && event.target.value) {
    reminder.time = event.target.value;
  }
  if (field === "enabled") {
    reminder.enabled = event.target.checked;
  }

  saveReminders();
}

reminderList.addEventListener("input", (event) => {
  if (event.target.matches(".reminder-name")) {
    updateReminder(event);
  }
});

reminderList.addEventListener("change", (event) => {
  if (event.target.matches(".reminder-time, input[type='checkbox']")) {
    updateReminder(event);
    if (event.target.matches(".reminder-time")) {
      renderReminders();
    }
  }
});

reminderList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='remove']");
  if (!button) {
    return;
  }

  const reminder = findReminderFromEvent(event);
  if (!reminder) {
    return;
  }
  reminders = reminders.filter((item) => item.id !== reminder.id);
  saveReminders();
  renderReminders();
});

addReminderBtn.addEventListener("click", () => {
  if (reminders.length >= MAX_REMINDERS) {
    updateAddButtonState();
    return;
  }

  const reminder = createReminder();
  reminders.push(reminder);
  saveReminders();
  renderReminders(reminder.id);
});

backBtn.addEventListener("click", () => {
  window.location.href = "profile.html";
});

homeNav.addEventListener("click", () => {
  window.location.href = "home.html";
});

historyNav.addEventListener("click", () => {
  window.location.href = "historico.html";
});

profileNav.addEventListener("click", () => {
  window.location.href = "profile.html";
});

renderReminders();
