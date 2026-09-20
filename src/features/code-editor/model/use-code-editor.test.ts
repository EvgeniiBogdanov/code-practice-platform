import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCodeEditor } from "./use-code-editor";
import { useUIStore } from "@/entities/ui-state";

describe("useCodeEditor linter integration", () => {
  const codeWithVarAndNan = `
var x = 1;
console.log(NaN === NaN);
`;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useUIStore.setState({ editorLinterEnabled: false });
  });

  it("defaults to linter disabled (false) with zero lint errors", () => {
    const { result } = renderHook(() =>
      useCodeEditor({
        code: codeWithVarAndNan,
        onChange: vi.fn(),
        filepath: "main.js",
      })
    );

    expect(result.current.isLinterEnabled).toBe(false);
    expect(result.current.lintResult.problems).toEqual([]);
    expect(result.current.lintResult.errorCount).toBe(0);
    expect(result.current.lintResult.warningCount).toBe(0);
    expect(result.current.lintResult.isValid).toBe(true);
    expect(result.current.errorLines.size).toBe(0);
    expect(result.current.warningLines.size).toBe(0);
    expect(result.current.activeTypo).toBeNull();
    expect(result.current.activeMissingImport).toBeNull();
    expect(result.current.isAnalysisPending).toBe(false);
  });

  it("allows toggling linter on and off, updating store and computing problems when enabled", () => {
    const { result } = renderHook(() =>
      useCodeEditor({
        code: codeWithVarAndNan,
        onChange: vi.fn(),
        filepath: "main.js",
      })
    );

    expect(result.current.isLinterEnabled).toBe(false);
    expect(result.current.lintResult.problems).toEqual([]);

    act(() => {
      result.current.handleToggleLinter(true);
    });

    expect(result.current.isLinterEnabled).toBe(true);
    expect(useUIStore.getState().editorLinterEnabled).toBe(true);
    expect(result.current.lintResult.problems.length).toBeGreaterThan(0);
    expect(result.current.warningLines.size).toBeGreaterThan(0);
    expect(result.current.errorLines.size).toBeGreaterThan(0);

    act(() => {
      result.current.handleToggleLinter(false);
    });

    expect(result.current.isLinterEnabled).toBe(false);
    expect(useUIStore.getState().editorLinterEnabled).toBe(false);
    expect(result.current.lintResult.problems).toEqual([]);
  });

  it("toggles linter when handleToggleLinter is called without arguments", () => {
    const { result } = renderHook(() =>
      useCodeEditor({
        code: codeWithVarAndNan,
        onChange: vi.fn(),
        filepath: "main.js",
      })
    );

    expect(result.current.isLinterEnabled).toBe(false);

    act(() => {
      result.current.handleToggleLinter();
    });

    expect(result.current.isLinterEnabled).toBe(true);
    expect(useUIStore.getState().editorLinterEnabled).toBe(true);

    act(() => {
      result.current.handleToggleLinter();
    });

    expect(result.current.isLinterEnabled).toBe(false);
    expect(useUIStore.getState().editorLinterEnabled).toBe(false);
  });
});
