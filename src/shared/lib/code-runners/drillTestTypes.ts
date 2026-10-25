/** Protocol between the main thread and the worker for the "solution + tests" mode. */

export interface DrillTestCaseResult {
  /** Names of the enclosing `describe` blocks, outermost first. */
  suite: readonly string[];
  name: string;
  passed: boolean;
  error: string | null;
  durationMs: number;
}

/** The solution or the tests file threw while loading: no test could be collected or run. */
export interface DrillLoadError {
  source: "solution" | "tests";
  message: string;
}

export interface DrillTestsReport {
  tests: readonly DrillTestCaseResult[];
  loadError: DrillLoadError | null;
  durationMs: number;
}

export interface RunTestsMessage {
  type: "RUN_TESTS";
  /** Transpiled to CommonJS-style JavaScript. */
  solutionCode: string;
  testsCode: string;
  testTimeoutMs?: number;
}

export interface TestResultMessage {
  type: "TEST_RESULT";
  report: DrillTestsReport;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isRunTestsMessage = (data: unknown): data is RunTestsMessage =>
  isRecord(data) &&
  data.type === "RUN_TESTS" &&
  typeof data.solutionCode === "string" &&
  typeof data.testsCode === "string";

export const isTestResultMessage = (data: unknown): data is TestResultMessage =>
  isRecord(data) && data.type === "TEST_RESULT" && isRecord(data.report);

/** True only if the report has tests, none failed and nothing broke while loading. */
export const isDrillReportPassed = (report: DrillTestsReport): boolean =>
  report.loadError === null && report.tests.length > 0 && report.tests.every((t) => t.passed);
