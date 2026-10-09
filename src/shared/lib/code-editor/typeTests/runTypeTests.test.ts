import { describe, expect, it, vi } from "vitest";
import { createNodeTypeScriptService } from "@/test/typeScriptService";
import type { TypeTestReport } from "../typescriptTypes";
import { buildTestDocument, mapToSource } from "./buildTestDocument";
import { collectTestCases } from "./collectTestCases";

vi.setConfig({ testTimeout: 30_000 });

const service = createNodeTypeScriptService();
const run = (code: string, tests: string): TypeTestReport =>
  service.typeTests({ code, filepath: "task.ts", files: [], tests });

const SOLUTION = `const add = (a: number, b: number): number => a + b;`;

describe("collectTestCases", () => {
  it("reads describe groups and top-level tests with stable ids", () => {
    const { cases, errors } = collectTestCases(
      `describe("sum", () => {\n  test("a", () => {\n  });\n});\ntest("b", () => {\n});`
    );
    expect(errors).toEqual([]);
    expect(cases.map(({ id, line }) => [id, line])).toEqual([
      ["sum/a", 2],
      ["/b", 5],
    ]);
  });

  it("rejects declarations, duplicates and non-literal names", () => {
    const { errors } = collectTestCases(
      `const helper = 1;\ntest("x", () => {});\ntest("x", () => {});\ntest(name, () => {});`
    );
    expect(errors).toHaveLength(3);
  });
});

describe("test document", () => {
  it("maps offsets back to the file they came from", () => {
    const document = buildTestDocument("const a = 1;", "test('t', () => {});");
    const inSolution = document.solutionStart + 6;
    const inTests = document.testsStart + 5;
    expect(mapToSource(document, inSolution)).toEqual({ segment: "solution", offset: 6 });
    expect(mapToSource(document, inTests)).toEqual({ segment: "tests", offset: 5 });
    expect(mapToSource(document, 3).segment).toBe("prelude");
    expect(document.text.slice(document.solutionStart, document.solutionStart + 5)).toBe("const");
  });
});

describe("runTypeTests", () => {
  it("passes positive and negative cases against a correct solution", () => {
    const report = run(
      SOLUTION,
      `describe("add", () => {
  test("returns a number", () => {
    type _ = Expect<Equal<ReturnType<typeof add>, number>>;
  });
  test("rejects strings", () => {
    // @ts-expect-error
    add("1", 2);
  });
});`
    );
    expect(report.fileError).toBeNull();
    expect(report.compile.passed).toBe(true);
    expect(report.results.map((result) => result.status)).toEqual(["passed", "passed"]);
    expect(report.passed).toBe(3);
    expect(report.total).toBe(3);
  });

  it("reports expected and actual types for a failed Equal", () => {
    const report = run(
      `const add = (a: number, b: number) => String(a + b);`,
      `test("returns a number", () => {
  type _ = Expect<Equal<ReturnType<typeof add>, number>>;
});`
    );
    const [result] = report.results;
    expect(result.status).toBe("failed");
    expect(result.failure).toMatchObject({
      kind: "mismatch",
      actual: "string",
      expected: "number",
    });
  });

  it("reports an expected error that did not happen", () => {
    const report = run(
      `const add = (a: any, b: any) => a + b;`,
      `test("rejects strings", () => {
  // @ts-expect-error
  add("1", 2);
});`
    );
    expect(report.results[0].failure).toMatchObject({
      kind: "expected-error",
      snippet: 'add("1", 2);',
    });
  });

  it("reports any other error inside a test with the compiler message", () => {
    const report = run(SOLUTION, `test("x", () => {\n  const n: string = add(1, 2);\n});`);
    expect(report.results[0].failure).toMatchObject({ kind: "diagnostic", code: 2322 });
  });

  it("does not let a solution with any pass an Equal check", () => {
    const report = run(
      `const parse = (text: string): any => JSON.parse(text);`,
      `test("is unknown", () => {\n  type _ = Expect<Equal<ReturnType<typeof parse>, unknown>>;\n});`
    );
    expect(report.results[0].status).toBe("failed");
  });

  it("fails the compile case when the solution has type errors, but keeps checking tests", () => {
    const report = run(`const add = (a, b) => a + b;`, `test("x", () => {\n  add(1, 2);\n});`);
    expect(report.compile).toMatchObject({ passed: false, reason: "errors" });
    expect(report.compile.problems.length).toBeGreaterThan(0);
    expect(report.results).toHaveLength(1);
  });

  it("is not silenced by @ts-nocheck in the solution", () => {
    const report = run(
      `// @ts-nocheck\nconst add = (a: number, b: number) => String(a + b);`,
      `test("number", () => {\n  type _ = Expect<Equal<ReturnType<typeof add>, number>>;\n});`
    );
    expect(report.compile).toMatchObject({ passed: false, reason: "nocheck" });
    expect(report.results[0].status).toBe("failed");
  });

  it("skips every case when the solution has a syntax error", () => {
    const report = run(`const add = (a: number => a;\n/* open`, `test("x", () => {});`);
    expect(report.compile.reason).toBe("syntax");
    expect(report.results.map((result) => result.status)).toEqual(["skipped"]);
    expect(report.passed).toBe(0);
  });

  it("asks to rename a solution declaration that reuses a helper name", () => {
    const report = run(`const test = 1;`, `test("x", () => {});`);
    expect(report.compile).toMatchObject({ reason: "reserved" });
    expect(report.compile.message).toContain("test");
    expect(report.results[0].status).toBe("skipped");
  });

  it("keeps an unterminated last statement from swallowing the tests", () => {
    const report = run(`const value = 1`, `test("x", () => {\n  const n: number = value;\n});`);
    expect(report.results[0].status).toBe("passed");
  });

  it("flags a broken tests file instead of crashing", () => {
    const report = run(SOLUTION, `const helper = 1;`);
    expect(report.fileError).toContain("describe()");
  });
});
