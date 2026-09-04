import React, { useMemo, useState, useEffect, useCallback, useDeferredValue } from "react";
import { useLocation } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import { groupTasksBySubgroup, hasTaskSubgroups } from "@/entities/task";
import {
  REACT_GROUPS_CONFIG,
  JS_GROUP_CONFIG,
  getGroupMeta,
  getAlgoGroupMetaByInfoId,
} from "@/entities/task/groups";
import type { Task, SectionType } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore, isTaskDue, formatNextReviewDate } from "@/entities/review";
import { safeDecodeURI } from "@/shared/lib/url";
import { GroupMetaInfo, StatusFilter, ViewMode, GroupOverviewState } from "./types";
import { formatLastSolved } from "../lib/format-last-solved";
import { getTaskGradientClass, getTaskTooltipTitle, calculateReadingTime } from "../lib/task-card-helpers";

export { formatLastSolved, getTaskGradientClass, getTaskTooltipTitle };

const isTaskInReactGroup = (task: Task, groupId: string): boolean => {
  if (groupId === "group-warmup") return task.difficulty === "warm-up";
  if (groupId === "group-refactoring") return task.difficulty === "refactoring";
  if (groupId === "group-middle") return task.difficulty === "middle";
  if (groupId === "group-strong") return task.category === "Управление состоянием";
  if (groupId === "group-ts") return task.category === "TypeScript: Паттерны типизации";
  if (groupId === "group-ts-practice") return task.category === "TypeScript: Прикладные сценарии";
  if (groupId === "group-lifecycle") return task.category === "Жизненный цикл и рантайм";
  return false;
};

