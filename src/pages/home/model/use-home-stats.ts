import { useMemo } from "react";
import { ALL_REACT_TASKS, ALL_JS_TASKS, ALL_ALGO_TASKS, ALL_TASKS } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";

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
  const progressState = useProgressStore();

  return useMemo((): HomeStats => {
    const isSolved = (id: string | number): boolean => selectIsTaskCompleted(progressState, id);

    const reactTotal = ALL_REACT_TASKS.length;
    const reactSolved = ALL_REACT_TASKS.filter((t) => isSolved(t.id)).length;
    const reactPct = reactTotal > 0 ? Math.round((reactSolved / reactTotal) * 100) : 0;

    const jsTotal = ALL_JS_TASKS.length;
    const jsSolved = ALL_JS_TASKS.filter((t) => isSolved(t.id)).length;
    const jsPct = jsTotal > 0 ? Math.round((jsSolved / jsTotal) * 100) : 0;

    const algoTotal = ALL_ALGO_TASKS.length;
    const algoSolved = ALL_ALGO_TASKS.filter((t) => isSolved(t.id)).length;
    const algoPct = algoTotal > 0 ? Math.round((algoSolved / algoTotal) * 100) : 0;

    const grandTotal = ALL_TASKS.length;
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
  }, [progressState]);
};
