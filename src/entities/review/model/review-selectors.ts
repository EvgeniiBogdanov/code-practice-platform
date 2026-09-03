import { ReviewState, ReviewItem } from "../types";
import { isTaskDue } from "./sm2-algorithm";

export const selectTaskReview = (
  state: ReviewState,
  taskId: string | number
): ReviewItem | undefined => {
  return state.reviews[String(taskId)];
};

export const selectIsTaskDue = (state: ReviewState, taskId: string | number): boolean => {
  if (state.excludedTaskIds.includes(String(taskId))) return false;
  const rev = state.reviews[String(taskId)];
  return Boolean(rev && isTaskDue(rev));
};

export const selectDueTasksCount = (state: ReviewState): number => {
  const excludedSet = new Set(state.excludedTaskIds.map(String));
  return Object.entries(state.reviews).filter(
    ([id, rev]) => !excludedSet.has(String(id)) && isTaskDue(rev)
  ).length;
};
