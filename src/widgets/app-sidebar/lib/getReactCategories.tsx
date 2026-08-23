import React from "react";
import { Flame, Wrench, Rocket, Brain, Zap } from "lucide-react";
import { ALL_REACT_TASKS, Task } from "@/entities/task";
import { UIState } from "@/entities/ui-state";
import { ReactCategoryDef } from "../ui/SidebarReactCategoryItem";
import styles from "../ui/SidebarReactList.module.css";

interface CategoryConfig {
  id: string;
  infoId: string;
  label: string;
  icon: React.ReactNode;
  filter: (t: Task) => boolean;
  getExpanded: (s: UIState) => boolean;
  getToggle: (s: UIState) => () => void;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: "warmup",
    infoId: "group-warmup",
    label: "Разминка",
    icon: <Flame size={17} className={styles.iconFlame} />,
    filter: (t) => t.difficulty === "warm-up",
    getExpanded: (s) => s.warmupExpanded,
    getToggle: (s) => () => s.setWarmupExpanded(!s.warmupExpanded),
  },
  {
    id: "refactoring",
    infoId: "group-refactoring",
    label: "Рефакторинг",
    icon: <Wrench size={17} className={styles.iconWrench} />,
    filter: (t) => t.difficulty === "refactoring",
    getExpanded: (s) => s.refactoringExpanded,
    getToggle: (s) => () => s.setRefactoringExpanded(!s.refactoringExpanded),
  },
  {
    id: "middle",
    infoId: "group-middle",
    label: "Middle",
    icon: <Rocket size={17} className={styles.iconRocket} />,
    filter: (t) => t.difficulty === "middle",
    getExpanded: (s) => s.tasksExpanded,
    getToggle: (s) => () => s.setTasksExpanded(!s.tasksExpanded),
  },
  {
    id: "strong",
    infoId: "group-strong",
    label: "Strong",
    icon: <Brain size={17} className={styles.iconBrain} />,
    filter: (t) => t.difficulty === "strong",
    getExpanded: (s) => s.advancedExpanded,
    getToggle: (s) => () => s.setAdvancedExpanded(!s.advancedExpanded),
  },
  {
    id: "ts",
    infoId: "group-ts",
    label: "React + TS (Разминка)",
    icon: <Zap size={17} className={styles.iconZap} />,
    filter: (t) => t.category === "React + TS (Разминка)",
    getExpanded: (s) => s.reactTsExpanded,
    getToggle: (s) => () => s.setReactTsExpanded(!s.reactTsExpanded),
  },
  {
    id: "ts-practice",
    infoId: "group-ts-practice",
    label: "React + TS (Практика)",
    icon: <Zap size={17} className={styles.iconZap} />,
    filter: (t) => t.category === "React + TS (Практика)",
    getExpanded: (s) => s.reactTsPracticeExpanded,
    getToggle: (s) => () => s.setReactTsPracticeExpanded(!s.reactTsPracticeExpanded),
  },
];

export const getReactCategories = (uiState: UIState): ReactCategoryDef[] =>
  CATEGORY_CONFIGS.map((cfg) => ({
    id: cfg.id,
    infoId: cfg.infoId,
    label: cfg.label,
    icon: cfg.icon,
    tasks: ALL_REACT_TASKS.filter(cfg.filter),
    isExpanded: cfg.getExpanded(uiState),
    toggle: cfg.getToggle(uiState),
  }));
