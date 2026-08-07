import React from "react";
import {
  Repeat,
  Layers,
  Clock,
  Boxes,
  Zap,
  Lock,
  GitMerge,
  Crown,
  Sparkles,
  Sliders,
  Workflow,
  Activity,
  FileCode,
  Box,
  Folder,
} from "lucide-react";

export const JS_GROUP_CONFIG = {
  "Циклы": {
    icon: Repeat,
    color: "#3b82f6", // Blue
    bg: "rgba(59, 130, 246, 0.12)",
  },
  "Массивы": {
    icon: Layers,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
  },
  "Таймеры": {
    icon: Clock,
    color: "#f59e0b", // Amber
    bg: "rgba(245, 158, 11, 0.12)",
  },
  "Коллекции": {
    icon: Boxes,
    color: "#8b5cf6", // Purple
    bg: "rgba(139, 92, 246, 0.12)",
  },
  "Промисы": {
    icon: Zap,
    color: "#ec4899", // Pink
    bg: "rgba(236, 72, 153, 0.12)",
  },
  "Замыкания": {
    icon: Lock,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
  },
  "Рекурсия": {
    icon: GitMerge,
    color: "#f97316", // Orange
    bg: "rgba(249, 115, 22, 0.12)",
  },
  "Прототипы THIS": {
    icon: Crown,
    color: "#a855f7", // Violet
    bg: "rgba(168, 85, 247, 0.12)",
  },
  "Каррирование": {
    icon: Sparkles,
    color: "#14b8a6", // Teal
    bg: "rgba(20, 184, 166, 0.12)",
  },
  "Асинхронные полифилы": {
    icon: Zap,
    color: "#f43f5e", // Rose / Red-Pink
    bg: "rgba(244, 63, 94, 0.12)",
  },
  "Контроль частоты": {
    icon: Sliders,
    color: "#eab308", // Amber
    bg: "rgba(234, 179, 8, 0.12)",
  },
  "Объекты и Утилиты": {
    icon: Box,
    color: "#a855f7", // Purple
    bg: "rgba(168, 85, 247, 0.12)",
  },
  "Паттерны проектирования": {
    icon: Workflow,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
  },
  "Event Loop": {
    icon: Activity,
    color: "#ef4444", // Red
    bg: "rgba(239, 68, 68, 0.12)",
  },
  "Строки и Утилиты": {
    icon: FileCode,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
  },
};

export const getGroupMeta = (groupName) => {
  const meta = JS_GROUP_CONFIG[groupName] || {
    icon: Folder,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
  };
  const IconComponent = meta.icon;

  return {
    ...meta,
    renderIcon: (size = 14, extraStyle = {}) => (
      <IconComponent size={size} style={{ color: meta.color, flexShrink: 0, ...extraStyle }} />
    ),
  };
};

export default getGroupMeta;
