import React from "react";
import { Flame, Wrench, Rocket, Brain, Zap, RotateCcw } from "lucide-react";

export const REACT_GROUPS_CONFIG = {
  "group-warmup": {
    name: "Разминка",
    title: "Разминка",
    desc: "Базовые задачи и упражнения по React для закрепления основных хуков и концепций.",
    icon: Flame,
    color: "var(--accent-red)",
    bg: "var(--accent-red-bg)",
  },
  "group-refactoring": {
    name: "Рефакторинг",
    title: "Рефакторинг",
    desc: "Задачи на оптимизацию кода, устранение лишних ререндеров и рефакторинг компонентов.",
    icon: Wrench,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
  },
  "group-middle": {
    name: "UI-компоненты и паттерны",
    title: "UI-компоненты и паттерны",
    desc: "Продуктовые виджеты, работа с сетью, формы, a11y и сложные интерфейсные сценарии.",
    icon: Rocket,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
  },
  "group-strong": {
    name: "Управление состоянием",
    title: "Управление состоянием",
    desc: "Архитектура хранилища данных, хук useReducer и Redux Toolkit (слайсы, thunk, селекторы).",
    icon: Brain,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
  },
  "group-lifecycle": {
    name: "Жизненный цикл и рантайм",
    title: "Жизненный цикл и рантайм",
    desc: "Порядок фаз Render, Commit, Paint, синхронный useLayoutEffect, ref callbacks и цикл очистки эффектов.",
    icon: RotateCcw,
    color: "var(--accent-orange, #f97316)",
    bg: "var(--accent-orange-bg, rgba(249, 115, 22, 0.1))",
  },
  "group-ts": {
    name: "TypeScript: Паттерны типизации",
    title: "TypeScript: Паттерны типизации",
    desc: "Generic-компоненты, полиморфизм, дискриминантные типы и типизация хуков.",
    icon: Zap,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
  },
  "group-ts-practice": {
    name: "TypeScript: Прикладные сценарии",
    title: "TypeScript: Прикладные сценарии",
    desc: "Сквозная разработка компонентов с полной типобезопасностью от DTO до рендера.",
    icon: Zap,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
  },
};

export const isReactGroupValid = (groupId) => Boolean(REACT_GROUPS_CONFIG[groupId]);
