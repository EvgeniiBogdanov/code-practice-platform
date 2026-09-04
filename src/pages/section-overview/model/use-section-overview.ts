import React, { useCallback, useMemo } from "react";
import { Zap, Code2, Brain, Flame, Wrench, Rocket, RotateCcw } from "lucide-react";
import { getGroupMeta, getAlgoGroupMeta } from "@/entities/task/groups";
import type { SectionType, Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
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
  excludedCount: number;
}

export interface UseSectionOverviewReturn {
  sectionMeta: SectionMeta;
  stats: SectionStats;
  groups: GroupCardData[];
  isSolved: (id: string | number) => boolean;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
  isTaskDue: (review: ReviewItem | null | undefined) => boolean;
  isInitialized: boolean;
}

export const useSectionOverview = (
  section: "javascript" | "react" | "algorithms"
): UseSectionOverviewReturn => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const { tasks, isLoading } = useTaskSection(section);
  const sectionTasks = useMemo(() => Array.from(tasks), [tasks]);
  const activeSectionTasks = useMemo(
    () => sectionTasks.filter((t) => !excludedTaskIds.includes(String(t.id))),
    [sectionTasks, excludedTaskIds]
  );

  const isSolved = useCallback(
    (id: string | number): boolean => selectIsTaskCompleted(progressState, id),
    [progressState]
  );

  const sectionMeta = useMemo((): SectionMeta => {
    if (section === "javascript") {
      return {
        id: "javascript" as SectionType,
        title: "JavaScript Core & Async",
        subtitle:
          "Комплексная практика JavaScript: замыкания, прототипы, Event Loop, промисы, асинхронные генераторы, структуры данных, манипуляции с DOM и чистые алгоритмические функции.",
        icon: React.createElement(Zap, { size: 24, className: styles.iconJs }),
        tasks: sectionTasks,
        badge: `${activeSectionTasks.length} задач`,
      };
    }
    if (section === "react") {
      return {
        id: "react" as SectionType,
        title: "React & TypeScript Engineering",
        subtitle:
          "Практика создания современных React-компонентов: кастомные хуки, оптимизация рендеринга, управление состоянием, паттерны рефакторинга и строгая типизация TypeScript.",
        icon: React.createElement(Code2, { size: 24, className: styles.iconReact }),
        tasks: sectionTasks,
        badge: `${activeSectionTasks.length} задач`,
      };
    }
    return {
      id: "algorithms" as SectionType,
      title: "Algorithms & Data Structures",
      subtitle:
        "Практика алгоритмов и структур данных: массивы, хэш-таблицы, два указателя, скользящее окно, бинарный поиск, деревья, графы и динамическое программирование.",
      icon: React.createElement(Brain, { size: 24, className: styles.iconAlgo }),
      tasks: sectionTasks,
      badge: `${activeSectionTasks.length} задач`,
    };
  }, [section, sectionTasks, activeSectionTasks]);

  const stats = useMemo((): SectionStats => {
    const total = activeSectionTasks.length;
    const completed = activeSectionTasks.filter((t) => isSolved(t.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const dueTodayCount = activeSectionTasks.filter((t) => {
      const rev = reviews[String(t.id)];
      return rev && isTaskDue(rev);
    }).length;
    const excludedCount = sectionTasks.length - activeSectionTasks.length;

    return {
      total,
      completed,
      solved: completed,
      remaining: Math.max(0, total - completed),
      percent,
      dueTodayCount,
      excludedCount,
    };
  }, [activeSectionTasks, sectionTasks.length, isSolved, reviews]);

  const groups = useMemo((): GroupCardData[] => {
    if (section === "javascript") {
      const groupsMap = new Map<string, Task[]>();
      sectionTasks.forEach((t) => {
        const g = t.group || "Общие";
        if (!groupsMap.has(g)) groupsMap.set(g, []);
        groupsMap.get(g)!.push(t);
      });

      return Array.from(groupsMap.entries()).map(([name, groupTasksList]) => {
        const activeGroupTasks = groupTasksList.filter(
          (t) => !excludedTaskIds.includes(String(t.id))
        );
        const completedCount = activeGroupTasks.filter((t) => isSolved(t.id)).length;
        const completionClass = getGroupCompletionClass(
          activeGroupTasks,
          reviews,
          progressState.completedTasks
        );
        const meta = getGroupMeta(name);
        return {
          id: name,
          groupId: `group-${name}`,
          name,
          icon: meta.renderIcon(18),
          tasks: activeGroupTasks,
          completedCount,
          completionClass,
          firstTaskId: String(groupTasksList[0]?.id || "js-1"),
          color: meta.color,
        };
      });
    }

    if (section === "react") {
      const categories = [
        {
          id: "warmup",
          name: "1. Разминка",
          icon: React.createElement(Flame, { size: 18, color: "#f97316" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "warmup" || t.difficulty === "warm-up"
          ),
          firstTaskId: "warmup-1",
          color: "#f97316",
        },
        {
          id: "refactoring",
          name: "2. Рефакторинг",
          icon: React.createElement(Wrench, { size: 18, color: "#06b6d4" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "refactoring" || t.difficulty === "refactoring"
          ),
          firstTaskId: "refactor-1",
          color: "#06b6d4",
        },
        {
          id: "middle",
          name: "3. UI-компоненты и паттерны",
          icon: React.createElement(Rocket, { size: 18, color: "#3b82f6" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "UI-компоненты и паттерны" || t.difficulty === "middle"
          ),
          firstTaskId: "middle-1",
          color: "#3b82f6",
        },
        {
          id: "strong",
          name: "4. Управление состоянием",
          icon: React.createElement(Brain, { size: 18, color: "#a855f7" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "Управление состоянием"
          ),
          firstTaskId: "a1",
          color: "#a855f7",
        },
        {
          id: "lifecycle",
          name: "5. Жизненный цикл и рантайм",
          icon: React.createElement(RotateCcw, { size: 18, color: "#f97316" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "Жизненный цикл и рантайм"
          ),
          firstTaskId: "a4",
          color: "#f97316",
        },
        {
          id: "ts",
          name: "6. TypeScript: Паттерны типизации",
          icon: React.createElement(Code2, { size: 18, color: "#3178c6" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "TypeScript: Паттерны типизации"
          ),
          firstTaskId: "ts-1",
          color: "#3178c6",
        },
        {
          id: "ts-practice",
          name: "7. TypeScript: Прикладные сценарии",
          icon: React.createElement(Code2, { size: 18, color: "#10b981" }),
          tasks: sectionTasks.filter(
            (t) => t.category === "TypeScript: Прикладные сценарии"
          ),
          firstTaskId: "ts-practice-1",
          color: "#10b981",
        },
      ];

      return categories.map((cat) => {
        const activeCatTasks = cat.tasks.filter((t) => !excludedTaskIds.includes(String(t.id)));
        const completedCount = activeCatTasks.filter((t) => isSolved(t.id)).length;
        const completionClass = getGroupCompletionClass(
          activeCatTasks,
          reviews,
          progressState.completedTasks
        );
        return {
          id: cat.id,
          groupId: `group-${cat.id}`,
          name: cat.name,
          icon: cat.icon,
          tasks: activeCatTasks,
          completedCount,
          completionClass,
          firstTaskId: cat.firstTaskId,
          color: cat.color,
        };
      });
    }

    // Algorithms
    const algoGroupsMap = new Map<string, Task[]>();
    sectionTasks.forEach((t) => {
      const g = t.group || "Общие";
      if (!algoGroupsMap.has(g)) algoGroupsMap.set(g, []);
      algoGroupsMap.get(g)!.push(t);
    });

    return Array.from(algoGroupsMap.entries()).map(([name, groupTasksList]) => {
      const activeAlgoTasks = groupTasksList.filter(
        (t) => !excludedTaskIds.includes(String(t.id))
      );
      const completedCount = activeAlgoTasks.filter((t) => isSolved(t.id)).length;
      const completionClass = getGroupCompletionClass(
        activeAlgoTasks,
        reviews,
        progressState.completedTasks
      );
      const meta = getAlgoGroupMeta(name);
      return {
        id: name,
        groupId: meta.infoId || `group-${name}`,
        name,
        icon: meta.renderIcon(18),
        tasks: activeAlgoTasks,
        completedCount,
        completionClass,
        firstTaskId: String(groupTasksList[0]?.id || "algo-1"),
        color: meta.color,
      };
    });
  }, [section, sectionTasks, excludedTaskIds, isSolved, progressState.completedTasks, reviews]);

  return {
    sectionMeta,
    stats,
    groups,
    isSolved,
    progressState,
    reviews,
    isTaskDue,
    isInitialized: progressState.isInitialized && !isLoading,
  };
};
