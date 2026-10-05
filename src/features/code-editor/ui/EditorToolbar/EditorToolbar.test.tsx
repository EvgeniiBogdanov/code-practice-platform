import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { EditorToolbar } from "./EditorToolbar";

describe("EditorToolbar", () => {
  it("renders linter switch in disabled state when isLinterEnabled is false", () => {
    const handleToggle = vi.fn();
    render(
      <EditorToolbar
        filepath="main.ts"
        isLinterEnabled={false}
        onToggleLinter={handleToggle}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
      />
    );

    const switchEl = screen.getByRole("switch", { name: "Проверка ошибок" });
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).not.toBeChecked();

    fireEvent.click(switchEl);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it("renders linter switch in enabled state when isLinterEnabled is true", () => {
    const handleToggle = vi.fn();
    render(
      <EditorToolbar
        filepath="main.ts"
        isLinterEnabled={true}
        onToggleLinter={handleToggle}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
      />
    );

    const switchEl = screen.getByRole("switch", { name: "Проверка ошибок" });
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toBeChecked();

    fireEvent.click(switchEl);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it("disables the format button when the language has no formatter", () => {
    const onFormat = vi.fn();
    const { rerender } = render(
      <EditorToolbar filepath="q.sql" onFormat={onFormat} canFormat={false} />
    );
    const button = screen.getByRole("button", { name: "Форматировать код (Prettier)" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onFormat).not.toHaveBeenCalled();

    rerender(<EditorToolbar filepath="a.ts" onFormat={onFormat} canFormat />);
    fireEvent.click(screen.getByRole("button", { name: "Форматировать код (Prettier)" }));
    expect(onFormat).toHaveBeenCalledTimes(1);
  });
});
