import React from "react";
import { Home, Zap, Code2, Brain } from "lucide-react";
import { ALL_JS_TASKS, ALL_REACT_TASKS, ALL_ALGO_TASKS } from "./taskRegistry";
import { Task, SectionType } from "../types";

export interface SectionMeta {
  id: "home" | SectionType;
  title: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; color?: string }>;
  color: string;
  badge: string;
  tasks: Task[];
}

export const SECTIONS_CONFIG: Record<"home" | SectionType, SectionMeta> = {
  home: {
    id: "home",
    title: "Главная",
    label: "Главная (Обзор)",
    path: "/home",
    icon: Home,
    color: "#60a5fa",
    badge: "Обзор",
    tasks: [],
  },
  javascript: {
    id: "javascript",
    title: "JavaScript",
    label: "JavaScript",
    path: "/javascript",
    icon: Zap,
    color: "#f59e0b",
    badge: `${ALL_JS_TASKS.length} задач`,
    tasks: ALL_JS_TASKS,
  },
  react: {
    id: "react",
    title: "React",
    label: "React",
    path: "/react",
    icon: Code2,
    color: "#61dafb",
    badge: `${ALL_REACT_TASKS.length} задач`,
    tasks: ALL_REACT_TASKS,
  },
  algorithms: {
    id: "algorithms",
    title: "Алгоритмы",
    label: "Алгоритмы",
    path: "/algorithms",
    icon: Brain,
    color: "#a855f7",
    badge: `${ALL_ALGO_TASKS.length} задач`,
    tasks: ALL_ALGO_TASKS,
  },
};

export const SECTIONS_LIST: SectionMeta[] = [
  SECTIONS_CONFIG.home,
  SECTIONS_CONFIG.javascript,
  SECTIONS_CONFIG.react,
  SECTIONS_CONFIG.algorithms,
];
