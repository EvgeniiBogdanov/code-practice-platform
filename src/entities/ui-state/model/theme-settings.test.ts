import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subscribeToSystemTheme, useUIStore } from "./uiStore";
import { getThemeSettings, SYSTEM_THEME_QUERY } from "./theme-settings";

describe("theme settings", () => {
  let media: MediaQueryList;
  let changes: EventTarget;

  beforeEach(() => {
    localStorage.clear();
    changes = new EventTarget();
    media = {
      matches: false,
      media: SYSTEM_THEME_QUERY,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: changes.addEventListener.bind(changes),
      removeEventListener: changes.removeEventListener.bind(changes),
      dispatchEvent: changes.dispatchEvent.bind(changes),
    };
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => media)
    );
    useUIStore.getState().setThemePreference("system");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const changeSystemTheme = (dark: boolean): void => {
    Object.defineProperty(media, "matches", { value: dark, configurable: true });
    changes.dispatchEvent(new Event("change"));
  };

  it("defaults to the system theme and preserves previous explicit choices", () => {
    expect(getThemeSettings()).toEqual({ themePreference: "system", theme: "light" });
    changeSystemTheme(true);
    expect(getThemeSettings()).toEqual({ themePreference: "system", theme: "dark" });
    expect(getThemeSettings(undefined, "light")).toEqual({
      themePreference: "light",
      theme: "light",
    });
    expect(getThemeSettings(undefined, "dark").themePreference).toBe("dark");
    expect(getThemeSettings("system", "light").theme).toBe("dark");
    expect(getThemeSettings("invalid", "light").themePreference).toBe("system");
  });

  it("follows system changes, ignores them for an explicit choice and cleans up", () => {
    const unsubscribe = subscribeToSystemTheme();
    changeSystemTheme(true);
    expect(useUIStore.getState().theme).toBe("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(useUIStore.getState().themePreference).toBe("system");

    useUIStore.getState().setThemePreference("light");
    changeSystemTheme(false);
    changeSystemTheme(true);
    expect(useUIStore.getState().theme).toBe("light");

    useUIStore.getState().setThemePreference("system");
    expect(useUIStore.getState().theme).toBe("dark");
    unsubscribe();
    changeSystemTheme(false);
    expect(useUIStore.getState().theme).toBe("dark");
  });

  it("rehydrates system mode using the current OS theme instead of its saved color", async () => {
    useUIStore.getState().setThemePreference("system");
    changeSystemTheme(true);
    await useUIStore.persist.rehydrate();
    expect(useUIStore.getState().themePreference).toBe("system");
    expect(useUIStore.getState().theme).toBe("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("migrates old saved settings and retains an explicit choice after rehydration", async () => {
    localStorage.setItem(
      "playground_ui_settings",
      JSON.stringify({ state: { theme: "dark" }, version: 0 })
    );
    await useUIStore.persist.rehydrate();
    expect(useUIStore.getState().themePreference).toBe("dark");
    useUIStore.getState().setThemePreference("light");
    changeSystemTheme(true);
    await useUIStore.persist.rehydrate();
    expect(useUIStore.getState().themePreference).toBe("light");
    expect(useUIStore.getState().theme).toBe("light");
  });

  it("toggles the resolved system theme into an explicit choice and resets to system", () => {
    changeSystemTheme(true);
    useUIStore.getState().setThemePreference("system");
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().themePreference).toBe("light");
    useUIStore.getState().setTheme((previous) => (previous === "light" ? "dark" : "light"));
    expect(useUIStore.getState().themePreference).toBe("dark");
    useUIStore.getState().resetUISettings();
    expect(useUIStore.getState().themePreference).toBe("system");
    expect(useUIStore.getState().theme).toBe("dark");
  });
});
