(function () {
  const ICONS = {
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z"></path>',
    camera: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2.1l1.3-2h4.2l1.3 2h2.1A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5Z"></path><circle cx="12" cy="12.5" r="3.4"></circle>',
    scan: '<path d="M8 4H6a2 2 0 0 0-2 2v2"></path><path d="M16 4h2a2 2 0 0 1 2 2v2"></path><path d="M20 16v2a2 2 0 0 1-2 2h-2"></path><path d="M4 16v2a2 2 0 0 0 2 2h2"></path><path d="M7 12h10"></path>',
    sparkles: '<path d="M12 3l1.3 4.1L17 9l-3.7 1.9L12 15l-1.3-4.1L7 9l3.7-1.9Z"></path><path d="M18.5 4.5v3"></path><path d="M17 6h3"></path><path d="M5.5 14.5v4"></path><path d="M3.5 16.5h4"></path>',
    history: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    heart: '<path d="m12 20-1.35-1.18C5.35 14.12 3 11.92 3 8.65A4.15 4.15 0 0 1 7.15 4.5c1.95 0 3.15 1.05 4.85 2.9 1.7-1.85 2.9-2.9 4.85-2.9A4.15 4.15 0 0 1 21 8.65c0 3.27-2.35 5.47-7.65 10.17Z"></path>',
    settings: '<circle cx="12" cy="12" r="3.2"></circle><path d="M19.4 15a1.6 1.6 0 0 0 .32 1.76l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15.13 19.3a1.6 1.6 0 0 0-.96 1.47V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.5 1.6 1.6 0 0 0-1.76.32l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.75 15.1 1.6 1.6 0 0 0 3.25 14H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1.05 1.6 1.6 0 0 0-.32-1.76l-.06-.06A2 2 0 0 1 7.05 4.3l.06.06a1.6 1.6 0 0 0 1.76.32A1.6 1.6 0 0 0 9.83 3.2V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 .96 1.47 1.6 1.6 0 0 0 1.76-.32l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.05 8.9 1.6 1.6 0 0 0 20.55 10H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"></path>',
    profile: '<circle cx="12" cy="8" r="3"></circle><path d="M6.5 20a5.5 5.5 0 0 1 11 0"></path>',
    book: '<path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h13v17H7a2.5 2.5 0 0 0-2.5 2Z"></path><path d="M4.5 5.5V22"></path><path d="M8 7h7"></path><path d="M8 11h7"></path>',
    child: '<circle cx="12" cy="12" r="8"></circle><path d="M9 11h.01"></path><path d="M15 11h.01"></path><path d="M9.5 15a4 4 0 0 0 5 0"></path><path d="M16.5 6.5 18 5"></path>',
    weight: '<path d="M5 7h14l1.5 12h-17Z"></path><path d="M9.5 10a2.5 2.5 0 0 1 5 0"></path><path d="M12 10v4"></path>',
    lipase: '<path d="M4 13h4l2-6 4 12 2-6h4"></path>',
    creon: '<path d="m8.5 6.5 9 9"></path><path d="M8.5 17.5a4.2 4.2 0 0 1 0-6l3-3a4.2 4.2 0 0 1 6 6l-3 3a4.2 4.2 0 0 1-6 0Z"></path>',
    capsule: '<path d="m8.5 6.5 9 9"></path><path d="M8.5 17.5a4.2 4.2 0 0 1 0-6l3-3a4.2 4.2 0 0 1 6 6l-3 3a4.2 4.2 0 0 1-6 0Z"></path>',
    calculator: '<rect x="6" y="3" width="12" height="18" rx="2"></rect><path d="M9 8h6"></path><path d="M9 12h2"></path><path d="M13 12h2"></path><path d="M9 16h2"></path><path d="M13 16h2"></path>',
    food: '<path d="M8 3v18"></path><path d="M5 3v6a3 3 0 0 0 6 0V3"></path><path d="M16 3v18"></path><path d="M19 3v18"></path>',
    add: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    remove: '<path d="M5 12h14"></path>',
    edit: '<path d="m4 20 4.4-1 9.1-9.1-3.4-3.4L5 15.6Z"></path><path d="m13.5 7 3.5 3.5"></path>',
    search: '<circle cx="11" cy="11" r="6"></circle><path d="m20 20-4-4"></path>',
    check: '<path d="m5 13 4 4L19 7"></path>',
    close: '<path d="M6 6l12 12"></path><path d="M18 6 6 18"></path>',
    save: '<path d="M5 4h11l3 3v13H5Z"></path><path d="M9 4v5h6V4"></path><path d="M9 20v-6h6v6"></path>',
    share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.7 6.8-4.1"></path><path d="m8.6 13.3 6.8 4.1"></path>',
    pdf: '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M14 3v5h5"></path><path d="M9 13h6"></path><path d="M9 17h4"></path>',
    download: '<path d="M12 4v10"></path><path d="m8 10 4 4 4-4"></path><path d="M5 20h14"></path>',
    upload: '<path d="M12 20V10"></path><path d="m8 14 4-4 4 4"></path><path d="M5 4h14"></path>',
    sync: '<path d="M20 7v5h-5"></path><path d="M4 17v-5h5"></path><path d="M18.3 10A6.5 6.5 0 0 0 7 6"></path><path d="M5.7 14A6.5 6.5 0 0 0 17 18"></path>',
    export: '<path d="M7 7h10"></path><path d="M13 3l4 4-4 4"></path><path d="M17 17H7"></path><path d="M11 21l-4-4 4-4"></path>',
    import: '<path d="M17 7H7"></path><path d="M11 3 7 7l4 4"></path><path d="M7 17h10"></path><path d="m13 13 4 4-4 4"></path>',
    stats: '<path d="M5 19v-5"></path><path d="M12 19V5"></path><path d="M19 19v-9"></path>',
    chart: '<path d="M12 3v9h9"></path><path d="M21 12a9 9 0 1 1-9-9"></path>',
    globe: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3c3 3.5 3 14.5 0 18"></path><path d="M12 3c-3 3.5-3 14.5 0 18"></path>',
    info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 10v6"></path><path d="M12 7h.01"></path>',
    warning: '<path d="M12 4 3 20h18Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    error: '<circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16h.01"></path>',
    success: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.6 2.6L16 9"></path>',
    photoBad: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M4 4l16 16"></path><path d="m8 15 2-2 2 2 3-4 3 4"></path>',
    photoGood: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="m8 15 2-2 2 2 3-4 3 4"></path><path d="M9 9h.01"></path>',
    ai: '<path d="M12 3v3"></path><path d="M12 18v3"></path><path d="M4.5 8.5h3"></path><path d="M16.5 8.5h3"></path><path d="M4.5 15.5h3"></path><path d="M16.5 15.5h3"></path><path d="M8 8.5a4 4 0 1 1 8 0v7a4 4 0 1 1-8 0Z"></path><path d="M10 10h4"></path><path d="M10 14h4"></path>',
    confidence: '<path d="M12 3 5 6v5c0 4.6 2.7 8.8 7 10 4.3-1.2 7-5.4 7-10V6Z"></path><path d="m9.5 12 1.8 1.8L15 10"></path>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"></ellipse><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"></path><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>',
    oil: '<path d="M12 3c3.2 3 5 5.5 5 8.6A5 5 0 1 1 7 11.6C7 8.5 8.8 6 12 3Z"></path>',
    calories: '<path d="M13 2c.5 3-2 4.5-2 7 0 1.2.8 2 2 2 1.7 0 3-1.5 3-3 2 2 3 4.1 3 6.3a7 7 0 1 1-14 0c0-3.2 2-5.5 5-8.3-.2 2.2.8 3.4 2 4"></path>',
    protein: '<path d="M7 17c0-5 10-5 10-10a4 4 0 1 0-8 0"></path><path d="M7 17a4 4 0 1 0 8 0"></path>',
    carbs: '<path d="M6 18c5-1 8-6 10-12"></path><path d="M8 9c-1.2-.8-2.4-1.2-4-1"></path><path d="M10 12c-1.3-.9-2.7-1.4-4.5-1.4"></path><path d="M12 15c-1.5-1-3-1.5-5-1.5"></path><path d="M14 10c1.1-.9 2.3-1.4 4-1.7"></path><path d="M12 13c1.2-.9 2.7-1.4 4.5-1.6"></path><path d="M10 16c1.5-.9 3-1.4 5-1.4"></path>',
    fat: '<path d="M12 3c2.8 2.8 5 5.4 5 8.9A5 5 0 1 1 7 11.9C7 8.4 9.2 5.8 12 3Z"></path>',
    report: '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M14 3v5h5"></path><path d="M9 17v-3"></path><path d="M12 17v-5"></path><path d="M15 17v-2"></path>',
    security: '<path d="M12 3 5 6v5c0 4.6 2.7 8.8 7 10 4.3-1.2 7-5.4 7-10V6Z"></path><path d="m9.5 12 1.8 1.8L15 10"></path>',
    reanalyze: '<path d="M18 8a6 6 0 1 0 1 6"></path><path d="M18 4v4h-4"></path>',
    date: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path>',
    time: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    filter: '<path d="M4 6h16l-6.5 7v5l-3 2v-7Z"></path>',
    menu: '<path d="M5 7h14"></path><path d="M5 12h14"></path><path d="M5 17h14"></path>',
    back: '<path d="m15 18-6-6 6-6"></path>',
    next: '<path d="m9 18 6-6-6-6"></path>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0v3.5c0 .8-.3 1.6-.9 2.2L4 15h16l-1.1-1.3a3.3 3.3 0 0 1-.9-2.2Z"></path><path d="M14 18a2 2 0 0 1-4 0"></path>'
  };

  function toKebab(value) {
    return String(value).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  function createSvg(name) {
    const paths = ICONS[name];
    if (!paths) {
      return null;
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `app-icon app-icon--${toKebab(name)}`);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = paths;
    return svg;
  }

  function mount(root = document) {
    root.querySelectorAll("[data-pa-icon]").forEach((target) => {
      const icon = createSvg(target.dataset.paIcon);
      if (!icon) {
        return;
      }

      const existing = target.matches("svg") ? target : target.querySelector("svg.app-icon");
      if (existing) {
        existing.replaceWith(icon);
      } else {
        target.prepend(icon);
      }
      target.classList.add("pa-icon-mounted");
    });
  }

  window.PancreAIIcons = { mount };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount());
  } else {
    mount();
  }
})();
