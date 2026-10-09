import { describe, expect, it } from "vitest";
import type { TypeTestCase, TypeTestReport, TypeTestResult } from "@/shared/lib/code-editor";
import {
  COMPILE_CASE_ID,
  formatDuration,
  formatFailure,
  getChecklistKeysToTick,
  getFirstFailedId,
  isFullPass,
} from "./typeTestsPresentation";

const makeCase = (name: string, line: number): TypeTestCase => ({
  id: `/${name}`,
  name,
  describe: null,
  line,
  start: line * 10,
  end: line * 10 + 5,
});

const passed = (name: string, line: number): TypeTestResult => ({
  case: makeCase(name, line),
  status: "passed",
  failure: null,
});

const failed = (name: string, line: number): TypeTestResult => ({
  case: makeCase(name, line),
  status: "failed",
  failure: { kind: "mismatch", expected: "number", actual: "unknown", message: "TS2344" },
});

const report = (overrides: Partial<TypeTestReport> = {}): TypeTestReport => ({
  compile: { passed: true, problems: [], reason: null, message: null },
  results: [passed("a", 1), failed("b", 5)],
  fileError: null,
  passed: 2,
  total: 3,
  durationMs: 420,
  ...overrides,
});

describe("formatFailure", () => {
  it("explains each kind of failure", () => {
    expect(
      formatFailure({ kind: "mismatch", expected: "number", actual: "string", message: "" })
    ).toBe("Ожидалось number, получено string");
    expect(formatFailure({ kind: "expected-error", snippet: "x" })).toContain(
      "Ожидалась ошибка типа"
    );
    expect(formatFailure({ kind: "diagnostic", message: "TS2322: boom", code: 2322 })).toBe(
      "TS2322: boom"
    );
  });
});

describe("getFirstFailedId", () => {
  it("puts the compile case first", () => {
    expect(getFirstFailedId(report())).toBe("/b");
    expect(
      getFirstFailedId(
        report({ compile: { passed: false, problems: [], reason: "errors", message: null } })
      )
    ).toBe(COMPILE_CASE_ID);
    expect(getFirstFailedId(report({ results: [passed("a", 1)] }))).toBeNull();
  });
});

describe("getChecklistKeysToTick", () => {
  it("ticks items whose linked tests all passed", () => {
    expect(
      getChecklistKeysToTick("typescript-1", { 0: ["a"], 1: ["b"], 2: ["a", "b"] }, report())
    ).toEqual(["check-typescript-1-0"]);
  });

  it("does not tick an item linked to an unknown test or to nothing", () => {
    expect(getChecklistKeysToTick("t", { 0: ["missing"], 1: [] }, report())).toEqual([]);
    expect(getChecklistKeysToTick("t", undefined, report())).toEqual([]);
  });

  it("needs every test that shares the linked name", () => {
    const twin = { ...failed("a", 9), case: { ...makeCase("a", 9), id: "x/a" } };
    expect(
      getChecklistKeysToTick("t", { 0: ["a"] }, report({ results: [passed("a", 1), twin] }))
    ).toEqual([]);
  });
});

describe("report helpers", () => {
  it("formats durations with a decimal comma", () => {
    expect(formatDuration(420)).toBe("0,4 с");
    expect(formatDuration(1260)).toBe("1,3 с");
    expect(formatDuration(12)).toBe("менее 0,1 с");
  });

  it("recognises a full pass of an intact test file", () => {
    expect(isFullPass(report({ passed: 3 }))).toBe(true);
    expect(isFullPass(report())).toBe(false);
    expect(isFullPass(report({ passed: 3, fileError: "broken" }))).toBe(false);
  });
});
