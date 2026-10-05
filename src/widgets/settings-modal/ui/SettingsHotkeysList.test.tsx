import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SettingsHotkeysList } from "./SettingsHotkeysList";

const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0";

const keysOf = (description: string): string[] => {
  const row = screen.getByText(description).closest("li");
  return row ? [...row.querySelectorAll("kbd")].map((key) => key.textContent ?? "") : [];
};

describe("SettingsHotkeysList", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("groups every shortcut under a heading with its description", () => {
    vi.stubGlobal("navigator", { userAgent: WINDOWS });
    render(<SettingsHotkeysList />);

    for (const title of [
      "Запуск и вид",
      "Правка текста",
      "Несколько курсоров",
      "Поиск и замена",
      "Подсказки и навигация по коду",
      "Приложение",
      "Визуализации и просмотр кода",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(
      within(screen.getByRole("region", { name: "Поиск и замена" })).getAllByRole("listitem")
    ).not.toHaveLength(0);
  });

  it("shows Ctrl, Shift and Alt on Windows", () => {
    vi.stubGlobal("navigator", { userAgent: WINDOWS });
    render(<SettingsHotkeysList />);
    expect(keysOf("Удалить строку")).toEqual(["Ctrl", "Shift", "K"]);
    expect(keysOf("Повторить")).toEqual(["Ctrl", "Y"]);
    expect(keysOf("Найти и заменить")).toEqual(["Ctrl", "H"]);
  });

  it("shows ⌘, ⇧ and ⌥ on macOS, with the Mac variant of replace", () => {
    vi.stubGlobal("navigator", { userAgent: MAC });
    render(<SettingsHotkeysList />);
    expect(keysOf("Удалить строку")).toEqual(["⌘", "⇧", "K"]);
    expect(keysOf("Повторить")).toEqual(["⌘", "⇧", "Z"]);
    expect(keysOf("Найти и заменить")).toEqual(["⌘", "⌥", "F"]);
  });
});
