import { describe, expect, it, vi } from "vitest";
import { createNodeTypeScriptService } from "@/test/typeScriptService";
import { parseTestOutline } from "@/shared/lib/code-editor/typeTests/parseTestOutline";
import { collectTestCases } from "@/shared/lib/code-editor/typeTests/collectTestCases";
import type { TypeTestReport } from "@/shared/lib/code-editor/typescriptTypes";
import { BASICS_GROUP } from "../curriculum/typescript/data/groups/basics";
import { NARROWING_GROUP } from "../curriculum/typescript/data/groups/narrowing";
import { GENERICS_GROUP } from "../curriculum/typescript/data/groups/generics";
import { UTILITY_TYPES_GROUP } from "../curriculum/typescript/data/groups/utilityTypes";
import { TYPE_TRANSFORMATIONS_GROUP } from "../curriculum/typescript/data/groups/typeTransformations";
import { APPLICATION_PATTERNS_GROUP } from "../curriculum/typescript/data/groups/applicationPatterns";
import { ADVANCED_TYPES_GROUP } from "../curriculum/typescript/data/groups/advancedTypes";
import type { TypeScriptTaskGroup } from "../curriculum/typescript/data/taskMeta";

// One real language service for the whole curriculum; cold programs are slow under CI coverage.
vi.setConfig({ testTimeout: 120_000 });

const GROUPS: readonly TypeScriptTaskGroup[] = [
  BASICS_GROUP,
  NARROWING_GROUP,
  GENERICS_GROUP,
  UTILITY_TYPES_GROUP,
  TYPE_TRANSFORMATIONS_GROUP,
  APPLICATION_PATTERNS_GROUP,
  ADVANCED_TYPES_GROUP,
];

const load = (modules: Record<string, string>, prefix: string): Map<string, string> =>
  new Map(Object.entries(modules).map(([path, source]) => [path.split(prefix)[1], source]));

const starters = load(
  import.meta.glob<string>("../curriculum/typescript/tasks/**/*.ts", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "/tasks/"
);
const solutions = load(
  import.meta.glob<string>("../curriculum/typescript/solutions/**/*.ts", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "/solutions/"
);
const alternatives = load(
  import.meta.glob<string>("../curriculum/typescript/solutions-alt/**/*.ts", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "/solutions-alt/"
);
const tests = load(
  import.meta.glob<string>("../curriculum/typescript/tests/**/*.ts", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  "/tests/"
);

const TASKS = GROUPS.flatMap((group, groupIndex) =>
  group.tasks.map((task) => ({ ...task, groupIndex }))
);
const service = createNodeTypeScriptService();
const run = (code: string, filepath: string): TypeTestReport =>
  service.typeTests({ code, filepath, files: [], tests: tests.get(filepath) ?? "" });
const describeReport = (report: TypeTestReport): string[] => [
  ...(report.compile.passed
    ? []
    : [
        `compile: ${report.compile.message ?? report.compile.problems.map((p) => p.message).join("; ")}`,
      ]),
  ...(report.fileError ? [`file: ${report.fileError}`] : []),
  ...report.results
    .filter((result) => result.status !== "passed")
    .map((result) => `${result.case.name}: ${JSON.stringify(result.failure)}`),
];

describe("TypeScript curriculum tests", () => {
  it("has a tests file for every task and none without a task", () => {
    expect([...tests.keys()].sort()).toEqual(TASKS.map((task) => task.filepath).sort());
  });

  it.each(TASKS.map((task) => [task.filepath, task] as const))(
    "%s: well-formed tests, passing reference, failing starter",
    (filepath, task) => {
      const source = tests.get(filepath) ?? "";
      const { cases, errors } = collectTestCases(source);
      expect(errors).toEqual([]);
      expect(cases.length).toBeGreaterThanOrEqual(2);
      // The panel lists tests with a light parser before the first run: it must agree with the AST.
      expect(parseTestOutline(source).map((item) => [item.id, item.line])).toEqual(
        cases.map((item) => [item.id, item.line])
      );
      expect(cases.length).toBeLessThanOrEqual(8);

      const reference = run(solutions.get(filepath) ?? "", filepath);
      expect(describeReport(reference)).toEqual([]);

      const starter = run(starters.get(filepath) ?? "", filepath);
      expect(starter.fileError).toBeNull();
      // A starter may break only the compile case (errors inside function bodies are invisible to
      // type tests), but it must never pass everything.
      expect(starter.passed).toBeLessThan(starter.total);

      // Every linked checklist item must point at existing tests.
      const names = new Set(cases.map((item) => item.name));
      for (const item of task.checklist) {
        if (typeof item !== "string") for (const name of item.tests) expect(names).toContain(name);
      }

      // Groups 1–3 predate utility types: their tests use calls and assignments only.
      if (task.groupIndex < 3) {
        expect(source).not.toMatch(/\b(Equal|Expect|ReturnType|Parameters|Prettify|Awaited)\b/);
      }
    }
  );

  it("passes every alternative reference solution", () => {
    for (const [name, source] of alternatives) {
      const filepath = name.replace(/\.\d+\.ts$/, ".ts");
      expect(tests.has(filepath), name).toBe(true);
      expect(describeReport(run(source, filepath)), name).toEqual([]);
    }
  });

  it("keeps must-fail examples out of the starters and references", () => {
    for (const [name, source] of [...starters, ...solutions]) {
      // A call followed by "должно быть ошибкой" is a must-fail example: it belongs in tests.ts.
      expect(source, name).not.toMatch(/;[ \t]*\/\/[^\n]*должн[оа] быть ошибкой/);
      expect(source, name).not.toMatch(/^\s*\/\/\s*[^/\s].*;\s*\/\/\s*Ошибка/m);
    }
  });
});
