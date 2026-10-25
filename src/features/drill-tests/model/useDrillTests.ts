import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelDrillTests,
  isDrillReportPassed,
  runDrillTests,
  type DrillTestsReport,
} from "@/shared/lib/code-runners";

export type DrillTestsPhase = "idle" | "running";

export interface UseDrillTestsOptions {
  enabled: boolean;
  taskId: string;
  code: string;
  /** Name of the solution file: decides whether TypeScript is stripped. */
  filename: string;
  tests: string;
  /** Called once per run in which every test passed (the caller marks the task solved). */
  onAllPassed?: () => void;
}

export interface DrillTestsController {
  phase: DrillTestsPhase;
  report: DrillTestsReport | null;
  /** The code was edited after the report was made. */
  isStale: boolean;
  /** Rows (by index in the report) whose details are open. */
  expandedRows: ReadonlySet<number>;
  /** Grows on every user-started run; the panel reveals itself when it changes. */
  manualRuns: number;
  run: () => void;
  toggleRow: (index: number) => void;
}

interface FinishedRun {
  taskId: string;
  code: string;
  report: DrillTestsReport;
}

export const useDrillTests = ({
  enabled,
  taskId,
  code,
  filename,
  tests,
  onAllPassed,
}: UseDrillTestsOptions): DrillTestsController => {
  const [phase, setPhase] = useState<DrillTestsPhase>("idle");
  const [finished, setFinished] = useState<FinishedRun | null>(null);
  const [expandedRows, setExpandedRows] = useState<ReadonlySet<number>>(new Set());
  const [manualRuns, setManualRuns] = useState(0);
  const runIdRef = useRef(0);
  const onAllPassedRef = useRef(onAllPassed);
  useEffect(() => {
    onAllPassedRef.current = onAllPassed;
  });

  // A run that is still going belongs to the previous task or an unmounted panel.
  useEffect(() => {
    return (): void => {
      runIdRef.current += 1;
      cancelDrillTests();
      setPhase("idle");
    };
  }, [taskId]);

  const run = useCallback((): void => {
    if (!enabled) return;
    const runId = ++runIdRef.current;
    setPhase("running");
    setManualRuns((count) => count + 1);
    void runDrillTests(code, tests, { filename }).then((report) => {
      if (runId !== runIdRef.current) return;
      setFinished({ taskId, code, report });
      setExpandedRows(new Set(report.tests.flatMap((test, index) => (test.passed ? [] : [index]))));
      setPhase("idle");
      if (isDrillReportPassed(report)) onAllPassedRef.current?.();
    });
  }, [enabled, taskId, code, tests, filename]);

  const toggleRow = useCallback((index: number): void => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }, []);

  const current = finished?.taskId === taskId ? finished : null;

  return {
    phase,
    report: current?.report ?? null,
    isStale: current !== null && current.code !== code,
    expandedRows,
    manualRuns,
    run,
    toggleRow,
  };
};
