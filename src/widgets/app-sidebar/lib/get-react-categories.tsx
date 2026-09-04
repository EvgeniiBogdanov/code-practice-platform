import React from "react";
import { Flame, Wrench, Rocket, Brain, Zap, RotateCcw } from "lucide-react";
import type { Task } from "@/entities/task/meta";
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
  getToggle: (s: UIState) => (e?: React.MouseEvent) => void;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: "warmup",
    infoId: "group-warmup",
    label: "Разминка",
    icon: <Flame size={17} className={styles.iconFlame} />,
    filter: (t) => t.difficulty === "warm-up",
    getExpanded: (s) => s.warmupExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.warmupExpanded);
        return;
      }
      s.setWarmupExpanded(!s.warmupExpanded);
    },
  },
  {
    id: "refactoring",
    infoId: "group-refactoring",
    label: "Рефакторинг",
    icon: <Wrench size={17} className={styles.iconWrench} />,
    filter: (t) => t.difficulty === "refactoring",
    getExpanded: (s) => s.refactoringExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.refactoringExpanded);
        return;
      }
      s.setRefactoringExpanded(!s.refactoringExpanded);
    },
  },
  {
    id: "middle",
    infoId: "group-middle",
    label: "UI-компоненты и паттерны",
    icon: <Rocket size={17} className={styles.iconRocket} />,
    filter: (t) => t.difficulty === "middle",
    getExpanded: (s) => s.tasksExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.tasksExpanded);
        return;
      }
      s.setTasksExpanded(!s.tasksExpanded);
    },
  },
  {
    id: "strong",
    infoId: "group-strong",
    label: "Управление состоянием",
    icon: <Brain size={17} className={styles.iconBrain} />,
    filter: (t) => t.category === "Управление состоянием",
    getExpanded: (s) => s.advancedExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.advancedExpanded);
        return;
      }
      s.setAdvancedExpanded(!s.advancedExpanded);
    },
  },
  {
    id: "lifecycle",
    infoId: "group-lifecycle",
    label: "Жизненный цикл и рантайм",
    icon: <RotateCcw size={17} className={styles.iconRotateCcw} />,
    filter: (t) => t.category === "Жизненный цикл и рантайм",
    getExpanded: (s) => s.lifecycleExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.lifecycleExpanded);
        return;
      }
      s.setLifecycleExpanded(!s.lifecycleExpanded);
    },
  },
  {
    id: "ts",
    infoId: "group-ts",
    label: "TypeScript: Паттерны типизации",
    icon: <Zap size={17} className={styles.iconZap} />,
    filter: (t) => t.category === "TypeScript: Паттерны типизации",
    getExpanded: (s) => s.reactTsExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.reactTsExpanded);
        return;
      }
      s.setReactTsExpanded(!s.reactTsExpanded);
    },
  },
  {
    id: "ts-practice",
    infoId: "group-ts-practice",
    label: "TypeScript: Прикладные сценарии",
    icon: <Zap size={17} className={styles.iconZap} />,
    filter: (t) => t.category === "TypeScript: Прикладные сценарии",
    getExpanded: (s) => s.reactTsPracticeExpanded,
    getToggle: (s) => (e) => {
      if (e?.altKey) {
        s.setAllReactCategoriesExpanded(!s.reactTsPracticeExpanded);
        return;
      }
      s.setReactTsPracticeExpanded(!s.reactTsPracticeExpanded);
    },
  },
];

export const getReactCategories = (uiState: UIState, tasks: readonly Task[]): ReactCategoryDef[] =>
  CATEGORY_CONFIGS.map((cfg) => ({
    id: cfg.id,
    infoId: cfg.infoId,
    label: cfg.label,
    icon: cfg.icon,
    tasks: tasks.filter(cfg.filter),
    isExpanded: cfg.getExpanded(uiState),
    toggle: cfg.getToggle(uiState),
  }));
