import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDaysUntil,
  formatUpcomingRelativeTime,
  formatUpcomingDate,
  getUpcomingTasks,
} from "./upcoming-helpers";
import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";

describe("upcoming-helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 2026-08-24 12:00:00 local time
    vi.setSystemTime(new Date(2026, 7, 24, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates daysUntil correctly for today, tomorrow, and future dates", () => {
    expect(getDaysUntil("2026-08-24")).toBe(0);
    expect(getDaysUntil("2026-08-25")).toBe(1);
    expect(getDaysUntil("2026-08-27")).toBe(3);
    expect(getDaysUntil("2026-08-20")).toBe(-4);
  });

  it("formats relative time correctly", () => {
    expect(formatUpcomingRelativeTime(0, true)).toBe("Пора повторить (сегодня)");
    expect(formatUpcomingRelativeTime(-1, true)).toBe("Просрочено на 1 день");
    expect(formatUpcomingRelativeTime(-3, true)).toBe("Просрочено на 3 дня");
    expect(formatUpcomingRelativeTime(-5, true)).toBe("Просрочено на 5 дней");
    expect(formatUpcomingRelativeTime(1, false)).toBe("Завтра");
    expect(formatUpcomingRelativeTime(2, false)).toBe("Послезавтра");
    expect(formatUpcomingRelativeTime(4, false)).toBe("Через 4 дня");
    expect(formatUpcomingRelativeTime(10, false)).toBe("Через 10 дней");
  });

  it("formats date in Russian locale", () => {
    const formatted = formatUpcomingDate("2026-08-25");
    expect(formatted).toContain("25");
    expect(formatted.toLowerCase()).toContain("авг");
  });

  it("gets and sorts upcoming tasks from nearest to furthest", () => {
    const tasks: Task[] = [
      { id: "task1", title: "Task 1", section: "javascript" } as Task,
      { id: "task2", title: "Task 2", section: "react" } as Task,
      { id: "task3", title: "Task 3", section: "algorithms" } as Task,
      { id: "task4", title: "Unreviewed Task", section: "javascript" } as Task,
    ];

    const reviews: Record<string, ReviewItem> = {
      task1: {
        taskId: "task1",
        stage: 2,
        intervalDays: 3,
        dueDate: "2026-08-27",
        nextReviewAt: new Date(2026, 7, 27).getTime(),
      } as ReviewItem,
      task2: {
        taskId: "task2",
        stage: 1,
        intervalDays: 1,
        dueDate: "2026-08-24", // today
        nextReviewAt: new Date(2026, 7, 24).getTime(),
      } as ReviewItem,
      task3: {
        taskId: "task3",
        stage: 5,
        intervalDays: 30,
        dueDate: "2026-09-24",
        nextReviewAt: new Date(2026, 8, 24).getTime(),
      } as ReviewItem,
    };

    const result = getUpcomingTasks(tasks, reviews);

    expect(result).toHaveLength(3);
    // Nearest first
    expect(result[0].task.id).toBe("task2");
    expect(result[0].daysUntil).toBe(0);
    // Middle
    expect(result[1].task.id).toBe("task1");
    expect(result[1].daysUntil).toBe(3);
    // Furthest last
    expect(result[2].task.id).toBe("task3");
    expect(result[2].daysUntil).toBe(31);
  });
});
