(function () {
  const core = window.PancreAICore;
  if (!core?.isChildMode?.()) return;
  if (!core.isSetupComplete?.()) return;

  const query = new URLSearchParams(window.location.search);
  const hasResponsibleAccess = query.get("responsible") === "1" || sessionStorage.getItem("pancreaiResponsibleAccess") === "true";
  if (hasResponsibleAccess) return;

  sessionStorage.setItem("pancreaiChildModeBlockedPath", window.location.pathname.split("/").pop() + window.location.search);
  window.location.replace("profile.html?responsible=1");
})();