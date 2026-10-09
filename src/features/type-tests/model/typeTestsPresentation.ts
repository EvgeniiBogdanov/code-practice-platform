import type { TypeTestFailure, TypeTestReport } from "@/shared/lib/code-editor";

/** Id of the automatic "the solution compiles" case; it has no line in `tests.ts`. */
export const COMPILE_CASE_ID = "__compile__";

export const formatFailure = (failure: TypeTestFailure): string => {
  switch (failure.kind) {
    case "mismatch":
      return `Ожидалось ${failure.expected}, получено ${failure.actual}`;
    case "expected-error":
      return "Ожидалась ошибка типа, но код скомпилировался";
    case "diagnostic":
      return failure.message;
  }
};

/** Id of the first case that needs attention (the compile case comes first). */
export const getFirstFailedId = (report: TypeTestReport): string | null => {
  if (!report.compile.passed) return COMPILE_CASE_ID;
  return report.results.find((result) => result.status === "failed")?.case.id ?? null;
};

/**
 * Checklist items whose linked tests all passed. A name shared by several tests counts only
 * when every one of them passed.
 */
export const getChecklistKeysToTick = (
  taskId: string,
  checklistTests: Record<number, readonly string[]> | undefined,
  report: TypeTestReport
): string[] =>
  Object.entries(checklistTests ?? {}).flatMap(([index, names]) => {
    const allPassed = names.every((name) => {
      const matching = report.results.filter((result) => result.case.name === name);
      return matching.length > 0 && matching.every((result) => result.status === "passed");
    });
    return names.length > 0 && allPassed ? [`check-${taskId}-${index}`] : [];
  });

export const formatDuration = (milliseconds: number): string =>
  milliseconds < 100 ? "менее 0,1 с" : `${(milliseconds / 1000).toFixed(1).replace(".", ",")} с`;

export const isFullPass = (report: TypeTestReport): boolean =>
  report.total > 0 && report.passed === report.total && report.fileError === null;
