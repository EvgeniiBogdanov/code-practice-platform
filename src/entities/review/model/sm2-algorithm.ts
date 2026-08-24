import { ReviewItem, ReviewRating, ReviewHistoryEntry, MasteryStats } from "../types";

export const STAGE_INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const MAX_STAGE = 6;

export const STAGE_LABELS: Record<number, string> = {
  0: "Новая задача",
  1: "Уровень 1 (1 день)",
  2: "Уровень 2 (3 дня)",
  3: "Уровень 3 (7 дней)",
  4: "Уровень 4 (14 дней)",
  5: "Уровень 5 (30 дней)",
  6: "Мастер (60+ дней)",
};

export const RATINGS = {
  HARD: "hard" as ReviewRating,
  MEDIUM: "medium" as ReviewRating,
  EASY: "easy" as ReviewRating,
};

export function getLocalDateString(dateInput: Date | number = new Date()): string {
  const d = typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStartOfLocalDay(dateInput: Date | number = new Date()): Date {
  const d = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput.getTime());
  if (!d || isNaN(d.getTime())) return new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function calculateNextReviewDay(
  fromDate: Date | number = new Date(),
  intervalDays = 1
): { dueDate: string; nextReviewAt: number } {
  const base = typeof fromDate === "number" ? new Date(fromDate) : fromDate;
  const target = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + intervalDays,
    0,
    0,
    0,
    0
  );
  const dueDate = getLocalDateString(target);
  const nextReviewAt = target.getTime();
  return { dueDate, nextReviewAt };
}

export function calculateNextReview(
  currentReview: ReviewItem | null | undefined,
  rating: ReviewRating
): ReviewItem {
  const prevStage = currentReview?.stage || 0;
  const prevHistory = currentReview?.history || [];
  const now = Date.now();
  const todayDate = getLocalDateString(now);

  let nextStage = 1;
  let intervalDays = 1;

  if (rating === RATINGS.HARD) {
    nextStage = 1;
    intervalDays = 1;
  } else if (rating === RATINGS.MEDIUM) {
    if (prevStage === 0) {
      nextStage = 2;
      intervalDays = 3;
    } else {
      nextStage = Math.min(MAX_STAGE, prevStage + 1);
      intervalDays = STAGE_INTERVALS[nextStage] || 3;
    }
  } else if (rating === RATINGS.EASY) {
    if (prevStage === 0) {
      nextStage = 3;
      intervalDays = 7;
    } else {
      nextStage = Math.min(MAX_STAGE, prevStage + 2);
      intervalDays = STAGE_INTERVALS[nextStage] || 14;
    }
  }

  const { dueDate, nextReviewAt } = calculateNextReviewDay(now, intervalDays);

  let userTimezone = "";
  try {
    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    // fallback
  }

  const historyEntry: ReviewHistoryEntry = {
    date: now,
    localDate: todayDate,
    rating,
    stage: nextStage,
    intervalDays,
    dueDate,
  };

  return {
    taskId: currentReview?.taskId || "",
    stage: nextStage,
    intervalDays,
    lastReviewedAt: now,
    lastReviewedDate: todayDate,
    dueDate,
    nextReviewAt,
    userTimezone,
    rating,
    history: [...prevHistory, historyEntry],
  };
}

export function isTaskDue(reviewData: ReviewItem | null | undefined): boolean {
  if (!reviewData) return false;
  if (!reviewData.stage || reviewData.stage === 0) return false;

  const todayStr = getLocalDateString();

  if (reviewData.dueDate) {
    return todayStr >= reviewData.dueDate;
  }

  if (reviewData.nextReviewAt) {
    const targetDateStr = getLocalDateString(reviewData.nextReviewAt);
    const todayStart = getStartOfLocalDay().getTime();
    return (
      todayStr >= targetDateStr ||
      reviewData.nextReviewAt <= todayStart ||
      reviewData.nextReviewAt <= Date.now()
    );
  }

  return false;
}

