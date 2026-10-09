import { fireEvent, render, screen, within, type RenderResult } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TypeTestReport, TypeTestResult } from "@/shared/lib/code-editor";
import { useUIStore } from "@/entities/ui-state";
import type { TypeTestsController } from "../../model/useTypeTests";
import { TypeTestsPanel, type TypeTestsPanelProps } from "./TypeTestsPanel";

const TESTS = [
  'describe("random", () => {',
  '  test("принимает число", () => {});',
  '  test("не принимает строку", () => {});',
  "});",
].join("\n");

const result = (
  name: string,
  line: number,
  status: TypeTestResult["status"],
  failure: TypeTestResult["failure"] = null
): TypeTestResult => ({
  case: { id: `random/${name}`, name, describe: "random", line, start: 0, end: 1 },
  status,
  failure,
});

const makeReport = (overrides: Partial<TypeTestReport> = {}): TypeTestReport => ({
  compile: { passed: true, problems: [], reason: null, message: null },
  results: [
    result("принимает число", 2, "passed"),
    result("не принимает строку", 3, "failed", {
      kind: "mismatch",
      expected: "number",
      actual: "unknown",
      message: "TS2344",
    }),
  ],
  fileError: null,
  passed: 2,
  total: 3,
  durationMs: 420,
  ...overrides,
});

const makeController = (overrides: Partial<TypeTestsController> = {}): TypeTestsController => ({
  phase: "idle",
  report: null,
  isStale: false,
  failedRuns: 0,
  expandedIds: new Set(),
  manualRuns: 0,
  run: vi.fn(),
  toggleCase: vi.fn(),
  reset: vi.fn(),
  ...overrides,
});

const renderPanel = (
  controller: TypeTestsController,
  props: Partial<TypeTestsPanelProps> = {}
): RenderResult =>
  render(
    <TypeTestsPanel
      taskId="typescript-7"
      controller={controller}
      tests={TESTS}
      testsHash="hash"
      onShowCompileProblem={vi.fn()}
      {...props}
    />
  );

