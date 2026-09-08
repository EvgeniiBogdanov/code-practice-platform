import { getLocalDateString, type ReviewItem } from "@/entities/review";
import type { Task } from "@/entities/task/meta";

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const resolveLocalDate = (localDate: string | undefined, timestamp: number): string => {
  if (localDate && LOCAL_DATE_PATTERN.test(localDate)) return localDate;
  return getLocalDateString(timestamp);
};

const incrementDateCount = (counts: Record<string, number>, date: string): void => {
  if (!date) return;
  counts[date] = (counts[date] ?? 0) + 1;
};

export const getReviewActivityByDate = (
  reviews: Readonly<Record<string, ReviewItem>>,
  targetTasks: readonly Task[]
): Record<string, number> => {
  const counts: Record<string, number> = {};
  const taskIds = new Set(targetTasks.map((task) => String(task.id)));

  for (const taskId of taskIds) {
    const review = reviews[taskId];
    if (!review) continue;

    const history = review.history ?? [];
    if (history.length === 0) {
      incrementDateCount(counts, resolveLocalDate(review.lastReviewedDate, review.lastReviewedAt));
      continue;
    }

    for (const entry of history) {
      incrementDateCount(counts, resolveLocalDate(entry.localDate, entry.date));
    }
  }

  return counts;
};
