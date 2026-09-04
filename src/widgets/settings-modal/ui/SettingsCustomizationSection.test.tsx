import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsCustomizationSection } from "./SettingsCustomizationSection";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";

describe("SettingsCustomizationSection", () => {
  beforeEach(() => {
    useUIStore.setState({ hideTooltips: false });
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

  it("renders with placeholder 'Имя' and empty input when name is default", () => {
    render(<SettingsCustomizationSection />);

    expect(screen.getByText("Персонализация помощника")).toBeInTheDocument();
    const input = screen.getByRole("textbox", { name: /Имя интервального помощника/i }) as HTMLInputElement;
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
});
