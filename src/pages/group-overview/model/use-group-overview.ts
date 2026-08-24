import React, { useMemo, useState, useEffect, useCallback, useDeferredValue } from "react";
import { useLocation } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import {
  Task,
  SectionType,
  REACT_GROUPS_CONFIG,
  JS_GROUP_CONFIG,
  getGroupMeta,
  getAlgoGroupMeta,
  getAlgoGroupMetaByInfoId,
  ALL_JS_TASKS,
  ALL_REACT_TASKS,
  ALL_ALGO_TASKS,
  groupTasksBySubgroup,
  hasTaskSubgroups,
} from "@/entities/task";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore, isTaskDue, formatNextReviewDate } from "@/entities/review";
import { safeDecodeURI } from "@/shared/lib/url";
import { GroupMetaInfo, StatusFilter, ViewMode, GroupOverviewState } from "./types";
import { formatLastSolved } from "../lib/format-last-solved";
import {
  getTaskGradientClass,
  getTaskTooltipTitle,
  calculateReadingTime,
} from "../lib/task-card-helpers";

export { formatLastSolved, getTaskGradientClass, getTaskTooltipTitle };

export const useGroupOverview = (groupId: string): GroupOverviewState => {
  const progressState = useProgressStore();
  const completedTasks = progressState.completedTasks || {};
  const reviews = useReviewStore((state) => state.reviews) || {};
  const location = useLocation();

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
  const { groupMeta, groupTasks, section } = useMemo(() => {
    let sec: SectionType = "algorithms";
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
        tasks?: Task[];
      }
    >;
    const jsGroups = JS_GROUP_CONFIG as unknown as Record<string, { desc?: string }>;

    if (reactGroups[groupId]) {
      sec = "react";
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
      tasks = cfg.tasks || [];
    } else if (getAlgoGroupMetaByInfoId(groupId)) {
      sec = "algorithms";
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
      tasks = ALL_ALGO_TASKS.filter((t) => t.group === meta.name);
    } else {
      sec = "javascript";
      const isSubgroup = groupId.startsWith("subgroup-");
      const rawName = safeDecodeURI(groupId.replace(/^group-|^subgroup-/, ""));

      let resolvedGroup = rawName;
      let resolvedSubgroup: string | null = null;

      if (isSubgroup) {
        const matched = ALL_JS_TASKS.find(
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
        tasks = ALL_JS_TASKS.filter(
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
        tasks = ALL_JS_TASKS.filter((t) => t.group === resolvedGroup);
      }
    }

    return { groupMeta: meta, groupTasks: tasks, section: sec };
  }, [groupId]);

  const getTaskStatus = (taskId: string | number): "solved" | "unsolved" | "unstarted" => {
    const val = (completedTasks as Record<string, unknown>)[String(taskId)];
    if (val === true || val === "solved" || val === "completed") return "solved";
    if (val === "unsolved") return "unsolved";
    return "unstarted";
  };

  const readingTimeMinutes = useMemo(() => {
    return calculateReadingTime(groupMeta.infoRaw);
  }, [groupMeta.infoRaw]);

  const stats = useMemo(() => {
    const total = groupTasks.length;
    const completed = groupTasks.filter((t) => getTaskStatus(t.id) === "solved").length;
    const remaining = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percent };
  }, [groupTasks, completedTasks]);

  const deferredStatusFilter = useDeferredValue(statusFilter);

  const filteredTasks = useMemo(() => {
    return groupTasks.filter((task) => {
      const status = getTaskStatus(task.id);
      if (deferredStatusFilter === "completed") return status === "solved";
      if (deferredStatusFilter === "uncompleted") return status === "unsolved";
      return true;
    });
  }, [groupTasks, deferredStatusFilter, completedTasks]);

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
  }, []);

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
  };
};
