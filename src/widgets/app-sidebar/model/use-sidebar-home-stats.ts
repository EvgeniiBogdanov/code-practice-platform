import { useMemo } from "react";
import { CURRICULUM_COUNTS, getTaskSectionById } from "@/entities/task/meta";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";

export interface UseSidebarHomeStatsReturn {
  completedJsTotal: number;
  completedReactTotal: number;
  completedAlgoTotal: number;
  jsCompletionClass: string;
  reactCompletionClass: string;
  algoCompletionClass: string;
}

export const useSidebarHomeStats = (): UseSidebarHomeStatsReturn => {
  const completedTasks = useProgressStore((state) => state.completedTasks);

  const completedTotals = useMemo(() => {
    const totals = { javascript: 0, react: 0, algorithms: 0 };

    Object.entries(completedTasks).forEach(([taskId, status]) => {
      if (isTaskCompleted(status)) totals[getTaskSectionById(taskId)] += 1;
    });

    return totals;
  }, [completedTasks]);

  const getCompletionClass = (section: "javascript" | "react" | "algorithms"): string => {
    return completedTotals[section] === CURRICULUM_COUNTS[section] ? "completedGreen" : "";
  };

  return {
    completedJsTotal: completedTotals.javascript,
    completedReactTotal: completedTotals.react,
    completedAlgoTotal: completedTotals.algorithms,
    jsCompletionClass: getCompletionClass("javascript"),
    reactCompletionClass: getCompletionClass("react"),
    algoCompletionClass: getCompletionClass("algorithms"),
  };
};
