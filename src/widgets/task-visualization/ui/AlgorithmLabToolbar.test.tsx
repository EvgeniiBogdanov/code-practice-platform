import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AlgorithmLabToolbar } from "./AlgorithmLabToolbar";

describe("AlgorithmLabToolbar", () => {
  it("disables fullscreen when no action is available", () => {
    render(<AlgorithmLabToolbar />);

    expect(screen.getByText("Визуализатор")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Развернуть на весь экран" });
    expect(button).toBeDisabled();
  });

  it("calls onToggleFullscreen when provided", () => {
    const handleToggle = vi.fn();
    render(<AlgorithmLabToolbar onToggleFullscreen={handleToggle} />);

    const button = screen.getByRole("button", { name: "Развернуть на весь экран" });
    fireEvent.click(button);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("renders custom title and minimized state when isFullscreen is true", () => {
    render(<AlgorithmLabToolbar title="Два указателя" isFullscreen={true} />);

    expect(screen.getByText("Два указателя")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Свернуть" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Свернуть" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("renders zoom controls and triggers callbacks", () => {
    const handleIncrease = vi.fn();
    const handleDecrease = vi.fn();
    const handleReset = vi.fn();

    render(
      <AlgorithmLabToolbar
        zoom={1.25}
        onIncreaseZoom={handleIncrease}
        onDecreaseZoom={handleDecrease}
        onResetZoom={handleReset}
      />
    );

    const zoomInBtn = screen.getByRole("button", { name: "Увеличить масштаб" });
    const zoomOutBtn = screen.getByRole("button", { name: "Уменьшить масштаб" });
    const resetLabel = screen.getByRole("button", { name: "Масштаб 125%. Нажмите для сброса." });
    const resetBtn = screen.getByRole("button", { name: "Сбросить масштаб" });

    expect(zoomInBtn).toBeEnabled();
    expect(zoomOutBtn).toBeEnabled();
    expect(resetLabel).toBeEnabled();
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(zoomInBtn);
    expect(handleIncrease).toHaveBeenCalledTimes(1);

    fireEvent.click(zoomOutBtn);
    expect(handleDecrease).toHaveBeenCalledTimes(1);

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);

    fireEvent.click(resetLabel);
    expect(handleReset).toHaveBeenCalledTimes(2);
  });

  it("disables zoom buttons at limits and disables reset button at 100%", () => {
    const { rerender } = render(
      <AlgorithmLabToolbar
        zoom={1}
        onIncreaseZoom={vi.fn()}
        onDecreaseZoom={vi.fn()}
        onResetZoom={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Масштаб 100%. Нажмите для сброса." })
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Сбросить масштаб" })).toBeDisabled();

    rerender(
      <AlgorithmLabToolbar
        zoom={0.5}
        onIncreaseZoom={vi.fn()}
        onDecreaseZoom={vi.fn()}
        onResetZoom={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Уменьшить масштаб" })).toBeDisabled();

    rerender(
      <AlgorithmLabToolbar
        zoom={2.5}
        onIncreaseZoom={vi.fn()}
        onDecreaseZoom={vi.fn()}
        onResetZoom={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Увеличить масштаб" })).toBeDisabled();
  });
});
