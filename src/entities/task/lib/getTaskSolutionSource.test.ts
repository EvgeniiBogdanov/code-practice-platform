import { describe, expect, it } from "vitest";
import { getTaskSolutionSource } from "./getTaskSolutionSource";

describe("getTaskSolutionSource", () => {
  it("prefers the raw source, including an explicitly empty source", () => {
    expect(getTaskSolutionSource({ rawSolution: "raw", solution: "fallback" })).toBe("raw");
    expect(getTaskSolutionSource({ rawSolution: "", solution: "fallback" })).toBe("");
  });
  it("falls back to the solution, then to an empty source", () => {
    expect(getTaskSolutionSource({ solution: "fallback" })).toBe("fallback");
    expect(getTaskSolutionSource({})).toBe("");
  });
});
