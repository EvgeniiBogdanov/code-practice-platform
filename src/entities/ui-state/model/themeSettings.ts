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

export const applyTheme = (theme: ThemeMode): void => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
};
