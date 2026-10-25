import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DrillTestsReport } from "@/shared/lib/code-runners";

const mocks = vi.hoisted(() => ({ run: vi.fn(), cancel: vi.fn() }));

vi.mock("@/shared/lib/code-runners", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/code-runners")>(
    "@/shared/lib/code-runners"
  );
  return { ...actual, runDrillTests: mocks.run, cancelDrillTests: mocks.cancel };
});

const { useDrillTests } = await import("./useDrillTests");

const report = (...passed: boolean[]): DrillTestsReport => ({
  tests: passed.map((ok, i) => ({
    suite: [],
    name: `case ${i}`,
    passed: ok,
    error: ok ? null : "Ожидалось: 1\nПолучено: 2",
    durationMs: 1,
  })),
  loadError: null,
  durationMs: 5,
});

const baseOptions = {
  enabled: true,
  taskId: "sd-1",
  code: "export const a = 1;",
  filename: "solution.ts",
  tests: "test('a', () => {});",
};

describe("useDrillTests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs solution and tests, then reports the result and opens failed rows", async () => {
    mocks.run.mockResolvedValue(report(true, false));
    const { result } = renderHook(() => useDrillTests(baseOptions));
    expect(result.current.report).toBeNull();

    act(() => result.current.run());
    expect(result.current.phase).toBe("running");
    await waitFor(() => expect(result.current.phase).toBe("idle"));

    expect(mocks.run).toHaveBeenCalledWith(baseOptions.code, baseOptions.tests, {
      filename: "solution.ts",
    });
    expect(result.current.report?.tests).toHaveLength(2);
    expect([...result.current.expandedRows]).toEqual([1]);
    expect(result.current.manualRuns).toBe(1);
  });

  it("calls onAllPassed only when every test is green", async () => {
    const onAllPassed = vi.fn();
    const { result } = renderHook(() => useDrillTests({ ...baseOptions, onAllPassed }));

    mocks.run.mockResolvedValueOnce(report(true, false));
    act(() => result.current.run());
    await waitFor(() => expect(result.current.report).not.toBeNull());
    expect(onAllPassed).not.toHaveBeenCalled();

    mocks.run.mockResolvedValueOnce(report(true, true));
    act(() => result.current.run());
    await waitFor(() => expect(onAllPassed).toHaveBeenCalledOnce());
  });

  it("does not mark a task solved for an empty or broken report", async () => {
    const onAllPassed = vi.fn();
    const { result } = renderHook(() => useDrillTests({ ...baseOptions, onAllPassed }));

    mocks.run.mockResolvedValueOnce(report());
    act(() => result.current.run());
    await waitFor(() => expect(result.current.report).not.toBeNull());

    mocks.run.mockResolvedValueOnce({
      tests: [],
      loadError: { source: "solution", message: "Error: x" },
      durationMs: 1,
    } satisfies DrillTestsReport);
    act(() => result.current.run());
    await waitFor(() => expect(result.current.report?.loadError).not.toBeNull());
    expect(onAllPassed).not.toHaveBeenCalled();
  });

  it("marks the report stale once the code changes and drops it for another task", async () => {
    mocks.run.mockResolvedValue(report(true));
    const { result, rerender } = renderHook((props) => useDrillTests(props), {
      initialProps: baseOptions,
    });
    act(() => result.current.run());
    await waitFor(() => expect(result.current.report).not.toBeNull());
    expect(result.current.isStale).toBe(false);

    rerender({ ...baseOptions, code: "export const a = 2;" });
    expect(result.current.isStale).toBe(true);

    rerender({ ...baseOptions, taskId: "sd-2" });
    expect(result.current.report).toBeNull();
  });

  it("ignores a result that arrives after the task changed", async () => {
    let finish: (value: DrillTestsReport) => void = () => {};
    mocks.run.mockReturnValue(new Promise<DrillTestsReport>((resolve) => (finish = resolve)));
    const onAllPassed = vi.fn();
    const { result, rerender } = renderHook((props) => useDrillTests(props), {
      initialProps: { ...baseOptions, onAllPassed },
    });
    act(() => result.current.run());
    rerender({ ...baseOptions, onAllPassed, taskId: "sd-2" });
    expect(result.current.phase).toBe("idle");

    await act(async () => finish(report(true)));
    expect(result.current.report).toBeNull();
    expect(onAllPassed).not.toHaveBeenCalled();
    expect(mocks.cancel).toHaveBeenCalled();
  });

  it("does nothing while disabled", () => {
    const { result } = renderHook(() => useDrillTests({ ...baseOptions, enabled: false }));
    act(() => result.current.run());
    expect(mocks.run).not.toHaveBeenCalled();
  });

  it("toggles a row", async () => {
    mocks.run.mockResolvedValue(report(true, true));
    const { result } = renderHook(() => useDrillTests(baseOptions));
    act(() => result.current.run());
    await waitFor(() => expect(result.current.report).not.toBeNull());
    act(() => result.current.toggleRow(0));
    expect(result.current.expandedRows.has(0)).toBe(true);
    act(() => result.current.toggleRow(0));
    expect(result.current.expandedRows.has(0)).toBe(false);
  });
});
