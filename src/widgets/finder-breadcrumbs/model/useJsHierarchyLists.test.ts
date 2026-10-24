import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useProgressStore } from "@/entities/progress";
import { useJsHierarchyLists } from "./useJsHierarchyLists";

vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({ tasks: [] }),
}));

describe("useJsHierarchyLists", () => {
  beforeEach(() => {
    useProgressStore.setState({ completedTasks: {}, checklistState: {} });
  });

  it("does not re-render when an unrelated progress field changes", () => {
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useJsHierarchyLists(null);
    });
    const rendersBefore = renders;

    act(() => useProgressStore.setState({ checklistState: { "task-1": true } }));

    expect(renders).toBe(rendersBefore);
  });

  it("exposes the completed tasks map", () => {
    const { result } = renderHook(() => useJsHierarchyLists(null));

    act(() => useProgressStore.setState({ completedTasks: { "js-1": "solved" } }));

    expect(result.current.completedTasks).toEqual({ "js-1": "solved" });
  });
});
