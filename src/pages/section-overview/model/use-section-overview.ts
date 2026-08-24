import React, { useMemo } from "react";
import { Zap, Code2, Brain, Flame, Wrench, Rocket } from "lucide-react";
import {
  ALL_JS_TASKS,
  ALL_REACT_TASKS,
  ALL_ALGO_TASKS,
  SectionType,
  getGroupMeta,
  getAlgoGroupMeta,
  Task,
} from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { useReviewStore, isTaskDue, getGroupCompletionClass, ReviewItem } from "@/entities/review";
import { GroupCardData } from "../ui/SectionGroupsGrid";
import styles from "../ui/SectionOverviewPage.module.css";

export interface SectionMeta {
  id: SectionType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tasks: Task[];
  badge: string;
}

export interface SectionStats {
  total: number;
  completed: number;
  solved: number;
  remaining: number;
  percent: number;
  dueTodayCount: number;
}

export interface UseSectionOverviewReturn {
  sectionMeta: SectionMeta;
  stats: SectionStats;
  groups: GroupCardData[];
  isSolved: (id: string | number) => boolean;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
  isTaskDue: (review: ReviewItem | null | undefined) => boolean;
}

export const useSectionOverview = (
  section: "javascript" | "react" | "algorithms"
): UseSectionOverviewReturn => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);

  const isSolved = (id: string | number): boolean => selectIsTaskCompleted(progressState, id);

  const sectionMeta = useMemo((): SectionMeta => {
    if (section === "javascript") {
      return {
        id: "javascript" as SectionType,
        title: "JavaScript Core & Async",
        subtitle:
          "Комплексная практика JavaScript: замыкания, прототипы, Event Loop, промисы, асинхронные генераторы, структуры данных, манипуляции с DOM и чистые алгоритмические функции.",
        icon: React.createElement(Zap, { size: 24, className: styles.iconJs }),
        tasks: ALL_JS_TASKS,
        badge: `${ALL_JS_TASKS.length} задач`,
      };
    }
    if (section === "react") {
      return {
        id: "react" as SectionType,
        title: "React & TypeScript Engineering",
        subtitle:
          "Практика создания современных React-компонентов: кастомные хуки, оптимизация рендеринга, управление состоянием, паттерны рефакторинга и строгая типизация TypeScript.",
        icon: React.createElement(Code2, { size: 24, className: styles.iconReact }),
        tasks: ALL_REACT_TASKS,
        badge: `${ALL_REACT_TASKS.length} задач`,
      };
    }
    return {
      id: "algorithms" as SectionType,
      title: "Algorithms & Data Structures",
      subtitle:
        "Практика алгоритмов и структур данных: массивы, хэш-таблицы, два указателя, скользящее окно, бинарный поиск, деревья, графы и динамическое программирование.",
      icon: React.createElement(Brain, { size: 24, className: styles.iconAlgo }),
      tasks: ALL_ALGO_TASKS,
      badge: `${ALL_ALGO_TASKS.length} задач`,
    };
  }, [section]);

  const stats = useMemo((): SectionStats => {
    const total = sectionMeta.tasks.length;
    const completed = sectionMeta.tasks.filter((t) => isSolved(t.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const dueTodayCount = sectionMeta.tasks.filter((t) => {
      const rev = reviews[String(t.id)];
      return rev && isTaskDue(rev);
    }).length;

    return {
      total,
      completed,
      solved: completed,
      remaining: Math.max(0, total - completed),
      percent,
      dueTodayCount,
    };
  }, [sectionMeta.tasks, isSolved, reviews]);

  const groups = useMemo((): GroupCardData[] => {
    if (section === "javascript") {
      const groupsMap = new Map<string, Task[]>();
      ALL_JS_TASKS.forEach((t) => {
        const g = t.group || "Общие";
        if (!groupsMap.has(g)) groupsMap.set(g, []);
        groupsMap.get(g)!.push(t);
      });

      return Array.from(groupsMap.entries()).map(([name, tasks]) => {
        const completedCount = tasks.filter((t) => isSolved(t.id)).length;
        const completionClass = getGroupCompletionClass(
          tasks,
          reviews,
          progressState.completedTasks
        );
        const meta = getGroupMeta(name);
        return {
          id: name,
          groupId: `group-${encodeURIComponent(name)}`,
          name,
          icon: meta.renderIcon(18),
          tasks,
          completedCount,
          completionClass,
          firstTaskId: String(tasks[0]?.id || "js-1"),
          color: meta.color,
        };
      });
    }

    if (section === "react") {
      const categories = [
        {
          id: "warmup",
          name: "1. Разминка (Warm-up)",
          icon: React.createElement(Flame, { size: 18, color: "#f97316" }),
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "warmup" || t.difficulty === "warm-up"),
          firstTaskId: "warmup-1",
          color: "#f97316",
        },
        {
          id: "refactoring",
          name: "2. Рефакторинг (Refactoring)",
          icon: React.createElement(Wrench, { size: 18, color: "#06b6d4" }),
          tasks: ALL_REACT_TASKS.filter(
            (t) => t.category === "refactoring" || t.difficulty === "refactoring"
          ),
          firstTaskId: "refactor-1",
          color: "#06b6d4",
        },
        {
          id: "middle",
          name: "3. Middle задачи",
          icon: React.createElement(Rocket, { size: 18, color: "#3b82f6" }),
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "middle" || t.difficulty === "middle"),
          firstTaskId: "middle-1",
          color: "#3b82f6",
        },
        {
          id: "strong",
          name: "4. Strong Middle & Senior",
          icon: React.createElement(Zap, { size: 18, color: "#a855f7" }),
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "strong" || t.difficulty === "strong"),
          firstTaskId: "strong-1",
          color: "#a855f7",
        },
        {
          id: "react-ts",
          name: "5. React + TypeScript",
          icon: React.createElement(Code2, { size: 18, color: "#3178c6" }),
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "react-ts" || t.difficulty === "ts"),
          firstTaskId: "ts-1",
          color: "#3178c6",
        },
        {
          id: "ts-practice",
          name: "6. TS Практика (Middle)",
          icon: React.createElement(Code2, { size: 18, color: "#10b981" }),
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "ts-practice"),
          firstTaskId: "ts-practice-1",
          color: "#10b981",
        },
      ];

      return categories.map((cat) => {
        const completedCount = cat.tasks.filter((t) => isSolved(t.id)).length;
        const completionClass = getGroupCompletionClass(
          cat.tasks,
          reviews,
          progressState.completedTasks
        );
        return {
          id: cat.id,
          groupId: `group-${cat.id}`,
          name: cat.name,
          icon: cat.icon,
          tasks: cat.tasks,
          completedCount,
          completionClass,
          firstTaskId: cat.firstTaskId,
          color: cat.color,
        };
      });
    }

    // Algorithms
    const algoGroupsMap = new Map<string, Task[]>();
    ALL_ALGO_TASKS.forEach((t) => {
      const g = t.group || "Общие";
      if (!algoGroupsMap.has(g)) algoGroupsMap.set(g, []);
      algoGroupsMap.get(g)!.push(t);
    });

    return Array.from(algoGroupsMap.entries()).map(([name, tasks]) => {
      const completedCount = tasks.filter((t) => isSolved(t.id)).length;
      const completionClass = getGroupCompletionClass(tasks, reviews, progressState.completedTasks);
      const meta = getAlgoGroupMeta(name);
      return {
        id: name,
        groupId: meta.infoId || `group-${name}`,
        name,
        icon: meta.renderIcon(18),
        tasks,
        completedCount,
        completionClass,
        firstTaskId: String(tasks[0]?.id || "algo-1"),
        color: meta.color,
      };
    });
  }, [section, progressState, reviews]);

  return {
    sectionMeta,
    stats,
    groups,
    isSolved,
    progressState,
    reviews,
    isTaskDue,
  };
};
