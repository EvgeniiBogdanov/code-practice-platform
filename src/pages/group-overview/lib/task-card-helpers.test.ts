import { describe, it, expect } from "vitest";
import {
  calculateReadingTime,
  getTaskTooltipTitle,
} from "./task-card-helpers";
import { Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";

describe("task-card-helpers", () => {
  it("calculateReadingTime should compute minutes accurately", () => {
    expect(calculateReadingTime("")).toBe(5);
    const shortText = "Word ".repeat(280);
    expect(calculateReadingTime(shortText)).toBe(2);
  });

  it("getTaskTooltipTitle should format titles based on task status and review", () => {
    const mockTask: Task = {
      id: "1",
      title: "Reverse String",
      section: "javascript",
      difficulty: "easy",
    };

    expect(getTaskTooltipTitle(mockTask, "unstarted", null)).toBe(
      "Reverse String • Статус: Не начато"
    );

    expect(getTaskTooltipTitle(mockTask, "unsolved", null)).toBe(
      "Reverse String • Статус: Не решено"
    );

    const review: ReviewItem = {
      taskId: "1",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2026-01-01",
      dueDate: "2026-01-02",
      nextReviewAt: Date.now(),
      rating: "hard",
      history: [],
    };

    expect(getTaskTooltipTitle(mockTask, "solved", review)).toBe(
      "Reverse String • Оценка сложности: Сложно"
    );
  });
});
