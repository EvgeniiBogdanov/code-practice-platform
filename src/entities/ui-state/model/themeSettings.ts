import type { ThemeMode, ThemePreference, UIState } from "../types";

export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

export const resolveTheme = (preference: ThemePreference): ThemeMode => {
  if (preference !== "system") return preference;
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SYSTEM_THEME_QUERY).matches
    ? "dark"
    : "light";
};

export const getThemeSettings = (
  preference?: unknown,
  legacyTheme?: unknown
): Pick<UIState, "theme" | "themePreference"> => {
  const storedPreference = preference === undefined ? legacyTheme : preference;
  const themePreference = isThemePreference(storedPreference) ? storedPreference : "system";
  return { themePreference, theme: resolveTheme(themePreference) };
};

/** Root attribute that switches transitions off while a theme change is being resolved. */
export const THEME_SWITCHING_ATTRIBUTE = "data-theme-switching";

/**
 * Sets the theme on <html>. Switching to a different one suppresses every transition until the new
 * styles have been resolved and painted: otherwise each element with a colour transition fades
 * from the old theme, and the page shows a mix of both for a moment.
 */
export const applyTheme = (theme: ThemeMode): void => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  if (current === theme) return;

  if (current === null) {
    root.setAttribute("data-theme", theme);
    return;
  }

  root.setAttribute(THEME_SWITCHING_ATTRIBUTE, "");
  root.setAttribute("data-theme", theme);
  // Resolve the new styles now, while transitions are still off.
  void getComputedStyle(root).color;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.removeAttribute(THEME_SWITCHING_ATTRIBUTE));
  });
};
