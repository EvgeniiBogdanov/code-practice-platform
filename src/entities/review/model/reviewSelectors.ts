import { ReviewState, ReviewItem } from "../types";
import { isTaskDue } from "./sm2Algorithm";

export const selectTaskReview = (
  state: ReviewState,
  taskId: string | number
): ReviewItem | undefined => {
  return state.reviews[String(taskId)];
};

export const selectIsTaskDue = (state: ReviewState, taskId: string | number): boolean => {
  const rev = state.reviews[String(taskId)];
  return Boolean(rev && isTaskDue(rev));
};

export const selectDueTasksCount = (state: ReviewState): number => {
  return Object.values(state.reviews).filter((rev) => isTaskDue(rev)).length;
};
