import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore, UIState } from "@/entities/ui-state";

export interface UseSidebarReactListReturn {
  currentTaskId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  uiState: UIState;
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
  const uiState = useUIStore();

  const activeTasks = useMemo(
    () => tasks.filter((task) => !excludedTaskIds.includes(String(task.id))),
    [tasks, excludedTaskIds]
  );

  const completedTotal = useMemo(
    () =>
      activeTasks.filter((task) => isTaskCompleted(completedTasks[String(task.id)])).length,
    [completedTasks, activeTasks]
  );

  return {
    currentTaskId,
    completedTasks,
    reviews,
    uiState,
    completedTotal,
    totalCount: activeTasks.length,
    tasks,
  };
};