export const useGroupOverview = (groupId: string): GroupOverviewState => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const isProgressInitialized = useProgressStore((state) => state.isInitialized);
  const reviews = useReviewStore((state) => state.reviews);
  const location = useLocation();
  const section: SectionType = groupId in REACT_GROUPS_CONFIG
    ? "react"
    : getAlgoGroupMetaByInfoId(groupId)
      ? "algorithms"
      : "javascript";
  const { tasks: loadedTasks, isLoading } = useTaskSection(section);

  const [collapsedSubgroups, setCollapsedSubgroupsState] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(`playground_collapsed_subgroups_${groupId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const setCollapsedSubgroups = useCallback(
    (updater: React.SetStateAction<Record<string, boolean>>) => {
      setCollapsedSubgroupsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        try {
          sessionStorage.setItem(`playground_collapsed_subgroups_${groupId}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [groupId]
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "list";
    try {
      const saved = localStorage.getItem("playground_group_view_mode");
      return saved === "cards" ? "cards" : "list";
    } catch {
      return "list";
    }
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem("playground_group_view_mode", mode);
    } catch {
      // ignore
    }
  };

  // Determine section and metadata
  const { groupMeta, groupTasks } = useMemo(() => {
    let meta: GroupMetaInfo = {
      name: groupId,
      title: groupId,
      desc: "",
      icon: Folder,
      color: "#a855f7",
      bg: "rgba(168, 85, 247, 0.12)",
      infoId: groupId,
    };
    let tasks: Task[] = [];

    const reactGroups = REACT_GROUPS_CONFIG as unknown as Record<
      string,
      {
        name?: string;
        title?: string;
        desc?: string;
        icon?: React.ComponentType<{ size?: number | string; className?: string; color?: string }>;
        color?: string;
        bg?: string;
      }
    >;
    const jsGroups = JS_GROUP_CONFIG as unknown as Record<string, { desc?: string }>;

    if (reactGroups[groupId]) {
      const cfg = reactGroups[groupId];
      meta = {
        name: cfg.name || cfg.title || groupId,
        title: cfg.title || cfg.name || groupId,
        desc: cfg.desc || "",
        icon: cfg.icon,
        color: cfg.color,
        bg: cfg.bg,
        infoId: groupId,
        practiceTasksList: [],
        articleLinksList: [],
      };
      tasks = loadedTasks.filter((task) => isTaskInReactGroup(task, groupId));
    } else if (getAlgoGroupMetaByInfoId(groupId)) {
      const algoMeta = getAlgoGroupMetaByInfoId(groupId);
      meta = {
        name: algoMeta?.name || groupId,
        title: algoMeta?.title || algoMeta?.name || groupId,
        desc: algoMeta?.desc || "",
        guideTitle: algoMeta?.guideTitle,
        icon: algoMeta?.icon,
        color: algoMeta?.color,
        bg: algoMeta?.bg,
        infoId: algoMeta?.infoId || groupId,
        infoRaw: algoMeta?.infoRaw || "",
        practiceTasksList: algoMeta?.practiceTasksList || [],
        articleLinksList: algoMeta?.articleLinksList || [],
        renderIcon: algoMeta?.renderIcon,
      };
      tasks = loadedTasks.filter((t) => t.group === meta.name);
    } else {
      const isSubgroup = groupId.startsWith("subgroup-");
      const rawName = safeDecodeURI(groupId.replace(/^group-|^subgroup-/, ""));

      let resolvedGroup = rawName;
      let resolvedSubgroup: string | null = null;

      if (isSubgroup) {
        const matched = loadedTasks.find(
          (t) =>
            (t.group && t.subgroup && `${t.group}-${t.subgroup}` === rawName) ||
            (t.group && t.subgroup && `${t.group}/${t.subgroup}` === rawName) ||
            (t.group &&
              t.subgroup &&
              rawName.startsWith(`${t.group}-`) &&
              rawName.slice(t.group.length + 1) === t.subgroup) ||
            t.subgroup === rawName
        );
        if (matched) {
          resolvedGroup = matched.group || rawName;
          resolvedSubgroup = matched.subgroup || rawName;
        }
      }

      const jsCfg = jsGroups[resolvedGroup];
      const jsMeta = getGroupMeta(resolvedGroup);

      if (resolvedSubgroup) {
        meta = {
          name: resolvedSubgroup,
          title: resolvedSubgroup,
          desc: `Подраздел «${resolvedSubgroup}» темы «${resolvedGroup}».`,
          icon: Folder,
          color: jsMeta.color,
          bg: jsMeta.bg,
          infoId: groupId,
          practiceTasksList: [],
          articleLinksList: [],
          renderIcon: (size = 14) => React.createElement(Folder, { size, color: jsMeta.color }),
        };
        tasks = loadedTasks.filter(
          (t) => t.group === resolvedGroup && t.subgroup === resolvedSubgroup
        );
      } else {
        meta = {
          name: resolvedGroup,
          title: resolvedGroup,
          desc: jsCfg?.desc || `Задачи раздела «${resolvedGroup}».`,
          icon: jsMeta.icon,
          color: jsMeta.color,
          bg: jsMeta.bg,
          infoId: groupId,
          practiceTasksList: [],
          articleLinksList: [],
          renderIcon: jsMeta.renderIcon,
        };
        tasks = loadedTasks.filter((t) => t.group === resolvedGroup);
      }
    }

    return { groupMeta: meta, groupTasks: tasks };
  }, [groupId, loadedTasks]);

  const getTaskStatus = useCallback(
    (taskId: string | number): "solved" | "unsolved" | "unstarted" => {
      const value = (completedTasks as Record<string, unknown>)[String(taskId)];
      if (value === true || value === "solved" || value === "completed") return "solved";
      return value === "unsolved" ? "unsolved" : "unstarted";
    },
    [completedTasks]
  );

  const readingTimeMinutes = useMemo(() => {
    return calculateReadingTime(groupMeta.infoRaw);
  }, [groupMeta.infoRaw]);

  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const stats = useMemo(() => {
    const activeTasks = groupTasks.filter((t) => !excludedTaskIds.includes(String(t.id)));
    const total = activeTasks.length;
    const completed = activeTasks.filter((t) => getTaskStatus(t.id) === "solved").length;
    const remaining = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percent };
  }, [getTaskStatus, groupTasks, excludedTaskIds]);

  const deferredStatusFilter = useDeferredValue(statusFilter);

  const filteredTasks = useMemo(() => {
    return groupTasks.filter((task) => {
      const status = getTaskStatus(task.id);
      if (deferredStatusFilter === "completed") return status === "solved";
      if (deferredStatusFilter === "uncompleted") return status === "unsolved";
      return true;
    });
  }, [deferredStatusFilter, getTaskStatus, groupTasks]);

  const groupedSubgroups = useMemo(() => {
    return groupTasksBySubgroup(filteredTasks);
  }, [filteredTasks]);

  const hasSubgroups = useMemo(() => {
    return !groupId.startsWith("subgroup-") && hasTaskSubgroups(groupTasks);
  }, [groupId, groupTasks]);

  const isSubgroupOpen = useCallback(
    (subName: string) => {
      return !collapsedSubgroups[subName];
    },
    [collapsedSubgroups]
  );

  const toggleSubgroup = useCallback((subName: string) => {
    setCollapsedSubgroups((prev) => ({
      ...prev,
      [subName]: !prev[subName],
    }));
  }, [setCollapsedSubgroups]);

  useEffect(() => {
    const handleScrollOrAnchor = () => {
      const hash = window.location.hash;
      if (hash) {
        const rawId = hash.replace(/^#/, "");
        const decodedId = safeDecodeURI(rawId);
        let element = document.getElementById(decodedId) || document.getElementById(rawId);
        if (!element) {
          const normalizedId = decodedId.replace(/-+/g, "-");
          element =
            document.getElementById(normalizedId) ||
            (document.querySelector(`[id="${normalizedId}"]`) as HTMLElement | null);
        }
        if (element) {
          setTimeout(() => {
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
          return;
        }
      }
      const contentArea = document.querySelector("[class*='contentArea']");
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    const timer = setTimeout(handleScrollOrAnchor, 80);
    window.addEventListener("hashchange", handleScrollOrAnchor);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleScrollOrAnchor);
    };
  }, [groupMeta.name, groupMeta.title, location.pathname]);

  const firstTask = groupTasks[0];
  const taskRoute = `/${section}/$taskId`;

  return {
    groupMeta,
    groupTasks,
    filteredTasks,
    groupedSubgroups,
    hasSubgroups,
    section,
    taskRoute,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    isSubgroupOpen,
    toggleSubgroup,
    stats,
    readingTimeMinutes,
    firstTask,
    practiceTasksList: groupMeta.practiceTasksList || [],
    articleLinksList: groupMeta.articleLinksList || [],
    getTaskStatus,
    getTaskGradientClass,
    getTaskTooltipTitle,
    formatLastSolved,
    formatNextReviewDate,
    isTaskDue,
    reviews,
    completedTasks,
    isInitialized: isProgressInitialized && !isLoading,
  };
};
