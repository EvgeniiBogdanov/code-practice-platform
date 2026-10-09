import { describe, expect, it } from "vitest";
import type { TypeTestReport } from "@/shared/lib/code-editor";
import { buildCaseGroups } from "./typeTestsRows";

const outline = [
  { id: "sum/a", name: "a", describe: "sum", line: 2 },
  { id: "sum/b", name: "b", describe: "sum", line: 5 },
  { id: "/c", name: "c", describe: null, line: 8 },
  { id: "/d", name: "d", describe: null, line: 9 },
];

describe("buildCaseGroups", () => {
  it("groups tests by describe and keeps every test outside a group on its own", () => {
    const groups = buildCaseGroups(outline, null);
    expect(groups.map((group) => [group.name, group.rows.map((row) => row.name)])).toEqual([
      ["sum", ["a", "b"]],
      [null, ["c"]],
      [null, ["d"]],
    ]);
    expect(groups.flatMap((group) => group.rows).every((row) => row.status === "idle")).toBe(true);
  });

  it("takes statuses from the report", () => {
    const report = {
      results: [
        { case: { id: "sum/a" }, status: "passed", failure: null, location: null },
        { case: { id: "sum/b" }, status: "failed", failure: null, location: null },
      ],
    } as unknown as TypeTestReport;
    const rows = buildCaseGroups(outline, report).flatMap((group) => group.rows);
    expect(rows.map((row) => row.status)).toEqual(["passed", "failed", "idle", "idle"]);
    expect(rows[1].result?.status).toBe("failed");
  });
});
