import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { pendingReveal, revealers } from "@/shared/lib/code-editor";
import { useTypeTestsNavigation } from "./useTypeTestsNavigation";

const problem = {
  id: "p",
  line: 1,
  col: 1,
  start: 5,
  end: 5,
  code: 1,
  message: "m",
  severity: "error" as const,
};

describe("useTypeTestsNavigation", () => {
  it("selects the error in the editor that has the solution open", () => {
    const reveal = vi.fn(() => true);
    revealers.add(reveal);
    const { result } = renderHook(() => useTypeTestsNavigation("task.ts"));
    result.current.showCompileProblem(problem);
    revealers.delete(reveal);
    expect(reveal).toHaveBeenCalledWith({ filepath: "task.ts", start: 5, end: 5 });
  });

  it("leaves the range for the editor that mounts next when none handles it", () => {
    pendingReveal.current = null;
    const { result } = renderHook(() => useTypeTestsNavigation("task.ts"));
    result.current.showCompileProblem({ ...problem, end: 9 });
    expect(pendingReveal.current).toEqual({ filepath: "task.ts", start: 5, end: 9 });
  });
});
