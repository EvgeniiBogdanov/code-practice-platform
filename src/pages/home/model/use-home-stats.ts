import { useMemo } from "react";
import { CURRICULUM_COUNTS, getTaskSectionById } from "@/entities/task/meta";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";

export interface HomeStats {
  grandTotal: number;
  grandSolved: number;
  grandPct: number;
  grandRemaining: number;
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

  return useMemo((): HomeStats => {
    let reactSolved = 0;
    let jsSolved = 0;
    let algoSolved = 0;

    Object.entries(completedTasks).forEach(([taskId, status]) => {
      if (!isTaskCompleted(status)) return;
      const section = getTaskSectionById(taskId);
      if (section === "react") reactSolved += 1;
      if (section === "javascript") jsSolved += 1;
      if (section === "algorithms") algoSolved += 1;
    });

    const reactTotal = CURRICULUM_COUNTS.react;
    const reactPct = reactTotal > 0 ? Math.round((reactSolved / reactTotal) * 100) : 0;

    const jsTotal = CURRICULUM_COUNTS.javascript;
    const jsPct = jsTotal > 0 ? Math.round((jsSolved / jsTotal) * 100) : 0;

    const algoTotal = CURRICULUM_COUNTS.algorithms;
    const algoPct = algoTotal > 0 ? Math.round((algoSolved / algoTotal) * 100) : 0;

    const grandTotal = reactTotal + jsTotal + algoTotal;
    const grandSolved = reactSolved + jsSolved + algoSolved;
    const grandPct = grandTotal > 0 ? Math.round((grandSolved / grandTotal) * 100) : 0;
    const grandRemaining = grandTotal - grandSolved;

    return {
      grandTotal,
      grandSolved,
      grandPct,
      grandRemaining,
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
  }, [completedTasks]);
};
