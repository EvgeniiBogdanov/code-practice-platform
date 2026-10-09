import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  acquireTypeScriptClient,
  type TypeScriptClient,
  type TypeTestReport,
} from "@/shared/lib/code-editor";
import { useLatest } from "@/shared/lib/hooks";
import { useProgressStore } from "@/entities/progress";
import { cacheReport, getCachedReport } from "./typeTestsCache";
import { getChecklistKeysToTick, getFirstFailedId, isFullPass } from "./typeTestsPresentation";

/** A type that never settles must not hang the panel: the check is abandoned after this long. */
export const TYPE_TESTS_TIMEOUT_MS = 5000;
/** Failed runs in a row (each with changed code) after which the panel suggests a hint. */
export const HINT_AFTER_FAILED_RUNS = 2;

export interface UseTypeTestsOptions {
  taskId: string;
  /** The solution being checked and the name of its file. */
  code: string;
  filepath: string;
  tests: string;
  testsHash: string;
  /** Tick the checklist items whose linked tests passed (not for the reference solution). */
  updatesChecklist: boolean;
  /** Checks once on mount. */
  autoRun?: boolean;
  /** False for tasks without tests: nothing is started and no worker is acquired. */
  enabled?: boolean;
  checklistTests?: Record<number, readonly string[]>;
}

interface State {
  phase: "idle" | "running" | "done" | "unavailable" | "timeout";
  report: TypeTestReport | null;
  /** Code the report was computed for. */
  checkedCode: string | null;
  /** Code of the latest failed run: a rerun of the same code does not count as another failure. */
  lastFailedCode: string | null;
  failedRuns: number;
  expandedIds: ReadonlySet<string>;
  /** Runs started by the user (button, shortcut), unlike the automatic first check. */
  manualRuns: number;
}

type Action =
  | { type: "start"; isManual: boolean }
  | { type: "finish"; report: TypeTestReport; code: string }
  | { type: "restore"; report: TypeTestReport; code: string }
  | { type: "fail"; reason: "unavailable" | "timeout" }
  | { type: "toggle"; id: string }
  | { type: "reset" };

const INITIAL_STATE: State = {
  phase: "idle",
  report: null,
  checkedCode: null,
  lastFailedCode: null,
  failedRuns: 0,
  expandedIds: new Set(),
  manualRuns: 0,
};

const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case "start":
      return {
        ...state,
        phase: "running",
        manualRuns: state.manualRuns + (action.isManual ? 1 : 0),
      };
    case "finish": {
      const firstFailed = getFirstFailedId(action.report);
      const passed = isFullPass(action.report);
      const isNewFailure = !passed && action.code !== state.lastFailedCode;
      return {
        ...state,
        phase: "done",
        report: action.report,
        checkedCode: action.code,
        lastFailedCode: passed ? null : action.code,
        failedRuns: passed ? 0 : isNewFailure ? state.failedRuns + 1 : state.failedRuns,
        expandedIds: new Set(firstFailed ? [firstFailed] : []),
      };
    }
    case "restore":
      // A remembered verdict: shown as a finished run, but it is not a new failed attempt.
      return {
        ...state,
        phase: "done",
        report: action.report,
        checkedCode: action.code,
        expandedIds: new Set(getFirstFailedId(action.report) ?? []),
      };
    case "fail":
      return { ...state, phase: action.reason };
    case "toggle": {
      const expandedIds = new Set(state.expandedIds);
      if (!expandedIds.delete(action.id)) expandedIds.add(action.id);
      return { ...state, expandedIds };
    }
    case "reset":
      return INITIAL_STATE;
  }
};

export interface TypeTestsController {
  phase: State["phase"];
  report: TypeTestReport | null;
  /** The code changed after the report was computed. */
  isStale: boolean;
  failedRuns: number;
  expandedIds: ReadonlySet<string>;
  manualRuns: number;
  run: () => void;
  toggleCase: (id: string) => void;
  /** Forgets the results, e.g. after the solution was reset to the starter. */
  reset: () => void;
}

/** Runs the type tests of a task and exposes their state to the panel. */
export const useTypeTests = (options: UseTypeTestsOptions): TypeTestsController => {
  const { code, autoRun = false, enabled = true, taskId, testsHash } = options;
  const [state, dispatch] = useReducer(reduce, INITIAL_STATE);
  // This exact code was already checked against these tests: show that verdict in the first frame.
  const cached = enabled ? getCachedReport(taskId, testsHash, code) : null;
  if (cached && state.checkedCode !== code && state.phase !== "running") {
    dispatch({ type: "restore", report: cached, code });
  }
  const latest = useLatest(options);
  const clientRef = useRef<TypeScriptClient | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const client = acquireTypeScriptClient();
    clientRef.current = client;
    return (): void => {
      client.release();
      clientRef.current = null;
    };
  }, [enabled]);

  const runChecks = useCallback(
    async (isManual: boolean): Promise<void> => {
      const client = clientRef.current;
      if (isRunningRef.current) return;
      const {
        taskId,
        testsHash,
        code: solution,
        filepath,
        tests,
        checklistTests,
        updatesChecklist,
      } = latest.current;
      isRunningRef.current = true;
      dispatch({ type: "start", isManual });
      try {
        let timedOut = false;
        const response = await client?.request(
          { kind: "tests", code: solution, filepath, files: [], tests },
          { timeoutMs: TYPE_TESTS_TIMEOUT_MS, onTimeout: () => (timedOut = true) }
        );
        const report = response?.report;
        if (!report) {
          dispatch({ type: "fail", reason: timedOut ? "timeout" : "unavailable" });
          return;
        }
        if (updatesChecklist && !report.fileError) {
          const keys = getChecklistKeysToTick(taskId, checklistTests, report);
          if (keys.length > 0) await useProgressStore.getState().checkChecklistItems(keys);
        }
        if (!report.fileError) cacheReport(taskId, testsHash, solution, report);
        dispatch({ type: "finish", report, code: solution });
      } finally {
        isRunningRef.current = false;
      }
    },
    [latest]
  );

  // Only the first check is automatic: later edits make the result stale instead of re-running.
  const autoRanRef = useRef(false);
  useEffect(() => {
    if (!enabled || !autoRun || autoRanRef.current) return;
    autoRanRef.current = true;
    if (!cached) void runChecks(false);
  }, [enabled, autoRun, cached, runChecks]);

  const run = useCallback((): void => void runChecks(true), [runChecks]);
  const isStale = state.phase === "done" && state.checkedCode !== code;
  const toggleCase = useCallback((id: string) => dispatch({ type: "toggle", id }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const { report } = state;
  return {
    phase: state.phase,
    report,
    isStale,
    failedRuns: state.failedRuns,
    expandedIds: state.expandedIds,
    manualRuns: state.manualRuns,
    run,
    toggleCase,
    reset,
  };
};
