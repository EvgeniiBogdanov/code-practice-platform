import type { ReviewItem } from "@/entities/review";

export interface SortableTask {
  id: string | number;
}

export const isDueTaskUnsolved = (
  taskId: string | number,
  reviews?: Record<string, ReviewItem>,
  completedTasks?: Record<string, unknown>
): boolean => {
  const strId = String(taskId);
  const status = completedTasks?.[strId];
  if (status === "unsolved") return true;
  if (status === "solved") return false;
  return Boolean(reviews?.[strId]?.isUnsolved);
};

export const sortDueTasks = <T extends SortableTask>(
  tasks: T[],
  reviews: Record<string, ReviewItem>,
  completedTasks?: Record<string, unknown>
): T[] => {
  return [...tasks].sort((a, b) => {
    const aUnsolved = isDueTaskUnsolved(a.id, reviews, completedTasks);
    const bUnsolved = isDueTaskUnsolved(b.id, reviews, completedTasks);

    if (aUnsolved && !bUnsolved) return -1;
    if (!aUnsolved && bUnsolved) return 1;

    const aNext = reviews[String(a.id)]?.nextReviewAt || 0;
    const bNext = reviews[String(b.id)]?.nextReviewAt || 0;
    return aNext - bNext;
  });
};
