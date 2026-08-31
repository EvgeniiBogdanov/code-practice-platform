import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { useProgressStore } from "@/entities/progress";
import { isTaskDue, ReviewItem, useReviewStore } from "@/entities/review";
import { getTasksBySection, SectionType, Task } from "@/entities/task";
import { buildFavoriteTaskTree, FavoriteTaskFolderNode } from "./favorite-task-tree";

export type FavoriteStatusFilter = "all" | "solved" | "unsolved";
export type FavoritesViewMode = "list" | "cards";
export type FavoriteListDisplayMode = "folders" | "tasks";
export type FavoriteTaskStatus = "solved" | "unsolved" | "unstarted";

const FAVORITES_LIST_DISPLAY_MODE_STORAGE_KEY = "playground_favorites_list_display_mode";

export interface FavoritesPageState {
  favoriteTasks: Task[];
  filteredTasks: Task[];
  taskTree: FavoriteTaskFolderNode[];
  statusFilter: FavoriteStatusFilter;
  setStatusFilter: (filter: FavoriteStatusFilter) => void;
  viewMode: FavoritesViewMode;
  setViewMode: (mode: FavoritesViewMode) => void;
  listDisplayMode: FavoriteListDisplayMode;
  setListDisplayMode: (mode: FavoriteListDisplayMode) => void;
  getTaskStatus: (taskId: string | number) => FavoriteTaskStatus;
  getTaskIsDue: (taskId: string | number) => boolean;
  reviews: Record<string, ReviewItem>;
}

const getInitialViewMode = (): FavoritesViewMode => {
  if (typeof window === "undefined") return "list";
  try {
    return localStorage.getItem("playground_group_view_mode") === "cards" ? "cards" : "list";
  } catch {
    return "list";
  }
};

const getInitialListDisplayMode = (): FavoriteListDisplayMode => {
  if (typeof window === "undefined") return "folders";
  try {
    return localStorage.getItem(FAVORITES_LIST_DISPLAY_MODE_STORAGE_KEY) === "tasks"
      ? "tasks"
      : "folders";
  } catch {
    return "folders";
  }
};

export const useFavoritesPage = (section: SectionType): FavoritesPageState => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const [visibleFavoriteTaskIds] = useState<readonly string[]>(() => [
    ...useFavoriteTaskStore.getState().favoriteTaskIds,
  ]);
  const [statusFilter, setStatusFilter] = useState<FavoriteStatusFilter>("all");
  const [viewMode, setViewModeState] = useState<FavoritesViewMode>(getInitialViewMode);
  const [listDisplayMode, setListDisplayModeState] = useState<FavoriteListDisplayMode>(
    getInitialListDisplayMode
  );
  const deferredStatusFilter = useDeferredValue(statusFilter);

  const getTaskStatus = useCallback(
    (taskId: string | number): FavoriteTaskStatus => {
      const status = completedTasks[String(taskId)];
      if (status === "solved") return "solved";
      if (status === "unsolved") return "unsolved";
      return "unstarted";
    },
    [completedTasks]
  );

  const getTaskIsDue = useCallback(
    (taskId: string | number): boolean => {
      const review = reviews[String(taskId)];
      return Boolean(review && isTaskDue(review));
    },
    [reviews]
  );

  const favoriteTasks = useMemo(() => {
    const favoriteIds = new Set(visibleFavoriteTaskIds);
    return getTasksBySection(section).filter((task) => favoriteIds.has(String(task.id)));
  }, [section, visibleFavoriteTaskIds]);

  const filteredTasks = useMemo(() => {
    if (deferredStatusFilter === "all") return favoriteTasks;
    return favoriteTasks.filter((task) => getTaskStatus(task.id) === deferredStatusFilter);
  }, [deferredStatusFilter, favoriteTasks, getTaskStatus]);

  const setViewMode = useCallback((mode: FavoritesViewMode): void => {
    setViewModeState(mode);
    try {
      localStorage.setItem("playground_group_view_mode", mode);
    } catch {
      // The selected mode still applies for the current session.
    }
  }, []);

  const setListDisplayMode = useCallback((mode: FavoriteListDisplayMode): void => {
    setListDisplayModeState(mode);
    try {
      localStorage.setItem(FAVORITES_LIST_DISPLAY_MODE_STORAGE_KEY, mode);
    } catch {
      // The selected mode still applies for the current session.
    }
  }, []);

  return {
    favoriteTasks,
    filteredTasks,
    taskTree: buildFavoriteTaskTree(filteredTasks),
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    listDisplayMode,
    setListDisplayMode,
    getTaskStatus,
    getTaskIsDue,
    reviews,
  };
};
