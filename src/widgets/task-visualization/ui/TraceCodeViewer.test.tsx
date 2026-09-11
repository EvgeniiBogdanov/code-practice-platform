import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { TraceCodeViewer } from "./TraceCodeViewer";

describe("TraceCodeViewer", () => {
  const sampleCode = `function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  return [left, right];
}`;

  beforeEach(() => {
    useUIStore.setState({ visualizerCodeFontSize: 14 });
    vi.clearAllMocks();
  });

  it("renders filename, line numbers, and highlighted code lines", () => {
    render(<TraceCodeViewer code={sampleCode} filename="two-sum.js" activeLine={2} />);

    expect(screen.getByText("two-sum.js")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("2")).toBeInTheDocument();

    const activeLine = screen.getByRole("code").querySelector("[aria-current='step']");
    expect(activeLine).toBeInTheDocument();
    expect(activeLine).toHaveTextContent("let left = 0;");
  });

  it("renders zoom controls with explicit props and triggers callbacks", () => {
    const handleIncrease = vi.fn();
    const handleDecrease = vi.fn();
    const handleReset = vi.fn();

    render(
      <TraceCodeViewer
        code={sampleCode}
        fontSize={16}
        onIncreaseFontSize={handleIncrease}
        onDecreaseFontSize={handleDecrease}
        onResetFontSize={handleReset}
      />
    );

    const zoomInBtn = screen.getByRole("button", { name: "Увеличить шрифт" });
    const zoomOutBtn = screen.getByRole("button", { name: "Уменьшить шрифт" });
    const fontLabel = screen.getByRole("button", {
      name: "Размер шрифта 16px. Нажмите для сброса.",
    });
    const resetBtn = screen.getByRole("button", { name: "Сбросить шрифт" });

    expect(zoomInBtn).toBeEnabled();
    expect(zoomOutBtn).toBeEnabled();
    expect(fontLabel).toBeEnabled();
    expect(resetBtn).toBeEnabled();

    fireEvent.click(zoomInBtn);
    expect(handleIncrease).toHaveBeenCalledTimes(1);

    fireEvent.click(zoomOutBtn);
    expect(handleDecrease).toHaveBeenCalledTimes(1);

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);

    fireEvent.click(fontLabel);
    expect(handleReset).toHaveBeenCalledTimes(2);
  });

  it("disables reset button when fontSize is 14px (default)", () => {
    render(
      <TraceCodeViewer
        code={sampleCode}
        fontSize={14}
        onIncreaseFontSize={vi.fn()}
        onDecreaseFontSize={vi.fn()}
        onResetFontSize={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Сбросить шрифт" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Размер шрифта 14px. Нажмите для сброса." })
    ).toBeDisabled();
  });

  it("disables zoom buttons at limits (12px and 24px)", () => {
    const { rerender } = render(
      <TraceCodeViewer
        code={sampleCode}
        fontSize={12}
        onIncreaseFontSize={vi.fn()}
        onDecreaseFontSize={vi.fn()}
        onResetFontSize={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Уменьшить шрифт" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Увеличить шрифт" })).toBeEnabled();

    rerender(
      <TraceCodeViewer
        code={sampleCode}
        fontSize={24}
        onIncreaseFontSize={vi.fn()}
        onDecreaseFontSize={vi.fn()}
        onResetFontSize={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Увеличить шрифт" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Уменьшить шрифт" })).toBeEnabled();
  });

  it("supports keyboard shortcuts +, -, 0 on the code container", () => {
    const handleIncrease = vi.fn();
    const handleDecrease = vi.fn();
    const handleReset = vi.fn();

    render(
      <TraceCodeViewer
        code={sampleCode}
        fontSize={15}
        onIncreaseFontSize={handleIncrease}
        onDecreaseFontSize={handleDecrease}
        onResetFontSize={handleReset}
      />
    );

    const surface = screen.getByRole("generic", {
      name: "Код решения алгоритма с текущим шагом",
    });

    fireEvent.keyDown(surface, { key: "+" });
    expect(handleIncrease).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(surface, { key: "-" });
    expect(handleDecrease).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(surface, { key: "0" });
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it("updates store state when props are omitted", () => {
    render(<TraceCodeViewer code={sampleCode} />);

    expect(screen.getByText("14px")).toBeInTheDocument();
    const zoomInBtn = screen.getByRole("button", { name: "Увеличить шрифт" });

    fireEvent.click(zoomInBtn);
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(15);
  });
});
