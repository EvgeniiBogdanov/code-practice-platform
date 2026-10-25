import type { DrillLoadError, DrillTestCaseResult } from "@/shared/lib/code-runners";

export interface DrillTestRow {
  /** Position in the report: a stable id for the row. */
  index: number;
  test: DrillTestCaseResult;
}

export interface DrillTestGroup {
  /** `null` for tests outside any `describe`. */
  name: string | null;
  rows: DrillTestRow[];
}

const SUITE_SEPARATOR = " › ";

/** Consecutive tests of the same `describe` form one group; order of the file is kept. */
export const groupBySuite = (tests: readonly DrillTestCaseResult[]): DrillTestGroup[] => {
  const groups: DrillTestGroup[] = [];
  tests.forEach((test, index) => {
    const name = test.suite.length > 0 ? test.suite.join(SUITE_SEPARATOR) : null;
    const last = groups.at(-1);
    if (last && last.name === name) last.rows.push({ index, test });
    else groups.push({ name, rows: [{ index, test }] });
  });
  return groups;
};

export const getLoadErrorTitle = (source: DrillLoadError["source"]): string =>
  source === "solution" ? "Решение не удалось выполнить" : "Ошибка в тестах задачи";

export const formatDuration = (ms: number): string =>
  ms < 1000 ? `${Math.max(1, Math.round(ms))} мс` : `${(ms / 1000).toFixed(1)} с`;
