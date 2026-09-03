import React from "react";
import { Flame, Wrench, Rocket, Brain, Zap } from "lucide-react";

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
    name: "Middle",
    title: "Middle",
    desc: "Практические задачи уровня Middle по React с реальных технических собеседований.",
    icon: Rocket,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
  },
  "group-strong": {
    name: "Strong",
    title: "Strong",
    desc: "Продвинутые задачи и сложные паттерны проектирования на React.",
    icon: Brain,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
  },
  "group-ts": {
    name: "React + TS (Разминка)",
    title: "React + TS (Разминка)",
    desc: "Задачи на типизацию базовых хуков, пропсов и компонентов React в TypeScript.",
    icon: Zap,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
  },
  "group-ts-practice": {
    name: "React + TS (Практика)",
    title: "React + TS (Практика)",
    desc: "Комплексные практические задания на связку React + TypeScript.",
    icon: Zap,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
  },
};

export const isReactGroupValid = (groupId) => Boolean(REACT_GROUPS_CONFIG[groupId]);
