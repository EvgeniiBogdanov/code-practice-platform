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
  Binary,
} from "lucide-react";

export const JS_GROUP_CONFIG = {
  "Типы данных": {
    icon: Binary,
    color: "#f59e0b", // Amber
    bg: "rgba(245, 158, 11, 0.12)",
    desc: "Типы данных, неявное приведение типов, сравнения (== vs ===) и ссылочная модель.",
  },
  "Циклы": {
    icon: Repeat,
    color: "#3b82f6", // Blue
    bg: "rgba(59, 130, 246, 0.12)",
    desc: "Задачи на циклы for, while, for...of, for...in и алгоритмы итерации.",
  },
  "Массивы": {
    icon: Layers,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
    desc: "Методы массивов, трансформация данных, фильтрация и агрегация.",
  },
  "Таймеры": {
    icon: Clock,
    color: "#f59e0b", // Amber
    bg: "rgba(245, 158, 11, 0.12)",
    desc: "Работа с setTimeout, setInterval, дебаунс и троттлинг.",
  },
  "Коллекции": {
    icon: Boxes,
    color: "#8b5cf6", // Purple
    bg: "rgba(139, 92, 246, 0.12)",
    desc: "Структуры данных Map, Set, WeakMap и WeakSet в JavaScript.",
  },
  "Строки и Утилиты": {
    icon: FileCode,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
    desc: "Алгоритмы обработки строк, форматирование и парсинг.",
  },
  "Объекты и Утилиты": {
    icon: Box,
    color: "#6366f1", // Indigo
    bg: "rgba(99, 102, 241, 0.12)",
    desc: "Манипуляции с объектами, глубокое клонирование и утилиты.",
  },
  "Замыкания": {
    icon: Lock,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
    desc: "Лексическое окружение, замыкания и инкапсуляция состояния.",
  },
  "Рекурсия": {
    icon: GitMerge,
    color: "#f97316", // Orange
    bg: "rgba(249, 115, 22, 0.12)",
    desc: "Рекурсивные функции, базовые случаи, обход деревьев и графов.",
  },
  "Прототипы THIS": {
    icon: Crown,
    color: "#a855f7", // Violet
    bg: "rgba(168, 85, 247, 0.12)",
    desc: "Контекст вызова this, прототипное наследование и классы.",
  },
  "Каррирование": {
    icon: Sparkles,
    color: "#14b8a6", // Teal
    bg: "rgba(20, 184, 166, 0.12)",
    desc: "Функциональное программирование, каррирование и композиция функций.",
  },
  "Промисы": {
    icon: Zap,
    color: "#ec4899", // Pink
    bg: "rgba(236, 72, 153, 0.12)",
    desc: "Асинхронность, Promise API, async/await и цепочки микротасок.",
  },
  "Асинхронные полифилы": {
    icon: Zap,
    color: "#f43f5e", // Rose / Red-Pink
    bg: "rgba(244, 63, 94, 0.12)",
    desc: "Реализация полифилов Promise.all, Promise.race, allSettled и any.",
  },
  "Event Loop": {
    icon: Activity,
    color: "#ef4444", // Red
    bg: "rgba(239, 68, 68, 0.12)",
    desc: "Порядок выполнения макро- и микротасок в Event Loop.",
  },
  "Контроль частоты": {
    icon: Sliders,
    color: "#eab308", // Amber
    bg: "rgba(234, 179, 8, 0.12)",
    desc: "Паттерны debounce, throttle и управление частотой вызовов.",
  },
  "Паттерны проектирования": {
    icon: Workflow,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
    desc: "Паттерны проектирования, Singleton, Observer, Factory и PubSub.",
  },
};

export const getGroupMeta = (groupName) => {
  if (JS_GROUP_CONFIG[groupName]) {
    const meta = JS_GROUP_CONFIG[groupName];
    const IconComponent = meta.icon;
    return {
      ...meta,
      renderIcon: (size = 14) => (
        <IconComponent size={size} color={meta.color} />
      ),
    };
  }

  const meta = {
    icon: Folder,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
    desc: `Задачи раздела «${groupName}».`,
  };
  const IconComponent = meta.icon;

  return {
    ...meta,
    renderIcon: (size = 14) => (
      <IconComponent size={size} color={meta.color} />
    ),
  };
};

export default getGroupMeta;
