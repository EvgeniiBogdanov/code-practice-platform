import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ALL_REACT_TASKS } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";

export const useSidebarReactList = () => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";

  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const uiState = useUIStore();

  const completedTotal = useMemo(
    () => ALL_REACT_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );

  return {
    currentTaskId,
    progressState,
    reviews,
    uiState,
    completedTotal,
  };
};
