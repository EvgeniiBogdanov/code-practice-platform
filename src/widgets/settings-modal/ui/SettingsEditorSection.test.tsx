import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useUIStore } from "@/entities/ui-state";
import { SettingsEditorSection } from "./SettingsEditorSection";

describe("SettingsEditorSection", () => {
  beforeEach(() => {
    useUIStore.setState({
      editorFontSize: 14,
      editorWordWrap: false,
      editorLinterEnabled: false,
      editorParameterHintsOnType: false,
    });
  });

  it("keeps parameter hints on typing off by default and toggles the stored value", () => {
    render(<SettingsEditorSection />);
    const toggle = screen.getByRole("switch", { name: "Подсказка параметров при наборе" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(useUIStore.getState().editorParameterHintsOnType).toBe(true);
  });

  it("edits the same font size and word wrap the editor toolbar uses", () => {
    render(<SettingsEditorSection />);
    fireEvent.click(screen.getByRole("button", { name: "Увеличить шрифт" }));
    expect(useUIStore.getState().editorFontSize).toBe(15);

    fireEvent.click(screen.getByRole("switch", { name: "Перенос строк" }));
    expect(useUIStore.getState().editorWordWrap).toBe(true);
  });

  it("lists the keyboard shortcuts after the editor preferences", () => {
    render(<SettingsEditorSection />);
    expect(screen.getByRole("heading", { name: "Горячие клавиши" })).toBeInTheDocument();
    expect(screen.getByText("Запустить код")).toBeInTheDocument();
  });
});
