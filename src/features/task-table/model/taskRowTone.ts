import type { ReviewItem } from "@/entities/review";
import { getDifficultyTone, type Task } from "@/entities/task";

export type TaskRowStatus = "solved" | "unsolved" | "unstarted";
export type TaskRowTone = "default" | "easy" | "medium" | "hard" | "unsolved" | "excluded";

export const getTaskRowTone = (
  task: Task,
  status: TaskRowStatus,
  review?: ReviewItem | null,
  isExcluded?: boolean
): TaskRowTone => {
  if (isExcluded) return "excluded";
  if (status === "unsolved") return "unsolved";
  if (status !== "solved") return "default";
  if (review?.rating) return review.rating;

  return getDifficultyTone(task.difficulty) ?? "easy";
};
