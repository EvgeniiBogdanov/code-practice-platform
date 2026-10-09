import type {
  TestOutlineItem,
  TypeTestReport,
  TypeTestResult,
  TypeTestStatus,
} from "@/shared/lib/code-editor";
import type { TestStatus } from "@/shared/ui";

export interface CaseRow {
  id: string;
  name: string;
  status: TestStatus;
  /** Present once the case has been checked. */
  result: TypeTestResult | null;
}

export interface CaseGroup {
  /** `describe` title; null for tests outside any group. */
  name: string | null;
  rows: CaseRow[];
}

const STATUS_BY_RESULT: Record<TypeTestStatus, TestStatus> = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
};

/** The rows of the list: the outline of `tests.ts` merged with the latest report, if any. */
export const buildCaseGroups = (
  outline: readonly TestOutlineItem[],
  report: TypeTestReport | null
): CaseGroup[] => {
  const resultById = new Map(report?.results.map((result) => [result.case.id, result]));
  const groups: CaseGroup[] = [];
  for (const item of outline) {
    const result = resultById.get(item.id) ?? null;
    const row: CaseRow = {
      id: item.id,
      name: item.name,
      status: result ? STATUS_BY_RESULT[result.status] : "idle",
      result,
    };
    const last = groups[groups.length - 1];
    if (last && last.name === item.describe && item.describe !== null) last.rows.push(row);
    else groups.push({ name: item.describe, rows: [row] });
  }
  return groups;
};
