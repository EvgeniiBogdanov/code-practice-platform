import { describe, expect, it } from "vitest";
import { runDrillSuite } from "@/shared/lib/code-runners/drillHarness";
import { transpileCode } from "@/shared/lib/code-runners/transpiler";
import { SYSTEM_DESIGN_TASKS } from "../curriculum/system-design/data/tasksData";
import { SYSTEM_DESIGN_HINTS } from "../curriculum/system-design/data/systemDesignHints";

const run = (solution: string, tests: string): ReturnType<typeof runDrillSuite> =>
  runDrillSuite({
    solutionCode: transpileCode(solution, "solution.ts").code ?? "",
    testsCode: transpileCode(tests, "tests.ts").code ?? "",
  });

describe("system design drills", () => {
  it("has unique ids with the sd- prefix and a hint for each drill", () => {
    const ids = SYSTEM_DESIGN_TASKS.map((task) => String(task.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("sd-"))).toBe(true);
    expect(Object.keys(SYSTEM_DESIGN_HINTS).sort()).toEqual([...ids].sort());
  });

  it.each(SYSTEM_DESIGN_TASKS.map((task) => [task.id, task] as const))(
    "%s: the reference solution passes every test",
    async (_id, task) => {
      const report = await run(task.rawSolution ?? "", task.rawTests ?? "");
      expect(report.loadError).toBeNull();
      expect(report.tests.length).toBeGreaterThan(3);
      const failed = report.tests.filter((test) => !test.passed);
      expect(failed.map((test) => `${test.name}: ${test.error}`)).toEqual([]);
    }
  );

  it.each(SYSTEM_DESIGN_TASKS.map((task) => [task.id, task] as const))(
    "%s: the starter code leaves most tests failing",
    async (_id, task) => {
      const report = await run(task.rawCandidate ?? "", task.rawTests ?? "");
      expect(report.loadError).toBeNull();
      const passed = report.tests.filter((test) => test.passed).length;
      expect(passed).toBeLessThan(report.tests.length);
    }
  );
});
