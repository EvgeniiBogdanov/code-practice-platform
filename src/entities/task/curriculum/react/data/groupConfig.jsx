import React from "react";
import { Flame, Wrench, Rocket, Brain, Zap } from "lucide-react";
import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
} from "./tasksData";

export const REACT_GROUPS_CONFIG = {
  "group-warmup": {
    name: "Разминка",
    title: "Разминка",
    desc: "Базовые задачи и упражнения по React для закрепления основных хуков и концепций.",
    icon: Flame,
    color: "#ff6b6b",
    bg: "rgba(255, 107, 107, 0.12)",
    tasks: WARMUP_TASKS,
  },
  "group-refactoring": {
    name: "Рефакторинг",
    title: "Рефакторинг",
    desc: "Задачи на оптимизацию кода, устранение лишних ререндеров и рефакторинг компонентов.",
    icon: Wrench,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
    tasks: REFACTORING_TASKS,
  },
  "group-middle": {
    name: "Middle",
    title: "Middle",
    desc: "Практические задачи уровня Middle по React с реальных технических собеседований.",
    icon: Rocket,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    tasks: MAIN_TASKS,
  },
  "group-strong": {
    name: "Strong",
    title: "Strong",
    desc: "Продвинутые задачи и сложные паттерны проектирования на React.",
    icon: Brain,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
    tasks: ADVANCED_TASKS,
  },
  "group-ts": {
    name: "React + TS (Разминка)",
    title: "React + TS (Разминка)",
    desc: "Задачи на типизацию базовых хуков, пропсов и компонентов React в TypeScript.",
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    tasks: REACT_TS_TASKS,
  },
  "group-ts-practice": {
    name: "React + TS (Практика)",
    title: "React + TS (Практика)",
    desc: "Комплексные практические задания на связку React + TypeScript.",
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    tasks: REACT_TS_PRACTICE_TASKS,
  },
};

export const isReactGroupValid = (groupId) => Boolean(REACT_GROUPS_CONFIG[groupId]);
