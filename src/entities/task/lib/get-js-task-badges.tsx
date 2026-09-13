import React from "react";
import {
  Code2,
  Zap,
  Cpu,
  Brain,
  Wrench,
  Package,
  Workflow,
  GitMerge,
  Binary,
  Boxes,
  Layers,
  Link2,
  Box,
  Lock,
  Crown,
  Search,
  Hash,
  GitBranch,
  Repeat,
  FileCode,
  BookOpen,
} from "lucide-react";
import { GaugeIndicator, type MetaBadgeVariant } from "@/shared/ui";
import {
  getJsTaskAlgorithm,
  getJsTaskAlgorithmSubLabel,
  type JsTaskAlgorithm,
} from "../curriculum/javascript/data/task-algorithms";
import { isSyntaxTask, getJsTaskProbabilityInfo } from "./get-js-task-probability";
import type { Task } from "../types";

export interface TaskBadge {
  id: string;
  label: string;
  variant: MetaBadgeVariant;
  icon: React.ReactNode;
  title?: string;
}

const ICON_SIZE = 12;

const isPolyfillTask = (title: string, subgroup: string): boolean =>
  title.includes("полифил") ||
  subgroup === "Полифилы" ||
  title.includes("промисификация") ||
  title.includes("classnames polyfill");

const isPatternTask = (group: string, subgroup: string, title: string): boolean =>
  group === "Паттерны проектирования" ||
  subgroup === "Продвинутые паттерны" ||
  title.includes("паттерн") ||
  title.includes("pubsub") ||
  title.includes("eventemitter") ||
  title.includes("observable") ||
  title.includes("signal") ||
  title.includes("pipe") ||
  title.includes("compose") ||
  title.includes("retry") ||
  title.includes("concurrency pool") ||
  title.includes("abortcontroller") ||
  title.includes("async task queue");

const isUtilityTask = (group: string, subgroup: string, title: string): boolean =>
  subgroup === "Манипуляции и Утилиты" ||
  subgroup === "CSS утилиты" ||
  subgroup === "Парсинг URL" ||
  subgroup === "Шаблонизация" ||
  subgroup === "Кеширование и мемоизация" ||
  subgroup === "Каррирование" ||
  title.includes("lodash") ||
  title.includes("debounce") ||
  title.includes("throttle") ||
  title.includes("deepclone") ||
  title.includes("deepmerge") ||
  title.includes("deepequal") ||
  title.includes("deepfreeze") ||
  title.includes("memoize") ||
  title.includes("мемоизация") ||
  title.includes("каррирование") ||
  title.includes("шаблонизатор") ||
  title.includes("парсер") ||
  title.includes("хелпер") ||
  title.includes("flatten") ||
  title.includes("pick") ||
  title.includes("omit") ||
  title.includes("get / lodash") ||
  title.includes("set / lodash") ||
  title.includes("клонирование");

const getAlgorithmDetailBadge = (
  algorithm: JsTaskAlgorithm,
  taskId?: string | number
): TaskBadge => {
  const subLabel = taskId !== undefined ? getJsTaskAlgorithmSubLabel(taskId) : null;

  switch (algorithm) {
    case "binary-search":
      return {
        id: "algo-bs",
        label: subLabel || "Binary Search: Classic",
        variant: "blue",
        icon: <Search size={ICON_SIZE} />,
      };
    case "euclidean-algorithm":
      return {
        id: "algo-euclid",
        label: subLabel || "Math: Euclidean Algorithm",
        variant: "purple",
        icon: <Cpu size={ICON_SIZE} />,
      };
    case "two-pointers":
      return {
        id: "algo-two-pointers",
        label: subLabel || "Two Pointers: Classic",
        variant: "pink",
        icon: <GitMerge size={ICON_SIZE} />,
      };
    case "bubble-sort":
      return {
        id: "algo-bubble",
        label: subLabel || "Sorting: Bubble Sort",
        variant: "purple",
        icon: <Layers size={ICON_SIZE} />,
      };
    case "linked-list":
      return {
        id: "algo-linked-list",
        label: subLabel || "Linked List: Traversal",
        variant: "cyan",
        icon: <Link2 size={ICON_SIZE} />,
      };
    case "hash-map":
      return {
        id: "algo-hash-map",
        label: subLabel || "Hash Map: Lookup",
        variant: "yellow",
        icon: <Hash size={ICON_SIZE} />,
      };
    case "depth-first-search":
      return {
        id: "algo-dfs",
        label: subLabel || "DFS: Traversal",
        variant: "green",
        icon: <GitBranch size={ICON_SIZE} />,
      };
    case "basic":
      return {
        id: "algo-base",
        label: subLabel || "Базовый алгоритм",
        variant: "purple",
        icon: <Brain size={ICON_SIZE} />,
      };
  }
};

