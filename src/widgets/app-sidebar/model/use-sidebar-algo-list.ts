import { useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ALL_ALGO_TASKS, Task, getAlgoGroupMeta } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import { groupAlgoTasks } from "../lib/group-algo-tasks";

export interface UseSidebarAlgoListReturn {
  currentTaskId: string;
  decodedCurrentId: string;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupName: string, e?: React.MouseEvent) => void;
  groupedTasks: Record<string, Task[]>;
  groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>>;
  completedTotal: number;
}

export const useSidebarAlgoList = (): UseSidebarAlgoListReturn => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);

  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const expandedGroups = useUIStore((state) => state.expandedAlgoGroups) || {};
  const setExpandedGroups = useUIStore((state) => state.setExpandedAlgoGroups);

  const { groupedTasks, groupMetaMap } = useMemo(() => groupAlgoTasks(), []);

  const toggleGroup = useCallback(
    (groupName: string, e?: React.MouseEvent) => {
      setExpandedGroups?.((prev) => {
        const current = prev || {};
        if (e?.altKey) {
          const willExpand = !current[groupName];
          const allGroupNames = Object.keys(groupMetaMap || {});
          const next: Record<string, boolean> = {};
          for (const g of allGroupNames) {
            next[g] = willExpand;
          }
          return next;
        }
        return { ...current, [groupName]: !current[groupName] };
      });
    },
    [groupMetaMap, setExpandedGroups]
  );

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
