import { useMemo } from "react";
import { CURRICULUM_COUNTS, getTaskSectionById } from "@/entities/task/meta";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";

export interface HomeStats {
  grandTotal: number;
  grandSolved: number;
  grandPct: number;
  grandRemaining: number;
  grandExcluded: number;
  reactTotal: number;
  reactSolved: number;
  reactPct: number;
  jsTotal: number;
  jsSolved: number;
  jsPct: number;
  algoTotal: number;
  algoSolved: number;
  algoPct: number;
}

export const useHomeStats = (): HomeStats => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  return useMemo((): HomeStats => {
    const excludedSet = new Set(excludedTaskIds);

    let reactExcluded = 0;
    let jsExcluded = 0;
    let algoExcluded = 0;

    excludedSet.forEach((taskId) => {
      const section = getTaskSectionById(taskId);
      if (section === "react") reactExcluded += 1;
      if (section === "javascript") jsExcluded += 1;
      if (section === "algorithms") algoExcluded += 1;
    });

    let reactSolved = 0;
    let jsSolved = 0;
    let algoSolved = 0;

    Object.entries(completedTasks).forEach(([taskId, status]) => {
      if (excludedSet.has(taskId)) return;
      if (!isTaskCompleted(status)) return;
      const section = getTaskSectionById(taskId);
      if (section === "react") reactSolved += 1;
      if (section === "javascript") jsSolved += 1;
      if (section === "algorithms") algoSolved += 1;
    });

    const reactTotal = Math.max(0, CURRICULUM_COUNTS.react - reactExcluded);
    const reactPct = reactTotal > 0 ? Math.round((reactSolved / reactTotal) * 100) : 0;

    const jsTotal = Math.max(0, CURRICULUM_COUNTS.javascript - jsExcluded);
    const jsPct = jsTotal > 0 ? Math.round((jsSolved / jsTotal) * 100) : 0;

    const algoTotal = Math.max(0, CURRICULUM_COUNTS.algorithms - algoExcluded);
    const algoPct = algoTotal > 0 ? Math.round((algoSolved / algoTotal) * 100) : 0;

    const grandTotal = reactTotal + jsTotal + algoTotal;
    const grandSolved = reactSolved + jsSolved + algoSolved;
    const grandPct = grandTotal > 0 ? Math.round((grandSolved / grandTotal) * 100) : 0;
    const grandRemaining = Math.max(0, grandTotal - grandSolved);
    const grandExcluded = reactExcluded + jsExcluded + algoExcluded;

    return {
      grandTotal,
      grandSolved,
      grandPct,
      grandRemaining,
      grandExcluded,
      reactTotal,
      reactSolved,
      reactPct,
      jsTotal,
      jsSolved,
      jsPct,
      algoTotal,
      algoSolved,
      algoPct,
    };
  }, [completedTasks, excludedTaskIds]);
};