const getPrimaryBadge = (
  group: string,
  subgroup: string,
  title: string,
  algorithm: JsTaskAlgorithm | null
): TaskBadge => {
  if (isPolyfillTask(title, subgroup)) {
    return { id: "polyfill", label: "Полифил", variant: "red", icon: <Package size={ICON_SIZE} /> };
  }
  if (isPatternTask(group, subgroup, title)) {
    return {
      id: "pattern",
      label: "Паттерн",
      variant: "cyan",
      icon: <Workflow size={ICON_SIZE} />,
    };
  }
  if (algorithm) {
    return { id: "algo", label: "Алгоритм", variant: "purple", icon: <Brain size={ICON_SIZE} /> };
  }
  if (isUtilityTask(group, subgroup, title)) {
    return { id: "utility", label: "Утилита", variant: "blue", icon: <Wrench size={ICON_SIZE} /> };
  }
  if (isSyntaxTask(title)) {
    return { id: "syntax", label: "Синтаксис", variant: "blue", icon: <Code2 size={ICON_SIZE} /> };
  }
  return { id: "base", label: "База", variant: "yellow", icon: <BookOpen size={ICON_SIZE} /> };
};

const getContextBadge = (group: string, subgroup: string, primaryId: string): TaskBadge | null => {
  if (
    group === "Асинхронность" ||
    ["Event Loop", "Таймеры", "Основы Promise", "async/await", "Комбинаторы"].includes(subgroup)
  ) {
    return { id: "async", label: "Асинхронность", variant: "pink", icon: <Zap size={ICON_SIZE} /> };
  }
  if (group === "Рекурсия" && primaryId !== "algo") {
    return {
      id: "recursion",
      label: "Рекурсия",
      variant: "orange",
      icon: <GitMerge size={ICON_SIZE} />,
    };
  }
  if (group === "Типы данных") {
    return {
      id: "types",
      label: "Типы данных",
      variant: "yellow",
      icon: <Binary size={ICON_SIZE} />,
    };
  }
  if (group === "Прототипы THIS") {
    return {
      id: "prototypes",
      label: "This и прототипы",
      variant: "purple",
      icon: <Crown size={ICON_SIZE} />,
    };
  }
  if (
    group === "Замыкания" ||
    group === "Замыкания и функции" ||
    subgroup.startsWith("Замыкания")
  ) {
    return { id: "closures", label: "Замыкания", variant: "cyan", icon: <Lock size={ICON_SIZE} /> };
  }
  if (group === "Циклы" && primaryId !== "base") {
    return { id: "loops", label: "Циклы", variant: "blue", icon: <Repeat size={ICON_SIZE} /> };
  }
  if (subgroup === "Map") {
    return { id: "map", label: "Map", variant: "purple", icon: <Boxes size={ICON_SIZE} /> };
  }
  if (subgroup === "Set") {
    return { id: "set", label: "Set", variant: "purple", icon: <Boxes size={ICON_SIZE} /> };
  }
  if (group === "Коллекции") {
    return {
      id: "collections",
      label: "Коллекции",
      variant: "purple",
      icon: <Boxes size={ICON_SIZE} />,
    };
  }
  if (group === "Объекты" && primaryId !== "utility") {
    return { id: "objects", label: "Объекты", variant: "blue", icon: <Box size={ICON_SIZE} /> };
  }
  if (group === "Массивы") {
    return { id: "arrays", label: "Массивы", variant: "green", icon: <Layers size={ICON_SIZE} /> };
  }
  if (group === "Строки и Утилиты") {
    return {
      id: "strings-utils",
      label: "Строки и Утилиты",
      variant: "green",
      icon: <FileCode size={ICON_SIZE} />,
    };
  }
  if (group === "Паттерны проектирования" && primaryId !== "pattern") {
    return {
      id: "patterns",
      label: "Паттерны",
      variant: "cyan",
      icon: <Workflow size={ICON_SIZE} />,
    };
  }
  return null;
};

export const getJsTaskBadges = (task: Task): TaskBadge[] => {
  const title = (task.title || "").toLowerCase();
  const group = task.group || "";
  const subgroup = task.subgroup || "";
  const algorithm = getJsTaskAlgorithm(task.id);

  const badges: TaskBadge[] = [];

  // Interview Probability Badge (Gauge indicator) for non-syntax JavaScript tasks
  const probInfo = getJsTaskProbabilityInfo(task);
  if (probInfo && probInfo.probability !== null) {
    badges.push({
      id: "interview-probability",
      label: probInfo.label,
      variant: probInfo.variant,
      icon: <GaugeIndicator value={probInfo.probability} size={13} />,
      title: probInfo.tooltip,
    });
  }

  const primaryBadge = getPrimaryBadge(group, subgroup, title, algorithm);

  if (primaryBadge.id === "algo" && algorithm) {
    const algoDetailBadge = getAlgorithmDetailBadge(algorithm, task.id);
    if (algoDetailBadge.id === "algo-base") {
      badges.push(algoDetailBadge);
      const contextBadge = getContextBadge(group, subgroup, algoDetailBadge.id);
      if (contextBadge && !badges.some((b) => b.id === contextBadge.id)) {
        badges.push(contextBadge);
      }
    } else {
      badges.push(primaryBadge);
      badges.push(algoDetailBadge);
    }
  } else {
    badges.push(primaryBadge);
    const contextBadge = getContextBadge(group, subgroup, primaryBadge.id);
    if (contextBadge && !badges.some((b) => b.id === contextBadge.id)) {
      badges.push(contextBadge);
    }
  }

  return badges;
};
