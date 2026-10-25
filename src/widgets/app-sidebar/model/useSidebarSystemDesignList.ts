import { useCallback, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { safeDecodeURI } from "@/shared/lib/url";
import type { SystemDesignGroupId } from "./systemDesignGroups";

export interface UseSidebarSystemDesignListReturn {
  currentTaskId: string;
  decodedCurrentId: string;
  pathname: string;
  drills: Task[];
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  completedTotal: number;
  totalCount: number;
  /** A folder is open when the reader opened it, or, untouched, when the current page is inside. */
  isGroupOpen: (groupId: SystemDesignGroupId) => boolean;
  toggleGroup: (groupId: SystemDesignGroupId) => void;
}

const isInside = (pathname: string, folder: string): boolean =>
  pathname === `/system-design/${folder}` || pathname.startsWith(`/system-design/${folder}/`);

const GROUP_PATH_PREFIX: Record<SystemDesignGroupId, (pathname: string) => boolean> = {
  theory: (pathname) => isInside(pathname, "topics"),
  cases: (pathname) => isInside(pathname, "cases"),
  drills: (pathname) =>
    pathname.startsWith("/system-design/") &&
    !isInside(pathname, "topics") &&
    !isInside(pathname, "cases"),
};

export const useSidebarSystemDesignList = (): UseSidebarSystemDesignListReturn => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname.replace(/\/+$/, "") || "/";
  const currentTaskId = pathname.split("/").pop() || "";
  const decodedCurrentId = safeDecodeURI(currentTaskId);
  const { tasks: drills } = useTaskSection("system-design");

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const expandedGroups = useUIStore((state) => state.expandedSystemDesignGroups);
  const setExpandedGroups = useUIStore((state) => state.setExpandedSystemDesignGroups);

  const isGroupOpen = useCallback(
    (groupId: SystemDesignGroupId): boolean =>
      expandedGroups[groupId] ?? GROUP_PATH_PREFIX[groupId](pathname),
    [expandedGroups, pathname]
  );

  const toggleGroup = useCallback(
    (groupId: SystemDesignGroupId): void => {
      setExpandedGroups((previous) => ({
        ...previous,
        [groupId]: !(previous[groupId] ?? GROUP_PATH_PREFIX[groupId](pathname)),
      }));
    },
    [pathname, setExpandedGroups]
  );

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
    pathname,
    drills,
    completedTasks,
    reviews,
    completedTotal,
    totalCount: activeDrills.length,
    isGroupOpen,
    toggleGroup,
  };
};
