import { describe, expect, it } from "vitest";
import { getTaskSolutionSource } from "./get-task-solution-source";

describe("getTaskSolutionSource", () => {
  it("prefers the raw source, including an explicitly empty source", () => {
    expect(getTaskSolutionSource({ rawSolution: "raw", solution: "fallback" })).toBe("raw");
    expect(getTaskSolutionSource({ rawSolution: "", solution: "fallback" })).toBe("");
  });
  it("uses string solutions and does not invoke React component solutions", () => {
    expect(getTaskSolutionSource({ solution: "fallback" })).toBe("fallback");
    expect(getTaskSolutionSource({ solution: () => null })).toBe("");
    expect(getTaskSolutionSource({})).toBe("");
  });
});
