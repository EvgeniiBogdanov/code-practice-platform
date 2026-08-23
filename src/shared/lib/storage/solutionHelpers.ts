import { getReviewsFromLocalStorage, ReviewRecord } from "./reviewService";

export function parseIdMetadata(id: string): {
  taskId: string;
  rootTaskId: string;
  fileIdx: number;
} {
  if (!id) return { taskId: "", rootTaskId: "", fileIdx: 0 };

  const fileMatch = id.match(/_file_(\d+)$/);
  const fileIdx = fileMatch ? parseInt(fileMatch[1], 10) : 0;

  let taskId = id;
  if (fileMatch) {
    taskId = id.slice(0, fileMatch.index);
  }

  taskId = taskId.replace(/^(cand_|sol_)/, "");

  const variantMatch = taskId.match(/^(.+)_(\d+)$/);
  const rootTaskId = variantMatch ? variantMatch[1] : taskId;

  return { taskId, rootTaskId, fileIdx };
}

export function isReviewDue(review: ReviewRecord): boolean {
  if (!review || !review.stage || review.stage === 0) return false;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (review.dueDate) {
    return todayStr >= review.dueDate;
  }
  if (review.nextReviewAt) {
    return review.nextReviewAt <= Date.now();
  }
  return false;
}

export function shouldResetDueSolution(id: string, updatedAt?: number): boolean {
  if (!id || typeof id !== "string" || !id.startsWith("cand_")) return false;
  const { rootTaskId } = parseIdMetadata(id);
  if (!rootTaskId) return false;

  const reviews = getReviewsFromLocalStorage();
  const review = reviews[String(rootTaskId)];
  if (review && isReviewDue(review)) {
    if (!updatedAt || (review.lastReviewedAt && updatedAt <= review.lastReviewedAt)) {
      return true;
    }
  }
  return false;
}
