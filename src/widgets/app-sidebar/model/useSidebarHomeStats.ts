import { useMemo } from "react";
import { ALL_JS_TASKS, ALL_REACT_TASKS, ALL_ALGO_TASKS } from "@/entities/task";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, getGroupCompletionClass } from "@/entities/review";

export const useSidebarHomeStats = () => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);

  const completedJsTotal = useMemo(
    () => ALL_JS_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );
  const completedReactTotal = useMemo(
    () => ALL_REACT_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );
  const completedAlgoTotal = useMemo(
    () => ALL_ALGO_TASKS.filter((t) => selectIsTaskCompleted(progressState, t.id)).length,
    [progressState]
  );

  const jsCompletionClass = getGroupCompletionClass(
    ALL_JS_TASKS,
    reviews,
    progressState.completedTasks
  );
  const reactCompletionClass = getGroupCompletionClass(
    ALL_REACT_TASKS,
    reviews,
    progressState.completedTasks
  );
  const algoCompletionClass = getGroupCompletionClass(
    ALL_ALGO_TASKS,
    reviews,
    progressState.completedTasks
  );

  return {
    completedJsTotal,
    completedReactTotal,
    completedAlgoTotal,
    jsCompletionClass,
    reactCompletionClass,
    algoCompletionClass,
  };
};
