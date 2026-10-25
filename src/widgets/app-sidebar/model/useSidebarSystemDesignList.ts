import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { safeDecodeURI } from "@/shared/lib/url";

export interface UseSidebarSystemDesignListReturn {
  currentTaskId: string;
  decodedCurrentId: string;
  drills: Task[];
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  completedTotal: number;
  totalCount: number;
}

export const useSidebarSystemDesignList = (): UseSidebarSystemDesignListReturn => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);
  const { tasks: drills } = useTaskSection("system-design");

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const activeDrills = useMemo(
    () => drills.filter((task) => !excludedTaskIds.includes(String(task.id))),
    [drills, excludedTaskIds]
  );

  const completedTotal = useMemo(
    () => activeDrills.filter((task) => isTaskCompleted(completedTasks[String(task.id)])).length,
    [completedTasks, activeDrills]
  );

  return {
    currentTaskId,
    decodedCurrentId,
    drills,
    completedTasks,
    reviews,
    completedTotal,
    totalCount: activeDrills.length,
  };
};
