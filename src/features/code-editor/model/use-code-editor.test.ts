import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCodeEditor } from "./use-code-editor";

describe("useCodeEditor with disableLinter", () => {
  const codeWithVarAndNan = `
var x = 1;
console.log(NaN === NaN);
`;

  it("lints code when disableLinter is false or not provided", () => {
    const { result } = renderHook(() =>
      useCodeEditor({
        code: codeWithVarAndNan,
        onChange: vi.fn(),
        filepath: "main.js",
        disableLinter: false,
      })
    );

    expect(result.current.lintResult.problems.length).toBeGreaterThan(0);
    expect(result.current.warningLines.size).toBeGreaterThan(0);
    expect(result.current.errorLines.size).toBeGreaterThan(0);
  });

  it("bypasses linting and returns zero errors when disableLinter is true", () => {
    const { result } = renderHook(() =>
      useCodeEditor({
        code: codeWithVarAndNan,
        onChange: vi.fn(),
        filepath: "main.js",
        disableLinter: true,
      })
    );

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
});
