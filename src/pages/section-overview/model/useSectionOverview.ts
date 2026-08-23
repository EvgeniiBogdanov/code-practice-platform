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
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, isTaskDue, getGroupCompletionClass } from "@/entities/review";
import { GroupCardData } from "../ui/SectionGroupsGrid";
import styles from "../ui/SectionOverviewPage.module.css";

export const useSectionOverview = (section: "javascript" | "react" | "algorithms") => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);

  const isSolved = (id: string | number) => selectIsTaskCompleted(progressState, id);

  const sectionMeta = useMemo(() => {
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
      title: "Алгоритмы и Структуры Данных",
      subtitle:
        "Классические алгоритмические паттерны: Two Pointers, Sliding Window, бинарный поиск, деревья, графы, динамическое программирование и анализ сложности O(N) / O(1).",
      icon: React.createElement(Brain, { size: 24, className: styles.iconAlgo }),
      tasks: ALL_ALGO_TASKS,
      badge: `${ALL_ALGO_TASKS.length} задач`,
    };
  }, [section]);

  const stats = useMemo(() => {
    const total = sectionMeta.tasks.length;
    const solved = sectionMeta.tasks.filter((t) => isSolved(t.id)).length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    const remaining = total - solved;
    return { total, solved, percent, remaining };
  }, [sectionMeta, progressState]);

  const groups = useMemo<GroupCardData[]>(() => {
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
          groupId: `group-${name}`,
          name,
          icon: meta.renderIcon(18),
          tasks,
          completedCount,
          completionClass,
          firstTaskId: String(tasks[0]?.id || `group-${name}`),
          color: meta.color,
        };
      });
    }

    if (section === "react") {
      const categories = [
        {
          id: "warmup",
          name: "Разминка",
          icon: React.createElement(Flame, { size: 18, className: styles.iconFlame }),
          color: "#ff6b6b",
          tasks: ALL_REACT_TASKS.filter((t) => t.difficulty === "warm-up"),
          firstTaskId: "1",
        },
        {
          id: "refactoring",
          name: "Рефакторинг",
          icon: React.createElement(Wrench, { size: 18, className: styles.iconWrench }),
          color: "#3b82f6",
          tasks: ALL_REACT_TASKS.filter((t) => t.difficulty === "refactoring"),
          firstTaskId: "4",
        },
        {
          id: "middle",
          name: "Middle",
          icon: React.createElement(Rocket, { size: 18, className: styles.iconRocket }),
          color: "#10b981",
          tasks: ALL_REACT_TASKS.filter((t) => t.difficulty === "middle"),
          firstTaskId: "9",
        },
        {
          id: "strong",
          name: "Strong",
          icon: React.createElement(Brain, { size: 18, className: styles.iconBrain }),
          color: "#a855f7",
          tasks: ALL_REACT_TASKS.filter((t) => t.difficulty === "strong"),
          firstTaskId: "12",
        },
        {
          id: "ts",
          name: "React + TS (Разминка)",
          icon: React.createElement(Zap, { size: 18, className: styles.iconZap }),
          color: "#eab308",
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "React + TS (Разминка)"),
          firstTaskId: "ts-1",
        },
        {
          id: "ts-practice",
          name: "React + TS (Практика)",
          icon: React.createElement(Zap, { size: 18, className: styles.iconZap }),
          color: "#eab308",
          tasks: ALL_REACT_TASKS.filter((t) => t.category === "React + TS (Практика)"),
          firstTaskId: "ts-p1",
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

  const dueTasks = useMemo(() => {
    return sectionMeta.tasks.filter((t) => {
      const rev = reviews[String(t.id)];
      return isTaskDue(rev);
    });
  }, [sectionMeta, reviews]);

  return {
    sectionMeta,
    stats,
    groups,
    dueTasks,
    isSolved,
    progressState,
    reviews,
    isTaskDue,
  };
};
