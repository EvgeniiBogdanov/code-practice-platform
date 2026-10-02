import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { SettingsCustomizationSection } from "./SettingsCustomizationSection";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";

describe("SettingsCustomizationSection", () => {
  beforeEach(() => {
    useUIStore.getState().setThemePreference("system");
    useUIStore.setState({ hideTooltips: false, hideInteractiveAssistant: false });
    useReviewStore.setState({
      assistantName: "Интервальный помощник",
      setAssistantName: vi.fn().mockImplementation(async (name: string) => {
        useReviewStore.setState({ assistantName: name });
      }),
      resetAssistantName: vi.fn().mockImplementation(async () => {
        useReviewStore.setState({ assistantName: "Интервальный помощник" });
      }),
    });
  });

  it("switches between system, light and dark themes immediately", () => {
    render(<SettingsCustomizationSection />);
    const group = screen.getByRole("group", { name: "Тема оформления" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["Системная", "Светлая", "Тёмная"]);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    for (const [preference, label] of [
      ["light", "Светлая"],
      ["dark", "Тёмная"],
      ["system", "Системная"],
    ] as const) {
      const button = within(group).getByRole("button", { name: label });
      fireEvent.click(button);
      expect(useUIStore.getState().themePreference).toBe(preference);
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(buttons.filter((item) => item.getAttribute("aria-pressed") === "true")).toHaveLength(
        1
      );
      expect(document.documentElement).toHaveAttribute("data-theme", useUIStore.getState().theme);
    }
  });

  it("renders with placeholder 'Имя' and empty input when name is default", () => {
    render(<SettingsCustomizationSection />);

    expect(screen.getByText("Персонализация помощника")).toBeInTheDocument();
    const input = screen.getByRole("textbox", {
      name: /Имя интервального помощника/i,
    }) as HTMLInputElement;
    expect(input.value).toBe("");
    expect(input.placeholder).toBe("Имя");
    expect(screen.getByText("0/30")).toBeInTheDocument();
  });

  it("allows changing name and saving", async () => {
    render(<SettingsCustomizationSection />);

    const input = screen.getByRole("textbox", { name: /Имя интервального помощника/i });
    fireEvent.change(input, { target: { value: "Джарвис" } });

    expect(screen.getByText("7/30")).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: /Сохранить/i });
    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);
    expect(useReviewStore.getState().assistantName).toBe("Джарвис");
  });

  it("filters out dangerous characters and HTML tags", () => {
    render(<SettingsCustomizationSection />);

    const input = screen.getByRole("textbox", {
      name: /Имя интервального помощника/i,
    }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "<script>alert('xss')</script>" } });
    expect(input.value).toBe("alertxss");

    fireEvent.change(input, { target: { value: "   Бот   2.0   " } });
    expect(input.value).toBe("Бот 2.0 ");
  });

  it("resets assistant name to default on reset button click", async () => {
    useReviewStore.setState({ assistantName: "Мой Бот" });
    render(<SettingsCustomizationSection />);

    const resetBtn = screen.getByRole("button", { name: /Сбросить/i });
    expect(resetBtn).not.toBeDisabled();

    fireEvent.click(resetBtn);
    expect(useReviewStore.getState().assistantName).toBe("Интервальный помощник");
  });

  it("renders 'Убрать подсказки' switch unchecked by default", () => {
    render(<SettingsCustomizationSection />);

    expect(screen.getByText("Убрать подсказки")).toBeInTheDocument();
    const switchEl = screen.getByRole("switch", { name: /Убрать подсказки/i });
    expect(switchEl).not.toBeChecked();
  });

  it("toggles hideTooltips in uiStore when switch is clicked", () => {
    render(<SettingsCustomizationSection />);

    const switchEl = screen.getByRole("switch", { name: /Убрать подсказки/i });
    fireEvent.click(switchEl);

    expect(useUIStore.getState().hideTooltips).toBe(true);
    expect(switchEl).toBeChecked();

    fireEvent.click(switchEl);
    expect(useUIStore.getState().hideTooltips).toBe(false);
    expect(switchEl).not.toBeChecked();
  });

  it("toggles interactive assistant visibility in uiStore", () => {
    render(<SettingsCustomizationSection />);

    const switchEl = screen.getByRole("switch", {
      name: /Отключить интерактивного помощника/i,
    });
    expect(switchEl).not.toBeChecked();

    fireEvent.click(switchEl);
    expect(useUIStore.getState().hideInteractiveAssistant).toBe(true);
    expect(switchEl).toBeChecked();
  });
});
