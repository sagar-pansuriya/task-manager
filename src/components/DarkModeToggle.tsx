"use client";

import { useDarkMode } from "@/hooks/useDarkMode";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-550 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800/80 focus:outline-none"
    >
      <span className="flex items-center justify-center" suppressHydrationWarning>
        {theme === "dark" ? (
          <Sun className="h-4.5 w-4.5 text-amber-500" />
        ) : (
          <Moon className="h-4.5 w-4.5 text-slate-655" />
        )}
      </span>
    </button>
  );
}

