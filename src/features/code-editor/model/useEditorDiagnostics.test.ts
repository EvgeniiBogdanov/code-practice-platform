import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { EditorDiagnostic, TypeScriptCodeFix } from "@/shared/lib/code-editor";
import { useEditorDiagnostics } from "./useEditorDiagnostics";

const problem = (overrides: Partial<EditorDiagnostic>): EditorDiagnostic => ({
  id: "p",
  line: 1,
  col: 1,
  start: 0,
  end: 1,
  code: 2304,
  message: "TS2304: Cannot find name 'x'.",
  severity: "error",
  ...overrides,
});

const importFix: TypeScriptCodeFix = {
  description: 'Add import from "react"',
  changes: [{ filepath: "App.tsx", start: 0, end: 0, newText: "import x;\n" }],
};

describe("useEditorDiagnostics", () => {
  const base = {
    isPending: false,
    cursorOffset: 0,
    cursorLine: 1,
    filepath: "App.tsx",
    readOnly: false,
  };

  it("summarises problems and keeps hints out of counts and gutter", () => {
    const problems = [
      problem({ id: "e", line: 2 }),
      problem({ id: "w", line: 3, severity: "warning" }),
      problem({ id: "h", line: 4, severity: "hint" }),
    ];
    const { result } = renderHook(() =>
      useEditorDiagnostics({ ...base, problems, requestCodeFixes: vi.fn(async () => []) })
    );
    expect(result.current.errorCount).toBe(1);
    expect(result.current.warningCount).toBe(1);
    expect([...result.current.errorLines]).toEqual([2]);
    expect(result.current.lineMessages.has(4)).toBe(false);
    expect(result.current.problems).toHaveLength(3);
  });

  it("prefers the problem under the caret and loads its fixes", async () => {
    const atCaret = problem({ id: "caret", start: 10, end: 15, line: 2 });
    const requestCodeFixes = vi.fn(async () => [importFix]);
    const { result } = renderHook(() =>
      useEditorDiagnostics({
        ...base,
        cursorOffset: 12,
        cursorLine: 2,
        problems: [problem({ id: "first" }), atCaret],
        requestCodeFixes,
      })
    );
    expect(result.current.activeDiagnostic).toBe(atCaret);
    await waitFor(() => expect(result.current.quickFixes).toEqual([importFix]));
    expect(requestCodeFixes).toHaveBeenCalledWith(atCaret);
  });

  it("drops fixes that edit another file", async () => {
    const foreign = { ...importFix, changes: [{ ...importFix.changes[0], filepath: "B.tsx" }] };
    const requestCodeFixes = vi.fn(async () => [foreign]);
    const { result } = renderHook(() =>
      useEditorDiagnostics({ ...base, problems: [problem({})], requestCodeFixes })
    );
    await waitFor(() => expect(requestCodeFixes).toHaveBeenCalled());
    expect(result.current.quickFixes).toEqual([]);
  });
});
