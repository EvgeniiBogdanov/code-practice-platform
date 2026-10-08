import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, THEME_SWITCHING_ATTRIBUTE } from "./themeSettings";

const root = document.documentElement;

describe("applyTheme", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    root.removeAttribute("data-theme");
    root.removeAttribute(THEME_SWITCHING_ATTRIBUTE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sets the first theme without a switch, there is nothing to fade from", () => {
    applyTheme("dark");

    expect(root).toHaveAttribute("data-theme", "dark");
    expect(root).not.toHaveAttribute(THEME_SWITCHING_ATTRIBUTE);
  });

  it("keeps transitions off from the change until two frames later", () => {
    applyTheme("dark");

    applyTheme("light");
    expect(root).toHaveAttribute("data-theme", "light");
    expect(root).toHaveAttribute(THEME_SWITCHING_ATTRIBUTE);

    vi.advanceTimersToNextFrame();
    expect(root).toHaveAttribute(THEME_SWITCHING_ATTRIBUTE);

    vi.advanceTimersToNextFrame();
    expect(root).not.toHaveAttribute(THEME_SWITCHING_ATTRIBUTE);
  });

  it("does nothing when the theme stays the same", () => {
    applyTheme("dark");

    applyTheme("dark");

    expect(root).not.toHaveAttribute(THEME_SWITCHING_ATTRIBUTE);
  });
});
