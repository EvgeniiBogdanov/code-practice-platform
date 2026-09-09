import { getReviewsFromLocalStorage, ReviewRecord } from "./reviewService";
import { getProgressFromLocalStorage } from "./progressService";

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

  const isCandidate = taskId.startsWith("cand_");
  taskId = taskId.replace(/^(cand_|sol_)/, "");

  // Candidate solutions never have variant suffixes, so rootTaskId === taskId
  let rootTaskId = taskId;
  if (!isCandidate) {
    const variantMatch = taskId.match(/^(.+)_(\d+)$/);
    if (variantMatch) {
      rootTaskId = variantMatch[1];
    }
  }

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
  const { taskId, rootTaskId } = parseIdMetadata(id);
  const lookupId = taskId || rootTaskId;
  if (!lookupId) return false;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // 1. Spaced Repetition Due Check
  const reviews = getReviewsFromLocalStorage();
  const review = reviews[String(taskId)] || reviews[String(rootTaskId)];
  if (review && isReviewDue(review)) {
    // If solution was not saved today, it belongs to previous review cycle and must be reset
    if (!updatedAt || updatedAt < todayStart) {
      return true;
    }
  }

  // 2. Unsolved Next Day Reset Check
  // Если пользователь нажал «Не решено», на следующий календарный день решение сбрасывается
  const progress = getProgressFromLocalStorage();
  const rawProgress = progress[String(taskId)] || progress[String(rootTaskId)];
  const status =
    typeof rawProgress === "object" && rawProgress !== null ? rawProgress.status : rawProgress;
  const unsolvedTimestamp =
    typeof rawProgress === "object" && rawProgress !== null ? rawProgress.updatedAt : undefined;

  if (status === "unsolved" && unsolvedTimestamp) {
    const unsolvedDate = new Date(unsolvedTimestamp);
    const unsolvedDayStart = new Date(
      unsolvedDate.getFullYear(),
      unsolvedDate.getMonth(),
      unsolvedDate.getDate()
    ).getTime();

    // Прошёл хотя бы 1 календарный день с момента отметки «Не решено»
    if (todayStart > unsolvedDayStart) {
      // Сбрасываем решение, если оно не было создано заново сегодня
      if (!updatedAt || updatedAt < todayStart) {
        return true;
      }
    }
  }

  return false;
}

