import { describe, it, expect } from "vitest";
import { sortDueTasks, isDueTaskUnsolved } from "./sort-due-tasks";
import type { ReviewItem } from "@/entities/review";

describe("sort-due-tasks", () => {
  const mockSolvedReview: ReviewItem = {
    taskId: "task-1",
    stage: 2,
    intervalDays: 3,
    lastReviewedAt: 1000,
    lastReviewedDate: "2026-09-01",
    dueDate: "2026-09-04",
    nextReviewAt: 2000,
    rating: "medium",
    isUnsolved: false,
    history: [],
  };

  const mockUnsolvedReview: ReviewItem = {
    taskId: "task-2",
    stage: 1,
    intervalDays: 1,
    lastReviewedAt: 3000,
    lastReviewedDate: "2026-09-03",
    dueDate: "2026-09-04",
    nextReviewAt: 5000,
    rating: "hard",
    isUnsolved: true,
    history: [],
  };

  it("identifies unsolved tasks based on completedTasks status", () => {
    expect(isDueTaskUnsolved("task-1", {}, { "task-1": "unsolved" })).toBe(true);
    expect(isDueTaskUnsolved("task-1", {}, { "task-1": "solved" })).toBe(false);
  });

  it("falls back to review.isUnsolved if not found in completedTasks", () => {
    expect(isDueTaskUnsolved("task-2", { "task-2": mockUnsolvedReview }, {})).toBe(true);
    expect(isDueTaskUnsolved("task-1", { "task-1": mockSolvedReview }, {})).toBe(false);
  });

  it("sorts unsolved tasks ahead of solved tasks regardless of nextReviewAt", () => {
    const tasks = [{ id: "task-1" }, { id: "task-2" }];
    const reviews = {
      "task-1": mockSolvedReview, // nextReviewAt: 2000
      "task-2": mockUnsolvedReview, // nextReviewAt: 5000 (later)
    };
    const completedTasks = {
      "task-1": "solved",
      "task-2": "unsolved",
    };

    const sorted = sortDueTasks(tasks, reviews, completedTasks);

    expect(sorted[0].id).toBe("task-2");
    expect(sorted[1].id).toBe("task-1");
  });

  it("orders by nextReviewAt within the same group (e.g. multiple unsolved tasks)", () => {
    const unsolvedA: ReviewItem = {
      ...mockUnsolvedReview,
      taskId: "task-unsolved-a",
      nextReviewAt: 1000,
    };
    const unsolvedB: ReviewItem = {
      ...mockUnsolvedReview,
      taskId: "task-unsolved-b",
      nextReviewAt: 500,
    };

    const tasks = [{ id: "task-unsolved-a" }, { id: "task-unsolved-b" }];
    const reviews = {
      "task-unsolved-a": unsolvedA,
      "task-unsolved-b": unsolvedB,
    };
    const completedTasks = {
      "task-unsolved-a": "unsolved",
      "task-unsolved-b": "unsolved",
    };

    const sorted = sortDueTasks(tasks, reviews, completedTasks);

    expect(sorted[0].id).toBe("task-unsolved-b");
    expect(sorted[1].id).toBe("task-unsolved-a");
  });
});
