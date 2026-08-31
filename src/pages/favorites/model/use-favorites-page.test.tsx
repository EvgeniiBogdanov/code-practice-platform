import { act, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { getLoadedTaskSection, loadTaskSection } from "@/entities/task/catalog";
import { useFavoritesPage } from "./use-favorites-page";

describe("useFavoritesPage", () => {
  beforeAll(async () => {
    await loadTaskSection("javascript");
    await loadTaskSection("react");
  });

  beforeEach(() => {
    localStorage.clear();
    useFavoriteTaskStore.setState({ favoriteTaskIds: [] });
    useProgressStore.setState({ completedTasks: {} });
    useReviewStore.setState({ reviews: {} });
  });

  it("uses the folder structure for list mode by default", () => {
    const { result } = renderHook(() => useFavoritesPage("javascript"));

    expect(result.current.listDisplayMode).toBe("folders");
  });

  it("persists the selected flat list structure", () => {
    const { result, unmount } = renderHook(() => useFavoritesPage("react"));

    act(() => {
      result.current.setListDisplayMode("tasks");
    });

    expect(localStorage.getItem("playground_favorites_list_display_mode")).toBe("tasks");
    unmount();

    const remounted = renderHook(() => useFavoritesPage("react"));

    expect(remounted.result.current.listDisplayMode).toBe("tasks");
  });

  it("keeps a removed favorite visible until the page is remounted", () => {
    const taskId = String(getLoadedTaskSection("javascript")[0].id);
    useFavoriteTaskStore.setState({ favoriteTaskIds: [taskId] });
    const { result, unmount } = renderHook(() => useFavoritesPage("javascript"));

    act(() => {
      useFavoriteTaskStore.getState().removeFavoriteTask(taskId);
    });

    expect(result.current.favoriteTasks.map((task) => String(task.id))).toContain(taskId);

    act(() => {
      useFavoriteTaskStore.getState().addFavoriteTask(taskId);
    });

    expect(useFavoriteTaskStore.getState().favoriteTaskIds).toContain(taskId);
    unmount();

    act(() => {
      useFavoriteTaskStore.getState().removeFavoriteTask(taskId);
    });

    const remounted = renderHook(() => useFavoritesPage("javascript"));

    expect(remounted.result.current.favoriteTasks.map((task) => String(task.id))).not.toContain(
      taskId
    );
  });
});
