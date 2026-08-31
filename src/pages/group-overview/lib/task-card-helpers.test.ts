import { describe, it, expect } from "vitest";
import { calculateReadingTime, getTaskGradientClass, getTaskTooltipTitle } from "./task-card-helpers";
import { Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import styles from "../ui/GroupOverviewPage.module.css";

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

  it("getTaskGradientClass should return correct class for unsolved, unstarted and solved with ratings", () => {
    const easyTask: Task = { id: "1", title: "Task 1", section: "javascript", difficulty: "easy" };
    const hardTask: Task = { id: "2", title: "Task 2", section: "javascript", difficulty: "hard" };
    const mediumTask: Task = { id: "3", title: "Task 3", section: "javascript", difficulty: "medium" };

    expect(getTaskGradientClass(easyTask, "unstarted", null)).toBe("");
    expect(getTaskGradientClass(easyTask, "unsolved", null)).toBe(styles.ratingGradientUnsolved);
    expect(getTaskGradientClass(easyTask, "solved", null)).toBe(styles.ratingGradientEasy);
    expect(getTaskGradientClass(hardTask, "solved", null)).toBe(styles.ratingGradientHard);
    expect(getTaskGradientClass(mediumTask, "solved", null)).toBe(styles.ratingGradientMedium);

    const overrideReview: ReviewItem = {
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

    expect(getTaskGradientClass(easyTask, "solved", overrideReview)).toBe(styles.ratingGradientHard);
  });
});
