import { useCallback, useEffect, useMemo, useState } from "react";
import type { EditorDiagnostic, TypeScriptCodeFix } from "@/shared/lib/code-editor";

const NO_PROBLEMS: EditorDiagnostic[] = [];

interface EditorDiagnosticsOptions {
  problems: EditorDiagnostic[] | null;
  isPending: boolean;
  cursorOffset: number;
  cursorLine: number;
  filepath: string;
  readOnly: boolean;
  requestCodeFixes: (diagnostic: EditorDiagnostic) => Promise<TypeScriptCodeFix[]>;
}

export interface EditorDiagnosticsState {
  /** All diagnostics, including unused-code hints for dimming. */
  problems: EditorDiagnostic[];
  errorCount: number;
  warningCount: number;
  errorLines: Set<number>;
  warningLines: Set<number>;
  lineMessages: Map<number, string[]>;
  /** Problem the quick-fix bar talks about: at the caret, on its line, else the first error. */
  activeDiagnostic: EditorDiagnostic | null;
  quickFixes: TypeScriptCodeFix[];
  getProblemsAt: (offset: number) => EditorDiagnostic[];
}

export const useEditorDiagnostics = ({
  problems: rawProblems,
  isPending,
  cursorOffset,
  cursorLine,
  filepath,
  readOnly,
  requestCodeFixes,
}: EditorDiagnosticsOptions): EditorDiagnosticsState => {
  const problems = rawProblems ?? NO_PROBLEMS;
  const summary = useMemo(() => {
    const visible = problems.filter((problem) => problem.severity !== "hint");
    const lineMessages = new Map<number, string[]>();
    for (const problem of visible) {
      lineMessages.set(problem.line, [...(lineMessages.get(problem.line) ?? []), problem.message]);
    }
    const lines = (severity: EditorDiagnostic["severity"]): Set<number> =>
      new Set(visible.filter((problem) => problem.severity === severity).map(({ line }) => line));
    return {
      visible,
      lineMessages,
      errorLines: lines("error"),
      warningLines: lines("warning"),
      errorCount: visible.filter((problem) => problem.severity === "error").length,
    };
  }, [problems]);

  const activeDiagnostic = useMemo(
    () =>
      summary.visible.find(({ start, end }) => start <= cursorOffset && cursorOffset <= end) ??
      summary.visible.find(({ line }) => line === cursorLine) ??
      summary.visible.find(({ severity }) => severity === "error") ??
      null,
    [summary.visible, cursorOffset, cursorLine]
  );

  const [fixes, setFixes] = useState<{
    diagnostic: EditorDiagnostic;
    fixes: TypeScriptCodeFix[];
  } | null>(null);
  useEffect(() => {
    if (!activeDiagnostic || activeDiagnostic.synthetic || readOnly || isPending) return;
    let cancelled = false;
    void requestCodeFixes(activeDiagnostic).then((available) => {
      if (cancelled) return;
      setFixes({
        // Identity, not id: offsets of a fix belong to one diagnostics run.
        diagnostic: activeDiagnostic,
        // The editor applies fixes to the open document only.
        fixes: available.filter((fix) =>
          fix.changes.every((change) => change.filepath === filepath)
        ),
      });
    });
    return (): void => {
      cancelled = true;
    };
  }, [activeDiagnostic, readOnly, isPending, filepath, requestCodeFixes]);

  const getProblemsAt = useCallback(
    (offset: number): EditorDiagnostic[] =>
      summary.visible.filter(
        ({ start, end, synthetic }) =>
          !synthetic && start <= offset && offset < Math.max(end, start + 1)
      ),
    [summary.visible]
  );

  return {
    problems,
    errorCount: summary.errorCount,
    warningCount: summary.visible.length - summary.errorCount,
    errorLines: summary.errorLines,
    warningLines: summary.warningLines,
    lineMessages: summary.lineMessages,
    activeDiagnostic,
    quickFixes:
      activeDiagnostic && !isPending && fixes?.diagnostic === activeDiagnostic ? fixes.fixes : [],
    getProblemsAt,
  };
};
