import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { useShallow } from "zustand/react/shallow";
import { selectReactCategoryState, type ReactCategoryState } from "../lib/getReactCategories";

export interface UseSidebarReactListReturn {
  currentTaskId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  categoryState: ReactCategoryState;
  completedTotal: number;
  totalCount: number;
  tasks: readonly Task[];
}

export const useSidebarReactList = (): UseSidebarReactListReturn => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const { tasks } = useTaskSection("react");

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  // useShallow keeps the object stable while only the category flags and actions are unchanged.
  const categoryState = useUIStore(useShallow(selectReactCategoryState));

  const activeTasks = useMemo(
    () => tasks.filter((task) => !excludedTaskIds.includes(String(task.id))),
    [tasks, excludedTaskIds]
  );

  const completedTotal = useMemo(
    () => activeTasks.filter((task) => isTaskCompleted(completedTasks[String(task.id)])).length,
    [completedTasks, activeTasks]
  );

  return {
    currentTaskId,
    completedTasks,
    reviews,
    categoryState,
    completedTotal,
    totalCount: activeTasks.length,
    tasks,
  };
};
