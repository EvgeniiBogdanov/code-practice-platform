import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useUIStore } from "@/entities/ui-state";
import { useSidebarReactList } from "./useSidebarReactList";

vi.mock("@tanstack/react-router", () => ({
  useRouterState: () => ({ location: { pathname: "/react/warmup" } }),
}));

vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({ tasks: [] }),
}));

describe("useSidebarReactList", () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ warmupExpanded: false, editorFontSize: 14 });
  });

  it("does not re-render the sidebar when an unrelated UI setting changes", () => {
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useSidebarReactList();
    });
    const rendersBefore = renders;

    act(() => useUIStore.getState().setEditorFontSize(16));

    expect(renders).toBe(rendersBefore);
  });

  it("returns the new category state when a category is toggled", () => {
    const { result } = renderHook(() => useSidebarReactList());

    act(() => useUIStore.getState().setWarmupExpanded(true));

    expect(result.current.categoryState.warmupExpanded).toBe(true);
  });
});
