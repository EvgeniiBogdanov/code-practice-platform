import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DrillTestsReport } from "@/shared/lib/code-runners";
import { useUIStore } from "@/entities/ui-state";
import type { DrillTestsController } from "../../model/useDrillTests";
import { DrillTestsPanel, type DrillTestsPanelProps } from "./DrillTestsPanel";

const makeReport = (overrides: Partial<DrillTestsReport> = {}): DrillTestsReport => ({
  tests: [
    { suite: ["debounce"], name: "waits for the delay", passed: true, error: null, durationMs: 1 },
    {
      suite: ["debounce"],
      name: "keeps the last call",
      passed: false,
      error: "Ожидалось: 3\nПолучено: 1",
      durationMs: 2,
    },
    { suite: [], name: "root case", passed: true, error: null, durationMs: 1 },
  ],
  loadError: null,
  durationMs: 40,
  ...overrides,
});

const makeController = (overrides: Partial<DrillTestsController> = {}): DrillTestsController => ({
  phase: "idle",
  report: null,
  isStale: false,
  expandedRows: new Set(),
  manualRuns: 0,
  run: vi.fn(),
  toggleRow: vi.fn(),
  ...overrides,
});

const renderPanel = (
  controller: DrillTestsController,
  props: Partial<DrillTestsPanelProps> = {}
): void => {
  render(<DrillTestsPanel controller={controller} {...props} />);
};

describe("DrillTestsPanel", () => {
  beforeEach(() => {
    useUIStore.setState({ consoleCollapsed: false });
  });

  it("invites to run before the first run", () => {
    renderPanel(makeController());
    expect(screen.getByText(/Нажмите «Запустить»/)).toBeInTheDocument();
  });

  it("runs the tests from the toolbar button and disables it while running", () => {
    const controller = makeController();
    const { rerender } = render(<DrillTestsPanel controller={controller} />);
    fireEvent.click(screen.getByRole("button", { name: "Запустить тесты" }));
    expect(controller.run).toHaveBeenCalledOnce();

    rerender(<DrillTestsPanel controller={makeController({ phase: "running" })} />);
    expect(screen.getByRole("button", { name: "Запустить тесты" })).toBeDisabled();
  });

  it("shows the score, groups by describe and opens the error of a failed test", () => {
    renderPanel(makeController({ report: makeReport(), expandedRows: new Set([1]) }));
    expect(screen.getByLabelText("Пройдено 2, не пройдено 1")).toHaveTextContent("2/1");
    expect(screen.getByText("Пройдено 2 из 3")).toBeInTheDocument();
    expect(screen.getByText("debounce")).toBeInTheDocument();
    expect(screen.getByText(/Ожидалось: 3/)).toBeInTheDocument();
    expect(screen.queryByText("Все тесты пройдены", { exact: false })).not.toBeInTheDocument();
  });

  it("toggles a row through the controller", () => {
    const controller = makeController({ report: makeReport() });
    renderPanel(controller);
    fireEvent.click(screen.getByRole("button", { name: /keeps the last call/ }));
    expect(controller.toggleRow).toHaveBeenCalledWith(1);
  });

  it("congratulates when all tests pass and offers next steps", () => {
    const onNextTask = vi.fn();
    const report = makeReport({
      tests: [{ suite: [], name: "ok", passed: true, error: null, durationMs: 1 }],
    });
    renderPanel(makeController({ report }), { isSolved: true, onNextTask });
    expect(screen.getByText(/Все тесты пройдены/)).toBeInTheDocument();
    expect(screen.getByText("Задача отмечена решённой.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Следующая задача/ }));
    expect(onNextTask).toHaveBeenCalledOnce();
  });

  it("dims results and offers a rerun when the code changed", () => {
    const controller = makeController({ report: makeReport(), isStale: true });
    renderPanel(controller);
    expect(screen.getByText("Код изменён — результаты устарели.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Запустить" }));
    expect(controller.run).toHaveBeenCalledOnce();
  });

  it("blames the solution or the tests when loading failed", () => {
    renderPanel(
      makeController({
        report: makeReport({
          tests: [],
          loadError: { source: "solution", message: "SyntaxError: boom" },
        }),
      })
    );
    expect(screen.getByText("Решение не удалось выполнить")).toBeInTheDocument();
    expect(screen.getByText("SyntaxError: boom")).toBeInTheDocument();
  });

  it("reveals a collapsed panel when the user starts a run, keeping the saved setting", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    useUIStore.setState({ consoleCollapsed: true });
    const { rerender } = render(<DrillTestsPanel controller={makeController()} />);
    expect(screen.queryByRole("region", { name: "Результаты тестов" })).not.toBeInTheDocument();

    rerender(<DrillTestsPanel controller={makeController({ manualRuns: 1 })} />);
    expect(screen.getByRole("region", { name: "Результаты тестов" })).toBeInTheDocument();
    expect(useUIStore.getState().consoleCollapsed).toBe(true);
    // The reveal must not update the store during render.
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("collapses a revealed panel with the toggle and saves the choice", () => {
    useUIStore.setState({ consoleCollapsed: true });
    const { rerender } = render(<DrillTestsPanel controller={makeController()} />);
    rerender(<DrillTestsPanel controller={makeController({ manualRuns: 1 })} />);

    fireEvent.click(screen.getByRole("button", { name: "Свернуть панель" }));
    expect(screen.queryByRole("region", { name: "Результаты тестов" })).not.toBeInTheDocument();
    expect(useUIStore.getState().consoleCollapsed).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Развернуть панель" }));
    expect(useUIStore.getState().consoleCollapsed).toBe(false);
  });
});
