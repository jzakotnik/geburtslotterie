import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
// Wenn du TS nutzt: from "../kfwTheme"; bei JS: from "../kfwTheme.js"
import { applyKfWTheme } from "../kfwTheme";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    applyKfWTheme(theme); // ← KfW-Tokens auf deine CSS-Variablen schreiben
  }, [theme]);

  return (
    <button
      type="button"
      className="iconBtn"
      aria-label="Theme umschalten"
      title="Theme umschalten"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
