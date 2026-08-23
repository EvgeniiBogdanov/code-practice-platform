import { useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ALL_JS_TASKS } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import { groupJsTasks } from "../lib/groupJsTasks";

export const useSidebarJsList = () => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);

  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const expandedGroups = useUIStore((state) => state.expandedJsGroups) || {};
  const setExpandedGroups = useUIStore((state) => state.setExpandedJsGroups);
  const expandedSubgroups = useUIStore((state) => state.expandedJsSubgroups) || {};
  const setExpandedSubgroups = useUIStore((state) => state.setExpandedJsSubgroups);

  const toggleGroup = useCallback(
    (groupName: string) => {
      setExpandedGroups?.((prev) => ({ ...(prev || {}), [groupName]: !prev?.[groupName] }));
    },
    [setExpandedGroups]
  );

  const toggleSubgroup = useCallback(
    (groupName: string, subName: string) => {
      const key = `${groupName}/${subName}`;
      setExpandedSubgroups?.((prev) => ({ ...(prev || {}), [key]: !prev?.[key] }));
    },
    [setExpandedSubgroups]
  );

  const { groupedTasks, groupMetaMap } = useMemo(() => groupJsTasks(), []);

  const completedTotal = useMemo(
    () => ALL_JS_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );

  return {
    currentTaskId,
    decodedCurrentId,
    progressState,
    reviews,
    expandedGroups,
    expandedSubgroups,
    toggleGroup,
    toggleSubgroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
  };
};
