// src/kfwTheme.js
// Wähle GENAU EINE Import-Zeile:

// 1) Häufiger Pfad:
import tokens from "@openkfw/design-tokens/dist/tokens.json" assert { type: "json" };

// 2) Alternativ:
// import tokens from "@openkfw/design-tokens/tokens.json" assert { type: "json" };

// 3) Alternativ:
// import tokens from "@openkfw/design-tokens/build/tokens.json" assert { type: "json" };

function get(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}
function pick(paths, fallback) {
  for (const p of paths) {
    const v = get(tokens, p);
    if (v?.value) return v.value;
  }
  return fallback;
}

export function applyKfWTheme(mode) {
  const r = document.documentElement.style;

  r.setProperty("--bg",        pick([`surface.background.${mode}`, "surface.background"], mode === "dark" ? "#0e1420" : "#f7f8fb"));
  r.setProperty("--bg-soft",   pick([`surface.elev1.${mode}`, "surface.elev1"], mode === "dark" ? "#121a2a" : "#ffffff"));
  r.setProperty("--panel",     pick([`surface.panelAlpha.${mode}`, "surface.panelAlpha"], mode === "dark" ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)"));
  r.setProperty("--panel-elev",pick([`surface.panelElevAlpha.${mode}`, "surface.panelElevAlpha"], mode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"));
  r.setProperty("--border",    pick([`border.subtle.${mode}`, "border.subtle"], mode === "dark" ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"));
  r.setProperty("--txt",       pick([`text.primary.${mode}`, "text.primary"], mode === "dark" ? "#e7edf3" : "#0f1720"));
  r.setProperty("--muted",     pick([`text.secondary.${mode}`, "text.secondary"], mode === "dark" ? "#a8b3bf" : "#475569"));

  r.setProperty("--primary",   pick(["color.primary.600", "color.primary.500"], mode === "dark" ? "#4f7cff" : "#2346ff"));
  r.setProperty("--accent",    pick(["color.accent.500"], "#4c1a9b"));
  r.setProperty("--success",   pick(["color.success.500", "color.success.600"], mode === "dark" ? "#46d39a" : "#0ca678"));
}
