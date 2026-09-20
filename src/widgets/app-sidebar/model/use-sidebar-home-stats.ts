import { useMemo } from "react";
import { CURRICULUM_COUNTS, getTaskSectionById } from "@/entities/task/meta";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";

export interface UseSidebarHomeStatsReturn {
  completedTsTotal: number;
  totalTs: number;
  tsCompletionClass: string;
  completedJsTotal: number;
  completedReactTotal: number;
  completedAlgoTotal: number;
  totalJs: number;
  totalReact: number;
  totalAlgo: number;
  jsCompletionClass: string;
  reactCompletionClass: string;
  algoCompletionClass: string;
}

export const useSidebarHomeStats = (): UseSidebarHomeStatsReturn => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const { completedTotals, activeTotals } = useMemo(() => {
    const excludedSet = new Set(excludedTaskIds);
    const completed = { javascript: 0, typescript: 0, react: 0, algorithms: 0 };
    const excluded = { javascript: 0, typescript: 0, react: 0, algorithms: 0 };

    excludedSet.forEach((taskId) => {
      const section = getTaskSectionById(taskId);
      if (section in excluded) excluded[section] += 1;
    });

    Object.entries(completedTasks).forEach(([taskId, status]) => {
      if (excludedSet.has(taskId)) return;
      if (isTaskCompleted(status)) {
        const section = getTaskSectionById(taskId);
        if (section in completed) completed[section] += 1;
      }
    });

    const active = {
      javascript: Math.max(0, CURRICULUM_COUNTS.javascript - excluded.javascript),
      typescript: Math.max(0, CURRICULUM_COUNTS.typescript - excluded.typescript),
      react: Math.max(0, CURRICULUM_COUNTS.react - excluded.react),
      algorithms: Math.max(0, CURRICULUM_COUNTS.algorithms - excluded.algorithms),
    };

    return { completedTotals: completed, activeTotals: active };
  }, [completedTasks, excludedTaskIds]);

  const getCompletionClass = (
    section: "javascript" | "typescript" | "react" | "algorithms"
  ): string => {
    return activeTotals[section] > 0 && completedTotals[section] === activeTotals[section]
      ? "completedGreen"
      : "";
  };

  return {
    completedTsTotal: completedTotals.typescript,
    totalTs: activeTotals.typescript,
    tsCompletionClass: getCompletionClass("typescript"),
    completedJsTotal: completedTotals.javascript,
    completedReactTotal: completedTotals.react,
    completedAlgoTotal: completedTotals.algorithms,
    totalJs: activeTotals.javascript,
    totalReact: activeTotals.react,
    totalAlgo: activeTotals.algorithms,
    jsCompletionClass: getCompletionClass("javascript"),
    reactCompletionClass: getCompletionClass("react"),
    algoCompletionClass: getCompletionClass("algorithms"),
  };
};
