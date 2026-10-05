import React from "react";
import {
  Binary,
  Box,
  Boxes,
  CaseSensitive,
  Crown,
  FileCode,
  GitMerge,
  Infinity as InfinityIcon,
  Layers,
  Lock,
  Repeat,
  Variable,
  Workflow,
  Zap,
} from "lucide-react";
import type { TaskBadge } from "./get-js-task-badges";

const ICON_SIZE = 12;

interface ContextBadgeRule {
  badge: TaskBadge;
  /** Не показывать контекст, если основной бейдж уже его описывает */
  skipForPrimary?: string;
}

const SUBGROUP_CONTEXT_BADGES: Readonly<Record<string, TaskBadge>> = {
  Map: { id: "map", label: "Map", variant: "purple", icon: <Boxes size={ICON_SIZE} /> },
  Set: { id: "set", label: "Set", variant: "purple", icon: <Boxes size={ICON_SIZE} /> },
};

const GROUP_CONTEXT_BADGES: Readonly<Record<string, ContextBadgeRule>> = {
  "Область видимости": {
    badge: {
      id: "scope",
      label: "Область видимости",
      variant: "yellow",
      icon: <Variable size={ICON_SIZE} />,
    },
  },
  "Типы данных": {
    badge: {
      id: "types",
      label: "Типы данных",
      variant: "yellow",
      icon: <Binary size={ICON_SIZE} />,
    },
  },
  Циклы: {
    badge: { id: "loops", label: "Циклы", variant: "blue", icon: <Repeat size={ICON_SIZE} /> },
    skipForPrimary: "base",
  },
  Объекты: {
    badge: { id: "objects", label: "Объекты", variant: "blue", icon: <Box size={ICON_SIZE} /> },
    skipForPrimary: "utility",
  },
  Массивы: {
    badge: { id: "arrays", label: "Массивы", variant: "green", icon: <Layers size={ICON_SIZE} /> },
  },
  Строки: {
    badge: {
      id: "strings",
      label: "Строки",
      variant: "green",
      icon: <CaseSensitive size={ICON_SIZE} />,
    },
  },
  Коллекции: {
    badge: {
      id: "collections",
      label: "Коллекции",
      variant: "purple",
      icon: <Boxes size={ICON_SIZE} />,
    },
  },
  "Функции и замыкания": {
    badge: { id: "closures", label: "Замыкания", variant: "cyan", icon: <Lock size={ICON_SIZE} /> },
  },
  Рекурсия: {
    badge: {
      id: "recursion",
      label: "Рекурсия",
      variant: "orange",
      icon: <GitMerge size={ICON_SIZE} />,
    },
    skipForPrimary: "algo",
  },
  "this, прототипы и классы": {
    badge: {
      id: "prototypes",
      label: "This и прототипы",
      variant: "purple",
      icon: <Crown size={ICON_SIZE} />,
    },
  },
  "Итераторы и генераторы": {
    badge: {
      id: "iterators",
      label: "Итераторы",
      variant: "cyan",
      icon: <InfinityIcon size={ICON_SIZE} />,
    },
  },
  Асинхронность: {
    badge: { id: "async", label: "Асинхронность", variant: "pink", icon: <Zap size={ICON_SIZE} /> },
  },
  "Паттерны проектирования": {
    badge: {
      id: "patterns",
      label: "Паттерны",
      variant: "cyan",
      icon: <Workflow size={ICON_SIZE} />,
    },
    skipForPrimary: "pattern",
  },
  Утилиты: {
    badge: { id: "utils", label: "Утилиты", variant: "green", icon: <FileCode size={ICON_SIZE} /> },
    skipForPrimary: "utility",
  },
};

export const getContextBadge = (
  group: string,
  subgroup: string,
  primaryId: string
): TaskBadge | null => {
  const subgroupBadge = SUBGROUP_CONTEXT_BADGES[subgroup];
  if (subgroupBadge) return subgroupBadge;

  const rule = GROUP_CONTEXT_BADGES[group];
  if (!rule || rule.skipForPrimary === primaryId) return null;
  return rule.badge;
};