describe("TypeTestsPanel", () => {
  beforeEach(() => {
    useUIStore.setState({ consoleCollapsed: false });
  });

  it("lists the requirements before the first run", () => {
    renderPanel(makeController());
    expect(screen.getByText("Решение компилируется без ошибок")).toBeInTheDocument();
    expect(screen.getByText("принимает число")).toBeInTheDocument();
    expect(screen.getByText(/В задаче 3 теста/)).toBeInTheDocument();
    expect(
      screen.getAllByRole("listitem").some((item) => /не запускался/.test(item.textContent ?? ""))
    ).toBe(true);
  });

  it("runs the tests from an icon-only button", () => {
    const controller = makeController();
    renderPanel(controller);
    const button = screen.getByRole("button", { name: "Запустить тесты" });
    expect(button).not.toHaveTextContent(/\S/);
    expect(screen.queryByRole("button", { name: "Сдать" })).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(controller.run).toHaveBeenCalledOnce();
  });

  it("disables the run button while a check is running", () => {
    renderPanel(makeController({ phase: "running" }));
    expect(screen.getByRole("button", { name: "Запустить тесты" })).toBeDisabled();
  });

  it("shows the score, announces it and expands the failed case with both types", () => {
    renderPanel(
      makeController({
        phase: "done",
        report: makeReport(),
        expandedIds: new Set(["random/не принимает строку"]),
      })
    );
    expect(screen.getByLabelText("Пройдено 2, не пройдено 1")).toHaveTextContent("2/1");
    expect(screen.getByText("Пройдено 2 из 3")).toBeInTheDocument();
    expect(screen.getByText("Ожидалось")).toBeInTheDocument();
    expect(screen.getByText("number")).toBeInTheDocument();
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("expands a case through the controller", () => {
    const controller = makeController({ phase: "done", report: makeReport() });
    renderPanel(controller);
    fireEvent.click(screen.getByRole("button", { name: /не принимает строку/ }));
    expect(controller.toggleCase).toHaveBeenCalledWith("random/не принимает строку");
  });

  it("lists compiler errors of the solution and opens them", () => {
    const onShowCompileProblem = vi.fn();
    const problem = {
      id: "p1",
      line: 3,
      col: 5,
      start: 0,
      end: 1,
      code: 7006,
      message: "TS7006: Parameter implicitly has an 'any' type",
      severity: "error" as const,
    };
    renderPanel(
      makeController({
        phase: "done",
        report: makeReport({
          compile: { passed: false, problems: [problem], reason: "errors", message: null },
        }),
        expandedIds: new Set(["__compile__"]),
      }),
      { onShowCompileProblem }
    );
    fireEvent.click(screen.getByRole("button", { name: /3:5 — TS7006/ }));
    expect(onShowCompileProblem).toHaveBeenCalledWith(problem);
  });

  it("congratulates after a passing submission and offers the next steps", () => {
    const actions = {
      onMarkSolved: vi.fn(),
      onShowReference: vi.fn(),
      onNextTask: vi.fn(),
    };
    renderPanel(
      makeController({
        phase: "done",
        report: makeReport({
          results: [result("принимает число", 2, "passed")],
          passed: 2,
          total: 2,
        }),
      }),
      actions
    );
    expect(screen.getByText(/Все тесты пройдены · 0,4 с/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Отметить решённой" }));
    fireEvent.click(screen.getByRole("button", { name: "Посмотреть эталон" }));
    fireEvent.click(screen.getByRole("button", { name: "Следующая задача →" }));
    expect(actions.onMarkSolved).toHaveBeenCalled();
    expect(actions.onShowReference).toHaveBeenCalled();
    expect(actions.onNextTask).toHaveBeenCalled();
  });

  it("does not offer to mark a solved task as solved", () => {
    renderPanel(
      makeController({
        phase: "done",
        report: makeReport({ results: [], passed: 1, total: 1 }),
      }),
      { isSolved: true, onMarkSolved: vi.fn() }
    );
    expect(screen.queryByRole("button", { name: "Отметить решённой" })).not.toBeInTheDocument();
  });

  it("dims stale results and offers to run again", () => {
    const controller = makeController({ phase: "done", report: makeReport(), isStale: true });
    renderPanel(controller);
    const notice = screen.getByText(/результаты устарели/).parentElement as HTMLElement;
    fireEvent.click(within(notice).getByRole("button", { name: "Запустить" }));
    expect(controller.run).toHaveBeenCalledOnce();
    expect(screen.queryByText(/Пройдено \d из/)).not.toBeInTheDocument();
  });

  it("suggests a hint after repeated failed runs, once", () => {
    const onRequestHint = vi.fn();
    renderPanel(makeController({ phase: "done", report: makeReport(), failedRuns: 2 }), {
      onRequestHint,
    });
    fireEvent.click(screen.getByRole("button", { name: "Показать подсказку" }));
    expect(onRequestHint).toHaveBeenCalledOnce();
    expect(screen.queryByText("Застряли? Откройте подсказку")).not.toBeInTheDocument();
  });

  it("explains an unavailable engine and a timeout with a retry", () => {
    const controller = makeController({ phase: "timeout" });
    renderPanel(controller);
    expect(screen.getByText("Проверка заняла слишком много времени")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Повторить" }));
    expect(controller.run).toHaveBeenCalledOnce();
  });

  it("reports a damaged tests file with a link to the issue form", () => {
    renderPanel(
      makeController({ phase: "done", report: makeReport({ fileError: "tests.ts сломан" }) })
    );
    expect(screen.getByText("Ошибка в тестах задачи")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Сообщить" })).toHaveAttribute(
      "href",
      expect.stringContaining("/issues/new")
    );
  });

  it("shows the tests title with the result counter instead of tabs", () => {
    renderPanel(makeController({ phase: "done", report: makeReport() }));
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("Тесты")).toBeInTheDocument();
    expect(screen.queryByText("Вывод")).not.toBeInTheDocument();
  });

  it("fades the success banner in only when a run produces it, not on a remount", () => {
    const passed = makeReport({
      results: [result("принимает число", 2, "passed")],
      passed: 2,
      total: 2,
    });
    const bannerOf = (): Element | null =>
      screen.getByText(/Все тесты пройдены/).closest('[class*="banner"]');
    const props = { taskId: "typescript-7", tests: TESTS, testsHash: "hash" } as const;

    const first = renderPanel(makeController({ phase: "done", report: passed }));
    expect(bannerOf()?.className).not.toMatch(/animated/);
    first.unmount();

    const { rerender } = renderPanel(makeController({ phase: "running" }));
    rerender(
      <TypeTestsPanel
        {...props}
        controller={makeController({ phase: "done", report: passed })}
        onShowCompileProblem={vi.fn()}
      />
    );
    expect(bannerOf()?.className).toMatch(/animated/);
  });

  it("stays collapsed during the automatic first check", () => {
    useUIStore.setState({ consoleCollapsed: true });
    renderPanel(makeController({ phase: "running" }));
    expect(screen.queryByRole("region", { name: "Результаты тестов" })).not.toBeInTheDocument();
  });

  it("collapses to the toolbar, but opens for a run started by the user", () => {
    useUIStore.setState({ consoleCollapsed: true });
    const { rerender } = renderPanel(makeController());
    expect(screen.queryByRole("region", { name: "Результаты тестов" })).not.toBeInTheDocument();
    rerender(
      <TypeTestsPanel
        taskId="typescript-7"
        controller={makeController({ phase: "running", manualRuns: 1 })}
        tests={TESTS}
        testsHash="hash"
        onShowCompileProblem={vi.fn()}
      />
    );
    expect(screen.getByRole("region", { name: "Результаты тестов" })).toBeInTheDocument();
    expect(useUIStore.getState().consoleCollapsed).toBe(true);
  });

  it("changes the persistent setting from the toggle button", () => {
    useUIStore.setState({ consoleCollapsed: true });
    renderPanel(makeController());
    fireEvent.click(screen.getByRole("button", { name: "Развернуть панель" }));
    expect(useUIStore.getState().consoleCollapsed).toBe(false);
  });

  it("changes and remembers the text size", () => {
    useUIStore.setState({ testsFontSize: 12 });
    renderPanel(makeController());
    fireEvent.click(screen.getByRole("button", { name: "Увеличить шрифт" }));
    expect(useUIStore.getState().testsFontSize).toBe(13);
    fireEvent.click(screen.getByRole("button", { name: "Уменьшить шрифт" }));
    fireEvent.click(screen.getByRole("button", { name: "Уменьшить шрифт" }));
    expect(useUIStore.getState().testsFontSize).toBe(11);
    expect(screen.getByRole("button", { name: "Уменьшить шрифт" })).toBeDisabled();
  });
});
