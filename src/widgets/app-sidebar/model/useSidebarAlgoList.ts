import { useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ALL_ALGO_TASKS } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import { groupAlgoTasks } from "../lib/groupAlgoTasks";

export const useSidebarAlgoList = () => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);

  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const expandedGroups = useUIStore((state) => state.expandedAlgoGroups) || {};
  const setExpandedGroups = useUIStore((state) => state.setExpandedAlgoGroups);

  const toggleGroup = useCallback(
    (groupName: string) => {
      setExpandedGroups?.((prev) => ({ ...(prev || {}), [groupName]: !prev?.[groupName] }));
    },
    [setExpandedGroups]
  );

  const { groupedTasks, groupMetaMap } = useMemo(() => groupAlgoTasks(), []);

  const completedTotal = useMemo(
    () => ALL_ALGO_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );

  return {
    currentTaskId,
    decodedCurrentId,
    progressState,
    reviews,
    expandedGroups,
    toggleGroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
  };
};