export function formatNextReviewDate(
  nextReviewAtOrReview: number | ReviewItem | undefined,
  dueDateInput?: string
): string {
  const isObj = nextReviewAtOrReview && typeof nextReviewAtOrReview === "object";
  const nextReviewAt = isObj
    ? (nextReviewAtOrReview as ReviewItem).nextReviewAt
    : nextReviewAtOrReview;
  const dueDate = isObj ? (nextReviewAtOrReview as ReviewItem).dueDate : dueDateInput;

  if (!nextReviewAt && !dueDate) return "Не запланировано";

  const todayStr = getLocalDateString();
  const targetStr = dueDate || (nextReviewAt ? getLocalDateString(nextReviewAt as number) : "");

  if (!targetStr) return "Не запланировано";

  if (todayStr >= targetStr) {
    return "Пора повторить сегодня!";
  }

  const todayStart = getStartOfLocalDay().getTime();
  const targetDate = nextReviewAt
    ? new Date(nextReviewAt as number)
    : new Date(`${targetStr}T00:00:00`);
  const targetStart = getStartOfLocalDay(targetDate).getTime();
  const diffDays = Math.round((targetStart - todayStart) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Пора повторить сегодня!";
  if (diffDays === 1) return "Завтра";
  if (diffDays === 2) return "Через 2 дня";
  if (diffDays <= 4) return `Через ${diffDays} дня`;
  if (diffDays <= 14) return `Через ${diffDays} дней`;

  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  return `${targetDate.getDate()} ${months[targetDate.getMonth()]}`;
}

export function formatLastSolved(timestamp?: number | null): string | null {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return "Сегодня";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export interface ReviewBadgeMeta {
  isDue: boolean;
  stage: number;
  stageName: string;
  label: string;
  badgeVariant: "new" | "level" | "due" | "master";
  isMaster: boolean;
}

export function getReviewBadgeMeta(reviewData: ReviewItem | null | undefined): ReviewBadgeMeta {
  if (!reviewData || !reviewData.stage || reviewData.stage === 0) {
    return {
      isDue: false,
      stage: 0,
      stageName: STAGE_LABELS[0] || "Новая задача",
      label: "Новая",
      badgeVariant: "new",
      isMaster: false,
    };
  }

  const isDue = isTaskDue(reviewData);
  const stage = reviewData.stage || 1;
  const isMaster = stage >= MAX_STAGE;

  let label = formatNextReviewDate(reviewData.nextReviewAt, reviewData.dueDate);
  let badgeVariant: "new" | "level" | "due" | "master" = "level";

  if (isDue) {
    label = "Повтор";
    badgeVariant = "due";
  } else if (isMaster) {
    label = "Мастер";
    badgeVariant = "master";
  }

  return {
    isDue,
    stage,
    stageName: STAGE_LABELS[stage] || `Уровень ${stage}`,
    label,
    badgeVariant,
    isMaster,
  };
}

export function getGroupCompletionClass(
  tasks: { id: string | number; difficulty?: string }[],
  reviews: Record<string, ReviewItem>,
  completedTasks: Record<string, unknown>
): "completedYellow" | "completedGreen" | "" {
  if (!tasks.length) return "";
  const isAllSolved = tasks.every((t) => {
    const s = completedTasks[String(t.id)];
    return s === "solved" || s === true || s === "completed";
  });
  if (!isAllSolved) return "";

  let hardCount = 0;
  let mediumCount = 0;

  for (const t of tasks) {
    const rev = reviews[String(t.id)];
    const rating =
      rev?.rating ||
      (t.difficulty === "hard" || t.difficulty === "strong"
        ? "hard"
        : t.difficulty === "medium" || t.difficulty === "middle"
          ? "medium"
          : "easy");
    if (rating === "hard") hardCount++;
    else if (rating === "medium") mediumCount++;
  }

  const hardRatio = hardCount / tasks.length;
  const mediumRatio = mediumCount / tasks.length;
  const nonEasyRatio = (hardCount + mediumCount) / tasks.length;

  if (hardRatio >= 0.1 || mediumRatio >= 0.2 || nonEasyRatio >= 0.2) {
    return "completedYellow";
  }
  return "completedGreen";
}
