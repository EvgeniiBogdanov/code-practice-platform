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

const isAlgorithmTask = (group: string, title: string): boolean =>
  title.includes("бинарный поиск") ||
  title.includes("алгоритм") ||
  title.includes("евклид") ||
  title.includes("палиндром") ||
  title.includes("пузырьковая сортировка") ||
  title.includes("bubble sort") ||
  title.includes("анаграмм") ||
  title.includes("фибоначчи") ||
  title.includes("обход бинарного дерева") ||
  title.includes("глубина (высота) дерева") ||
  title.includes("поиск файла") ||
  title.includes("сбор всех примитивов") ||
  title.includes("сумма цифр") ||
  title.includes("разворот числа") ||
  title.includes("односвязного списка") ||
  title.includes("слияние двух") ||
  title.includes("частоты элементов") ||
  title.includes("категорий") ||
  group === "Рекурсия";

const getAlgorithmDetailBadge = (title: string): TaskBadge => {
  if (title.includes("бинарный поиск") || title.includes("binary search")) {
    return { id: "algo-bs", label: "Binary Search", variant: "blue", icon: <Search size={ICON_SIZE} /> };
  }
  if (title.includes("евклид") || title.includes("gcd")) {
    return { id: "algo-euclid", label: "Алгоритм Евклида", variant: "purple", icon: <Cpu size={ICON_SIZE} /> };
  }
  if (
    title.includes("палиндром") ||
    title.includes("слияние двух отсортированных") ||
    title.includes("two pointers") ||
    title.includes("два указателя")
  ) {
    return { id: "algo-two-pointers", label: "Two Pointers", variant: "pink", icon: <GitMerge size={ICON_SIZE} /> };
  }
  if (title.includes("пузырьковая") || title.includes("bubble sort")) {
    return { id: "algo-bubble", label: "Bubble Sort", variant: "purple", icon: <Layers size={ICON_SIZE} /> };
  }
  if (
    title.includes("частот") ||
    title.includes("вхождений") ||
    title.includes("анаграмм") ||
    title.includes("категорий")
  ) {
    return { id: "algo-hash-map", label: "Hash Map", variant: "yellow", icon: <Hash size={ICON_SIZE} /> };
  }
  if (
    title.includes("дерев") ||
    title.includes("файловой системе") ||
    title.includes("вложенных объектах") ||
    title.includes("вложенном объекте") ||
    title.includes("сбор всех") ||
    title.includes("бинарного дерева") ||
    title.includes("flatten") ||
    title.includes("сплющивание")
  ) {
    return { id: "algo-dfs", label: "DFS", variant: "green", icon: <GitBranch size={ICON_SIZE} /> };
  }
  if (title.includes("фибоначчи")) {
    return {
      id: "algo-dp",
      label: "Динамическое программирование",
      variant: "purple",
      icon: <Cpu size={ICON_SIZE} />,
    };
  }
  return { id: "algo-base", label: "Базовый алгоритм", variant: "purple", icon: <Brain size={ICON_SIZE} /> };
};

const getPrimaryBadge = (group: string, subgroup: string, title: string): TaskBadge => {
  if (isPolyfillTask(title, subgroup)) {
    return { id: "polyfill", label: "Полифил", variant: "red", icon: <Package size={ICON_SIZE} /> };
  }
  if (isPatternTask(group, subgroup, title)) {
    return { id: "pattern", label: "Паттерн", variant: "cyan", icon: <Workflow size={ICON_SIZE} /> };
  }
  if (isUtilityTask(group, subgroup, title)) {
    return { id: "utility", label: "Утилита", variant: "blue", icon: <Wrench size={ICON_SIZE} /> };
  }
  if (isAlgorithmTask(group, title) && !isSyntaxTask(title)) {
    return { id: "algo", label: "Алгоритм", variant: "purple", icon: <Brain size={ICON_SIZE} /> };
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
    return { id: "recursion", label: "Рекурсия", variant: "orange", icon: <GitMerge size={ICON_SIZE} /> };
  }
  if (group === "Типы данных") {
    return { id: "types", label: "Типы данных", variant: "yellow", icon: <Binary size={ICON_SIZE} /> };
  }
  if (group === "Прототипы THIS") {
    return { id: "prototypes", label: "This и прототипы", variant: "purple", icon: <Crown size={ICON_SIZE} /> };
  }
  if (group === "Замыкания" || group === "Замыкания и функции" || subgroup.startsWith("Замыкания")) {
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
  if (group === "Объекты" && primaryId !== "utility") {
    return { id: "objects", label: "Объекты", variant: "blue", icon: <Box size={ICON_SIZE} /> };
  }
  if (group === "Массивы") {
    return { id: "arrays", label: "Массивы", variant: "green", icon: <Layers size={ICON_SIZE} /> };
  }
  if (group === "Строки и Утилиты") {
    return { id: "strings-utils", label: "Строки и Утилиты", variant: "green", icon: <FileCode size={ICON_SIZE} /> };
  }
  return null;
};

export const getJsTaskBadges = (task: Task): TaskBadge[] => {
  const title = (task.title || "").toLowerCase();
  const group = task.group || "";
  const subgroup = task.subgroup || "";

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

  const primaryBadge = getPrimaryBadge(group, subgroup, title);

  if (primaryBadge.id === "algo") {
    const algoDetailBadge = getAlgorithmDetailBadge(title);
    if (algoDetailBadge.id === "algo-base") {
      badges.push(algoDetailBadge);
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
