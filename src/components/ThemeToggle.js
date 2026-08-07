"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Render nothing until mounted — theme is only known client-side, and
  // guessing here would cause a server/client markup mismatch.
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-md p-2 text-ink-secondary hover:text-ink hover:bg-background transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
