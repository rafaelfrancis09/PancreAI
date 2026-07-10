(function () {
  const NS = "http://www.w3.org/2000/svg";
  const FLAG_CODES = new Set([
    "BR", "US", "GB", "CA", "AU", "ES", "FR", "DE", "IT", "RU", "PL", "TR", "NL", "SA",
    "CN", "IN", "BD", "JP", "KR", "GR", "SE", "NO", "DK", "FI", "CZ", "RO", "UA", "IL",
    "EU", "GLOBE", "OTHER"
  ]);

  function svgMarkup(code) {
    const normalized = normalizeCode(code);
    const content = flagContent(normalized);
    return `
      <svg class="flag-icon flag-icon--${normalized.toLowerCase()}" viewBox="0 0 48 32" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="flagClip${normalized}">
            <rect width="48" height="32" rx="4" ry="4"></rect>
          </clipPath>
        </defs>
        <rect width="48" height="32" rx="4" fill="#ffffff"></rect>
        <g clip-path="url(#flagClip${normalized})">${content}</g>
        <rect width="48" height="32" rx="4" fill="none" stroke="rgba(28, 49, 38, .08)"></rect>
      </svg>
    `.trim();
  }

  function normalizeCode(code) {
    const normalized = String(code || "GLOBE").trim().toUpperCase();
    if (normalized === "OTHER") return "GLOBE";
    return FLAG_CODES.has(normalized) ? normalized : "GLOBE";
  }

  function rect(x, y, width, height, fill) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"></rect>`;
  }

  function circle(cx, cy, r, fill) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"></circle>`;
  }

  function stripe(colors) {
    const height = 32 / colors.length;
    return colors.map((color, index) => rect(0, height * index, 48, height, color)).join("");
  }

  function vertical(colors) {
    const width = 48 / colors.length;
    return colors.map((color, index) => rect(width * index, 0, width, 32, color)).join("");
  }

  function cross(bg, crossColor, accentColor) {
    return [
      rect(0, 0, 48, 32, bg),
      rect(19, 0, 10, 32, crossColor),
      rect(0, 11, 48, 10, crossColor),
      accentColor ? rect(22, 0, 4, 32, accentColor) : "",
      accentColor ? rect(0, 14, 48, 4, accentColor) : ""
    ].join("");
  }

  function nordic(bg, white, accent) {
    return [
      rect(0, 0, 48, 32, bg),
      rect(14, 0, 8, 32, white),
      rect(0, 12, 48, 8, white),
      rect(16, 0, 4, 32, accent),
      rect(0, 14, 48, 4, accent)
    ].join("");
  }

  function flagContent(code) {
    switch (code) {
      case "BR":
        return `${rect(0, 0, 48, 32, "#099343")}<path d="M24 5 43 16 24 27 5 16Z" fill="#ffd34d"></path>${circle(24, 16, 7.2, "#1764ad")}`;
      case "US":
        return `${stripe(["#b91c2c", "#fff", "#b91c2c", "#fff", "#b91c2c", "#fff", "#b91c2c"])}${rect(0, 0, 20, 18, "#244a87")}`;
      case "GB":
        return `${rect(0, 0, 48, 32, "#123a78")}<path d="M0 0 48 32M48 0 0 32" stroke="#fff" stroke-width="7"></path><path d="M0 0 48 32M48 0 0 32" stroke="#d71920" stroke-width="3"></path>${rect(19, 0, 10, 32, "#fff")}${rect(0, 11, 48, 10, "#fff")}${rect(22, 0, 4, 32, "#d71920")}${rect(0, 14, 48, 4, "#d71920")}`;
      case "CA":
        return `${vertical(["#d71920", "#fff", "#d71920"])}<path d="M24 8 27 15 33 13 29 18 31 24 24 21 17 24 19 18 15 13 21 15Z" fill="#d71920"></path>`;
      case "AU":
        return `${rect(0, 0, 48, 32, "#1f4e8c")}${circle(35, 21, 4.5, "#fff")}${circle(35, 21, 2.5, "#ffd84d")}${rect(0, 0, 22, 15, "#f6f9ff")}${rect(8.5, 0, 5, 15, "#d71920")}${rect(0, 5, 22, 5, "#d71920")}`;
      case "ES":
        return stripe(["#c60b1e", "#ffc400", "#ffc400", "#c60b1e"]);
      case "FR":
        return vertical(["#1f4e9a", "#fff", "#ed2939"]);
      case "DE":
        return stripe(["#000", "#dd0000", "#ffce00"]);
      case "IT":
        return vertical(["#009246", "#fff", "#ce2b37"]);
      case "RU":
        return stripe(["#fff", "#2f6db5", "#d52b1e"]);
      case "PL":
        return stripe(["#fff", "#fff", "#dc143c", "#dc143c"]);
      case "TR":
        return `${rect(0, 0, 48, 32, "#e30a17")}${circle(20, 16, 8, "#fff")}${circle(23, 16, 6.5, "#e30a17")}<path d="M30 12.5 31.5 15.2 34.5 14.6 32.5 17 34 19.8 31.1 18.6 29 21 29.2 17.8 26.3 16.5 29.4 15.7Z" fill="#fff"></path>`;
      case "NL":
        return stripe(["#ae1c28", "#fff", "#21468b"]);
      case "SA":
        return `${rect(0, 0, 48, 32, "#006c35")}${rect(12, 15, 24, 2.5, "#fff")}<path d="M14 12h20" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>`;
      case "CN":
        return `${rect(0, 0, 48, 32, "#de2910")}<path d="M12 7 14 12 19 12 15 15 17 20 12 17 7 20 9 15 5 12 10 12Z" fill="#ffde00"></path>${circle(25, 8, 1.5, "#ffde00")}${circle(31, 12, 1.5, "#ffde00")}${circle(31, 20, 1.5, "#ffde00")}`;
      case "IN":
        return `${stripe(["#ff9933", "#fff", "#138808"])}${circle(24, 16, 3.2, "none")}<circle cx="24" cy="16" r="3.2" fill="none" stroke="#1a4aa2" stroke-width="1.4"></circle>`;
      case "BD":
        return `${rect(0, 0, 48, 32, "#006a4e")}${circle(23, 16, 8, "#f42a41")}`;
      case "JP":
        return `${rect(0, 0, 48, 32, "#fff")}${circle(24, 16, 8, "#bc002d")}`;
      case "KR":
        return `${rect(0, 0, 48, 32, "#fff")}${circle(24, 16, 6, "#cd2e3a")}<path d="M18 16a6 6 0 0 0 12 0c-3 2-6 2-12 0Z" fill="#0047a0"></path><path d="M9 8h8M9 12h8M31 20h8M31 24h8" stroke="#263849" stroke-width="1.8" stroke-linecap="round"></path>`;
      case "GR":
        return `${stripe(["#0d5eaf", "#fff", "#0d5eaf", "#fff", "#0d5eaf", "#fff", "#0d5eaf", "#fff", "#0d5eaf"])}${rect(0, 0, 18, 18, "#0d5eaf")}${rect(7, 0, 4, 18, "#fff")}${rect(0, 7, 18, 4, "#fff")}`;
      case "SE":
        return nordic("#006aa7", "#fecc00", "#fecc00");
      case "NO":
        return nordic("#ba0c2f", "#fff", "#00205b");
      case "DK":
        return nordic("#c60c30", "#fff", "#fff");
      case "FI":
        return nordic("#fff", "#003580", "#003580");
      case "CZ":
        return `${stripe(["#fff", "#fff", "#d7141a", "#d7141a"])}<path d="M0 0 24 16 0 32Z" fill="#11457e"></path>`;
      case "RO":
        return vertical(["#002b7f", "#fcd116", "#ce1126"]);
      case "UA":
        return stripe(["#0057b7", "#0057b7", "#ffd700", "#ffd700"]);
      case "IL":
        return `${rect(0, 0, 48, 32, "#fff")}${rect(0, 5, 48, 3, "#005eb8")}${rect(0, 24, 48, 3, "#005eb8")}<path d="M24 10 30 21H18Z M24 22 18 11H30Z" fill="none" stroke="#005eb8" stroke-width="1.7" stroke-linejoin="round"></path>`;
      case "EU":
        return `${rect(0, 0, 48, 32, "#244aa5")}${Array.from({ length: 10 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 10;
          return circle(24 + Math.cos(angle) * 9, 16 + Math.sin(angle) * 6, 1.2, "#ffd84d");
        }).join("")}`;
      case "GLOBE":
      default:
        return `${rect(0, 0, 48, 32, "#eef8f2")}<circle cx="24" cy="16" r="10" fill="none" stroke="#0a9f73" stroke-width="2"></circle><path d="M14 16h20M24 6c4 5 4 15 0 20M24 6c-4 5-4 15 0 20" stroke="#0a9f73" stroke-width="1.7" stroke-linecap="round" fill="none"></path>`;
    }
  }

  function create(countryCode, size) {
    const template = document.createElement("template");
    template.innerHTML = svgMarkup(countryCode);
    const svg = template.content.firstElementChild;
    const pixelSize = Number(size || 32);
    svg.setAttribute("width", String(pixelSize));
    svg.setAttribute("height", String(Math.round(pixelSize * 2 / 3)));
    return svg;
  }

  function mount(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-flag-code]").forEach((target) => {
      const size = Number(target.dataset.flagSize || 32);
      target.innerHTML = "";
      target.appendChild(create(target.dataset.flagCode, size));
    });
  }

  window.PancreAIFlags = {
    getFlagSvg: svgMarkup,
    create,
    mount
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(document));
  } else {
    mount(document);
  }
})();
