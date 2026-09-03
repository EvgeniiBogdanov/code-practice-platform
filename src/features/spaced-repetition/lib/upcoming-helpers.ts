import { ReviewItem, isTaskDue } from "@/entities/review";
import { Task } from "@/entities/task";

export interface UpcomingTaskItem {
  task: Task;
  review: ReviewItem;
  nextReviewAt: number;
  dueDate: string;
  daysUntil: number;
  isDue: boolean;
  stage: number;
  intervalDays: number;
  formattedDate: string;
  relativeTime: string;
}

export function getDaysUntil(dueDateOrTimestamp: string | number): number {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let target: Date;
  if (typeof dueDateOrTimestamp === "number") {
    target = new Date(dueDateOrTimestamp);
  } else if (dueDateOrTimestamp.includes("T")) {
    target = new Date(dueDateOrTimestamp);
  } else {
    const [year, month, day] = dueDateOrTimestamp.split("-").map(Number);
    target = new Date(year, (month || 1) - 1, day || 1);
  }
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatUpcomingRelativeTime(daysUntil: number, isDue: boolean): string {
  if (isDue || daysUntil <= 0) {
    if (daysUntil === 0) {
      return "Пора повторить (сегодня)";
    }
    const overdue = Math.abs(daysUntil);
    if (overdue === 1) return "Просрочено на 1 день";
    if (overdue >= 2 && overdue <= 4) return `Просрочено на ${overdue} дня`;
    return `Просрочено на ${overdue} дней`;
  }

  if (daysUntil === 1) return "Завтра";
  if (daysUntil === 2) return "Послезавтра";
  if (daysUntil >= 3 && daysUntil <= 4) return `Через ${daysUntil} дня`;
  return `Через ${daysUntil} дней`;
}

export function formatUpcomingDate(dueDateOrTimestamp: string | number): string {
  let d: Date;
  if (typeof dueDateOrTimestamp === "number") {
    d = new Date(dueDateOrTimestamp);
  } else if (dueDateOrTimestamp.includes("T")) {
    d = new Date(dueDateOrTimestamp);
  } else {
    const [year, month, day] = dueDateOrTimestamp.split("-").map(Number);
    d = new Date(year, (month || 1) - 1, day || 1);
  }

  if (Number.isNaN(d.getTime())) return "";

  try {
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      weekday: "short",
    });
  } catch {
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }
}

export function getUpcomingTasks(
  targetTasks: Task[],
  reviews: Record<string, ReviewItem>,
  excludedTaskIds: readonly string[] = []
): UpcomingTaskItem[] {
  if (!targetTasks || !reviews) return [];

  const excludedSet = new Set(excludedTaskIds.map(String));
  const items: UpcomingTaskItem[] = [];

  for (const task of targetTasks) {
    if (excludedSet.has(String(task.id))) continue;
    const rev = reviews[String(task.id)];
    if (rev && rev.stage > 0 && (rev.nextReviewAt || rev.dueDate)) {
      if (isTaskDue(rev)) {
        continue;
      }

      const nextReviewAt =
        rev.nextReviewAt ||
        (rev.dueDate ? new Date(`${rev.dueDate}T00:00:00`).getTime() : 0);
      const daysUntil = getDaysUntil(rev.dueDate || nextReviewAt);
      if (daysUntil <= 0) {
        continue;
      }

      const isDue = false;
      const relativeTime = formatUpcomingRelativeTime(daysUntil, isDue);
      const formattedDate = formatUpcomingDate(rev.dueDate || nextReviewAt);

      items.push({
        task,
        review: rev,
        nextReviewAt,
        dueDate: rev.dueDate,
        daysUntil,
        isDue,
        stage: rev.stage,
        intervalDays: rev.intervalDays || 1,
        formattedDate,
        relativeTime,
      });
    }
  }

  // Sort from closest/earliest due date to furthest in the future
  items.sort((a, b) => a.nextReviewAt - b.nextReviewAt);

  return items;
}
