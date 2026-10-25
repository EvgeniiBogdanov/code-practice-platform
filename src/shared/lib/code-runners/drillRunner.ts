/**
 * Runs a solution against a drill test file in a dedicated Web Worker.
 */

import NodeWorker from "./nodeWorker?worker";
import { isTestResultMessage, type DrillTestsReport, type RunTestsMessage } from "./drillTestTypes";
import { transpileCode } from "./transpiler";

export interface RunDrillTestsOptions {
  /** Name of the solution file: decides whether TypeScript is stripped. */
  filename?: string;
  /** Limit for the whole run, including the loop protection. */
  timeoutMs?: number;
  /** Limit for one test. */
  testTimeoutMs?: number;
}

const DEFAULT_RUN_TIMEOUT_MS = 12000;

let activeWorker: Worker | null = null;

export function cancelDrillTests(): void {
  activeWorker?.terminate();
  activeWorker = null;
}

const failedReport = (
  source: "solution" | "tests",
  message: string,
  durationMs = 0
): DrillTestsReport => ({ tests: [], loadError: { source, message }, durationMs });

export function runDrillTests(
  solution: string,
  tests: string,
  options: RunDrillTestsOptions = {}
): Promise<DrillTestsReport> {
  const { filename = "solution.ts", timeoutMs = DEFAULT_RUN_TIMEOUT_MS, testTimeoutMs } = options;

  cancelDrillTests();

  const solutionResult = transpileCode(solution, filename);
  if (solutionResult.error) {
    return Promise.resolve(failedReport("solution", solutionResult.error.message));
  }
  const testsResult = transpileCode(tests, "tests.ts");
  if (testsResult.error) {
    return Promise.resolve(failedReport("tests", testsResult.error.message));
  }

  return new Promise<DrillTestsReport>((resolve) => {
    const startedAt = performance.now();
    const elapsed = (): number => Math.round((performance.now() - startedAt) * 10) / 10;
    let worker: Worker;
    try {
      worker = new NodeWorker();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      resolve(failedReport("solution", `Не удалось запустить Web Worker: ${message}`));
      return;
    }
    activeWorker = worker;

    const finish = (report: DrillTestsReport): void => {
      clearTimeout(timer);
      worker.terminate();
      if (activeWorker === worker) activeWorker = null;
      resolve(report);
    };

    const timer = setTimeout(() => {
      finish(
        failedReport(
          "solution",
          `Время выполнения превысило ${timeoutMs}ms (сработала защита от бесконечного цикла)`,
          elapsed()
        )
      );
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<unknown>): void => {
      if (isTestResultMessage(event.data)) finish(event.data.report);
    };
    worker.onerror = (event: ErrorEvent): void => {
      finish(failedReport("solution", event.message || "Ошибка в потоке Web Worker", elapsed()));
    };

    const message: RunTestsMessage = {
      type: "RUN_TESTS",
      solutionCode: solutionResult.code ?? "",
      testsCode: testsResult.code ?? "",
      testTimeoutMs,
    };
    worker.postMessage(message);
  });
}
