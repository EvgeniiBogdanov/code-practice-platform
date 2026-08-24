import { useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ALL_JS_TASKS, Task, getGroupMeta } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import { groupJsTasks } from "../lib/group-js-tasks";

export interface UseSidebarJsListReturn {
  currentTaskId: string;
  decodedCurrentId: string;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
  expandedGroups: Record<string, boolean>;
  expandedSubgroups: Record<string, boolean>;
  toggleGroup: (groupName: string, e?: React.MouseEvent) => void;
  toggleSubgroup: (groupName: string, subName: string, e?: React.MouseEvent) => void;
  groupedTasks: Record<string, Record<string, Task[]>>;
  groupMetaMap: Record<string, ReturnType<typeof getGroupMeta>>;
  completedTotal: number;
}

export const useSidebarJsList = (): UseSidebarJsListReturn => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);

  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const expandedGroups = useUIStore((state) => state.expandedJsGroups) || {};
  const setExpandedGroups = useUIStore((state) => state.setExpandedJsGroups);
  const expandedSubgroups = useUIStore((state) => state.expandedJsSubgroups) || {};
  const setExpandedSubgroups = useUIStore((state) => state.setExpandedJsSubgroups);

  const { groupedTasks, groupMetaMap } = useMemo(() => groupJsTasks(), []);

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

  const toggleSubgroup = useCallback(
    (groupName: string, subName: string, e?: React.MouseEvent) => {
      const key = `${groupName}/${subName}`;
      setExpandedSubgroups?.((prev) => {
        const current = prev || {};
        if (e?.altKey) {
          const willExpand = !current[key];
          const currentGroupSubgroups = Object.keys(groupedTasks[groupName] || {});
          const next = { ...current };
          for (const sub of currentGroupSubgroups) {
            next[`${groupName}/${sub}`] = willExpand;
          }
          return next;
        }
        return { ...current, [key]: !current[key] };
      });
    },
    [groupedTasks, setExpandedSubgroups]
  );

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
