import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCodeEditor } from "./useCodeEditor";
import { useUIStore } from "@/entities/ui-state";

describe("useCodeEditor diagnostics integration", () => {
  const code = "const value = missing;";

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useUIStore.setState({ editorLinterEnabled: false });
  });

  it("defaults to linter disabled with no problems", () => {
    const { result } = renderHook(() =>
      useCodeEditor({ code, onChange: vi.fn(), filepath: "main.js" })
    );

    expect(result.current.isLinterEnabled).toBe(false);
    expect(result.current.diagnostics.problems).toEqual([]);
    expect(result.current.diagnostics.errorCount).toBe(0);
    expect(result.current.diagnostics.activeDiagnostic).toBeNull();
    expect(result.current.isAnalysisPending).toBe(false);
  });

  it("toggles the linter in the UI store", () => {
    const { result } = renderHook(() =>
      useCodeEditor({ code, onChange: vi.fn(), filepath: "main.js" })
    );

    act(() => result.current.handleToggleLinter(true));
    expect(useUIStore.getState().editorLinterEnabled).toBe(true);
    act(() => result.current.handleToggleLinter());
    expect(useUIStore.getState().editorLinterEnabled).toBe(false);
  });

  it("does not apply quick fixes in read-only mode", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useCodeEditor({ code, onChange, filepath: "main.js", readOnly: true })
    );

    act(() => result.current.applyQuickFix(0));

    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.history.canUndo).toBe(false);
  });
});
