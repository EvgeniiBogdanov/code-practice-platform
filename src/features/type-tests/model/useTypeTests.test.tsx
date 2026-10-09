import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TypeTestReport } from "@/shared/lib/code-editor";

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  release: vi.fn(),
  tick: vi.fn(),
}));

vi.mock("@/shared/lib/code-editor", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/code-editor")>(
    "@/shared/lib/code-editor"
  );
  return {
    ...actual,
    acquireTypeScriptClient: () => ({ request: mocks.request, release: mocks.release }),
  };
});
vi.mock("@/entities/progress", () => ({
  useProgressStore: { getState: () => ({ checkChecklistItems: mocks.tick }) },
}));

const { useTypeTests } = await import("./useTypeTests");
const { clearTypeTestsCache } = await import("./typeTestsCache");

const report = (passed: number, total = 3): TypeTestReport => ({
  compile: { passed: true, problems: [], reason: null, message: null },
  results: [
    {
      case: { id: "/a", name: "a", describe: null, line: 1, start: 0, end: 5 },
      status: passed === total ? "passed" : "failed",
      failure: passed === total ? null : { kind: "expected-error", snippet: "x" },
    },
  ],
  fileError: null,
  passed,
  total,
  durationMs: 10,
});

const options = {
  taskId: "typescript-1",
  code: "const a = 1;",
  filepath: "task.ts",
  tests: "test('a', () => {});",
  testsHash: "hash",
  updatesChecklist: true,
  checklistTests: { 0: ["a"] },
};

describe("useTypeTests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearTypeTestsCache();
  });

  it("runs the tests and ticks the linked checklist items", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const { result } = renderHook(() => useTypeTests(options));

    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(mocks.request).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "tests", code: options.code, tests: options.tests }),
      expect.objectContaining({ timeoutMs: 5000 })
    );
    expect(mocks.tick).toHaveBeenCalledWith(["check-typescript-1-0"]);
  });

  it("does not tick the checklist when it is not asked to", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const { result } = renderHook(() => useTypeTests({ ...options, updatesChecklist: false }));
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(mocks.tick).not.toHaveBeenCalled();
  });

  it("ticks nothing for tests that failed or when the tests file is broken", async () => {
    mocks.request.mockResolvedValueOnce({ report: report(1) });
    const { result } = renderHook(() => useTypeTests(options));
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(mocks.tick).not.toHaveBeenCalled();

    mocks.request.mockResolvedValueOnce({ report: { ...report(3), fileError: "broken" } });
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.report?.fileError).toBe("broken"));
    expect(mocks.tick).not.toHaveBeenCalled();
  });

  it("counts failed runs in a row, but only when the code changed in between", async () => {
    mocks.request.mockResolvedValue({ report: report(1) });
    const { result, rerender } = renderHook((props) => useTypeTests(props), {
      initialProps: options,
    });

    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.failedRuns).toBe(1));
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(result.current.failedRuns).toBe(1);

    rerender({ ...options, code: "const a = 2;" });
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.failedRuns).toBe(2));

    mocks.request.mockResolvedValue({ report: report(3) });
    rerender({ ...options, code: "const a = 3;" });
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.failedRuns).toBe(0));
  });

  it("marks the result stale as soon as the code changes", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const { result, rerender } = renderHook((props) => useTypeTests(props), {
      initialProps: options,
    });
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(result.current.isStale).toBe(false);
    rerender({ ...options, code: "const a = 2;" });
    expect(result.current.isStale).toBe(true);
  });

  it("reports an unavailable engine and a timeout apart", async () => {
    mocks.request.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useTypeTests(options));
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("unavailable"));

    mocks.request.mockImplementationOnce(async (_message, requestOptions) => {
      requestOptions.onTimeout();
      return null;
    });
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.phase).toBe("timeout"));
  });

  it("checks once on mount when asked to, and ignores a second request while running", async () => {
    let finish: (value: unknown) => void = () => undefined;
    mocks.request.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { result } = renderHook(() =>
      useTypeTests({ ...options, updatesChecklist: false, autoRun: true })
    );
    await waitFor(() => expect(result.current.phase).toBe("running"));
    act(() => result.current.run());
    expect(mocks.request).toHaveBeenCalledTimes(1);
    await act(async () => finish({ report: report(3) }));
    await waitFor(() => expect(result.current.phase).toBe("done"));
  });

  it("counts only runs started by the user, not the automatic first check", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const { result } = renderHook(() =>
      useTypeTests({ ...options, updatesChecklist: false, autoRun: true })
    );
    await waitFor(() => expect(result.current.phase).toBe("done"));
    expect(result.current.manualRuns).toBe(0);
    await act(async () => result.current.run());
    await waitFor(() => expect(result.current.manualRuns).toBe(1));
  });

  it("shows the remembered verdict of the same code at once and does not check it again", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const first = renderHook(() => useTypeTests({ ...options, autoRun: true }));
    await waitFor(() => expect(first.result.current.phase).toBe("done"));
    first.unmount();
    mocks.request.mockClear();

    const { result } = renderHook(() => useTypeTests({ ...options, autoRun: true }));
    expect(result.current.phase).toBe("done");
    expect(result.current.report?.passed).toBe(3);
    expect(result.current.isStale).toBe(false);
    expect(result.current.failedRuns).toBe(0);
    await Promise.resolve();
    expect(mocks.request).not.toHaveBeenCalled();
  });

  it("checks again when the code or the tests differ from the remembered ones", async () => {
    mocks.request.mockResolvedValue({ report: report(3) });
    const first = renderHook(() => useTypeTests({ ...options, autoRun: true }));
    await waitFor(() => expect(first.result.current.phase).toBe("done"));
    first.unmount();
    mocks.request.mockClear();

    const changed = renderHook(() =>
      useTypeTests({ ...options, code: "const a = 2;", autoRun: true })
    );
    await waitFor(() => expect(mocks.request).toHaveBeenCalledOnce());
    changed.unmount();
    mocks.request.mockClear();

    renderHook(() => useTypeTests({ ...options, testsHash: "other", autoRun: true }));
    await waitFor(() => expect(mocks.request).toHaveBeenCalledOnce());
  });
});
