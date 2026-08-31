import { useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getAlgoGroupMeta } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import { groupAlgoTasks } from "../lib/group-algo-tasks";

export interface UseSidebarAlgoListReturn {
  currentTaskId: string;
  decodedCurrentId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupName: string, e?: React.MouseEvent) => void;
  groupedTasks: Record<string, Task[]>;
  groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>>;
  completedTotal: number;
  totalCount: number;
}

export const useSidebarAlgoList = (): UseSidebarAlgoListReturn => {
  const routerState = useRouterState();
  const currentTaskId = routerState.location.pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);
  const { tasks } = useTaskSection("algorithms");

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const expandedGroups = useUIStore((state) => state.expandedAlgoGroups) || {};
  const setExpandedGroups = useUIStore((state) => state.setExpandedAlgoGroups);

  const { groupedTasks, groupMetaMap } = useMemo(() => groupAlgoTasks(tasks), [tasks]);

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
    () => tasks.filter((task) => isTaskCompleted(completedTasks[String(task.id)])).length,
    [completedTasks, tasks]
  );

  return {
    currentTaskId,
    decodedCurrentId,
    completedTasks,
    reviews,
    expandedGroups,
    toggleGroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
    totalCount: tasks.length,
  };
};
