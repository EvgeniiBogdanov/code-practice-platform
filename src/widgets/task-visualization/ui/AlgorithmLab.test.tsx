import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlgorithmLab } from "./AlgorithmLab";

vi.mock("@/shared/ui/NumberScene", () => ({
  NumberScene: ({ onUnavailable }: Readonly<{ onUnavailable: () => void }>) => (
    <button onClick={onUnavailable}>Simulate context loss</button>
  ),
}));
const solution = "const moveZeroes = (nums) => {\n  let slow = 0;\n  return nums;\n};";
describe("algorithm lab interactions", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("supports next, previous, seek, keyboard, completion and restart", () => {
    render(<AlgorithmLab taskId="algo35" solution={solution} />);
    const range = screen.getByRole("slider", { name: "Шаг алгоритма" });
    expect(screen.getByRole("button", { name: "Предыдущий шаг" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    expect(range).toHaveValue("1");
    fireEvent.change(range, { target: { value: range.getAttribute("max") } });
    expect(screen.getByRole("heading", { name: "Все нули перемещены вправо" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Следующий шаг" })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("group", { name: /Проигрыватель алгоритма/ }), {
      key: "Home",
    });
    expect(range).toHaveValue("0");
    fireEvent.keyDown(range, { key: "End" });
    expect(screen.queryByRole("button", { name: "Пауза" })).not.toBeInTheDocument();
  });
  it("keeps the current trace on invalid input and resets it on successful submission", () => {
    render(<AlgorithmLab taskId="algo35" solution={solution} />);
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Массив" }), {
      target: { value: "[false]" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Применить" }));
    expect(screen.getByRole("alert")).toHaveTextContent("целых чисел");
    expect(screen.getByRole("slider")).toHaveValue("1");
    fireEvent.change(screen.getByRole("textbox", { name: "Массив" }), { target: { value: "[]" } });
    fireEvent.click(screen.getByRole("button", { name: "Применить" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveValue("0");
    expect(screen.getByText("Нет элементов для сравнения")).toBeVisible();
  });
  it("stops playback and resets on example or task changes", () => {
    vi.useFakeTimers();
    const { rerender } = render(<AlgorithmLab taskId="algo35" solution={solution} />);
    fireEvent.click(screen.getByRole("button", { name: "Смотреть" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Пример" }), {
      target: { value: "empty" },
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("slider")).toHaveValue("0");
    rerender(<AlgorithmLab taskId="algo2" solution="return true;" />);
    expect(screen.getByRole("textbox", { name: "Строка" })).toHaveValue(
      "A man, a plan, a canal: Panama"
    );
    expect(screen.getByRole("slider")).toHaveValue("0");
  });
  it("keeps code and controls usable after WebGL failure and offers a retry", () => {
    render(<AlgorithmLab taskId="algo35" solution={solution} />);
    fireEvent.click(screen.getByRole("button", { name: "Simulate context loss" }));
    expect(screen.getByRole("list", { name: "Массив по индексам" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    expect(screen.getByRole("slider")).toHaveValue("1");
    fireEvent.click(screen.getByRole("button", { name: "Повторить 3D" }));
    expect(screen.getByRole("button", { name: "Simulate context loss" })).toBeVisible();
  });
  it("renders the input hint centered in sceneMeta", () => {
    render(<AlgorithmLab taskId="algo35" solution={solution} />);
    expect(screen.getByText(/До 16 целых чисел/)).toBeInTheDocument();
    expect(screen.getByText("ИНДЕКСЫ С 0")).toBeInTheDocument();
  });

  it("renders ResizableSplitPane in fullscreen with 70/30 default and moves header/inputs to left pane", () => {
    localStorage.clear();
    render(<AlgorithmLab taskId="algo35" solution={solution} isFullscreen={true} />);

    const resizer = screen.getByRole("separator", { name: "Разделитель визуализации и кода" });
    expect(resizer).toBeInTheDocument();
    expect(resizer).toHaveAttribute("aria-valuenow", "70");

    // Toolbar and TraceInputs are in the left pane (inside leftPane)
    const toolbarTab = screen.getByText("Визуализатор");
    const inputsBox = screen.getByRole("textbox", { name: "Массив" });
    const leftPane = resizer.parentElement?.querySelector("._leftPane_c0000c, [class*='leftPane']");
    expect(leftPane).toContainElement(toolbarTab);
    expect(leftPane).toContainElement(inputsBox);
    expect(screen.queryByRole("heading", { name: "Медленный и быстрый" })).not.toBeInTheDocument();
    expect(screen.queryByText("Два указателя")).not.toBeInTheDocument();
    expect(screen.queryByText(/O\(n\) время/)).not.toBeInTheDocument();

    // Right pane contains CodeViewer (only code)
    const rightPane = resizer.parentElement?.querySelector(
      "._rightPane_c0000c, [class*='rightPane']"
    );
    expect(rightPane).not.toContainElement(toolbarTab);
    expect(rightPane).not.toContainElement(inputsBox);
    expect(rightPane?.querySelector("pre")).toBeInTheDocument();

    // Toolbar is in the left pane, right pane is purely code
    const minimizeBtn = screen.getByRole("button", { name: "Свернуть" });
    expect(leftPane).toContainElement(minimizeBtn);
    expect(rightPane).not.toContainElement(minimizeBtn);

    // Resize via keyboard
    fireEvent.keyDown(resizer, { key: "ArrowLeft" });
    expect(resizer).toHaveAttribute("aria-valuenow", "68");
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("68");

    // Micro-movements during clicks do not move panes or trigger dragging
    fireEvent.pointerDown(resizer, { clientX: 700, pointerId: 1 });
    fireEvent.pointerMove(resizer, { clientX: 701, pointerId: 1 });
    fireEvent.pointerUp(resizer, { clientX: 701, pointerId: 1 });
    expect(resizer).toHaveAttribute("aria-valuenow", "68");

    // Second click completes pointer double-click and cleanly resets to 70/30
    fireEvent.pointerDown(resizer, { clientX: 701, pointerId: 1 });
    fireEvent.pointerUp(resizer, { clientX: 700, pointerId: 1 });
    expect(resizer).toHaveAttribute("aria-valuenow", "70");
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("70");

    // Also supports native dblclick event
    fireEvent.keyDown(resizer, { key: "ArrowLeft" });
    expect(resizer).toHaveAttribute("aria-valuenow", "68");
    fireEvent.doubleClick(resizer);
    expect(resizer).toHaveAttribute("aria-valuenow", "70");
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("70");
  });

  it("separates code viewer from visualizer card in normal mode", () => {
    render(<AlgorithmLab taskId="algo35" solution={solution} isFullscreen={false} />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();

    const player = screen.getByRole("group", { name: /Проигрыватель алгоритма/ });
    const visualizerCard = player.querySelector("[class*='visualizerCard']");
    const codeCard = player.querySelector("[class*='codeInspector']");

    expect(visualizerCard).toBeInTheDocument();
    expect(codeCard).toBeInTheDocument();

    // Footer is removed
    expect(screen.queryByText(/шаги · Пробел воспроизведение/)).not.toBeInTheDocument();

    // Code pre is inside codeCard, outside visualizer card
    const codePre = codeCard?.querySelector("pre");
    expect(codePre).toBeInTheDocument();
    expect(visualizerCard).not.toContainElement(codePre!);
  });
});
