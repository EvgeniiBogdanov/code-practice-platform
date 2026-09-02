import type { ReviewItem } from "@/entities/review";
import type { Task } from "@/entities/task";

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

  const difficulty = String(task.difficulty ?? "").toLowerCase();
  if (difficulty === "hard" || difficulty === "strong") return "hard";
  if (["medium", "middle", "refactoring", "ts"].includes(difficulty)) return "medium";
  return "easy";
};
