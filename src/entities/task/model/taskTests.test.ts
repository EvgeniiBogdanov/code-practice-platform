import { describe, expect, it } from "vitest";
import { isDrillTestTask, isTypeTestTask } from "./taskTests";

describe("task test kinds", () => {
  it("treats rawTests of a TypeScript task as type tests", () => {
    const task = { section: "typescript", rawTests: "test()" } as const;
    expect(isTypeTestTask(task)).toBe(true);
    expect(isDrillTestTask(task)).toBe(false);
  });

  it("treats rawTests of any other section as runtime drill tests", () => {
    const task = { section: "javascript", rawTests: "test()" } as const;
    expect(isDrillTestTask(task)).toBe(true);
    expect(isTypeTestTask(task)).toBe(false);
  });

  it("has no tests without rawTests", () => {
    expect(isDrillTestTask({ section: "react" })).toBe(false);
    expect(isTypeTestTask({ section: "typescript" })).toBe(false);
    expect(isDrillTestTask(undefined)).toBe(false);
  });
});
