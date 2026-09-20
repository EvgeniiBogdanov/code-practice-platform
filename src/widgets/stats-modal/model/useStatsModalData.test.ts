import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { Task } from "@/entities/task";
import { useStatsModalData } from "./useStatsModalData";

const state = vi.hoisted(() => ({ pathname: "/typescript", excludedTaskIds: [] as string[] }));
vi.mock("@tanstack/react-router", () => ({ useLocation: () => ({ pathname: state.pathname }) }));
vi.mock("@/entities/task/catalog", () => ({
  useAllTaskSections: () => ({
    tasks: [
      { id: "typescript-1", title: "Annotations", section: "typescript" },
      { id: "typescript-2", title: "Tuples", section: "typescript" },
      { id: "ts-1", title: "React generics", section: "react" },
      { id: "js1", title: "Loops", section: "javascript" },
    ] satisfies Task[],
  }),
}));
vi.mock("@/entities/review", () => ({
  useReviewStore: (selector: (value: { excludedTaskIds: string[] }) => unknown): unknown =>
    selector(state),
}));

describe("TypeScript section statistics", () => {
  beforeEach(() => {
    state.pathname = "/typescript";
    state.excludedTaskIds = [];
  });

  it.each(["/typescript", "/typescript/typescript-1", "/open/typescript/typescript-1"])(
    "uses only TypeScript tasks at %s",
    (pathname) => {
      state.pathname = pathname;
      const { result } = renderHook(() => useStatsModalData());
      expect(result.current.sectionName).toBe("TypeScript");
      expect(result.current.taskList.map(({ id }) => id)).toEqual(["typescript-1", "typescript-2"]);
    }
  );

  it("omits excluded TypeScript tasks", () => {
    state.excludedTaskIds = ["typescript-2"];
    const { result } = renderHook(() => useStatsModalData());
    expect(result.current.taskList.map(({ id }) => id)).toEqual(["typescript-1"]);
  });

  it("includes the new section in platform statistics", () => {
    state.pathname = "/home";
    const { result } = renderHook(() => useStatsModalData());
    expect(result.current.taskList).toHaveLength(4);
    expect(result.current.section).toBe("home");
  });
});
