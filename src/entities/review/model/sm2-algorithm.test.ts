import { describe, it, expect } from "vitest";
import {
  calculateNextReview,
  isTaskDue,
  getLocalDateString,
  calculateNextReviewDay,
  formatNextReviewDate,
  RATINGS,
  MAX_STAGE,
  STAGE_INTERVALS,
} from "./sm2-algorithm";
import { ReviewItem } from "../types";

describe("sm2-algorithm", () => {
  it("should format date string correctly", () => {
    const d = new Date(2026, 0, 15);
    expect(getLocalDateString(d)).toBe("2026-01-15");
  });

  it("should calculate next review day with interval", () => {
    const d = new Date(2026, 0, 1);
    const res = calculateNextReviewDay(d, 3);
    expect(res.dueDate).toBe("2026-01-04");
    expect(typeof res.nextReviewAt).toBe("number");
  });

  it("should initialize first review on HARD rating", () => {
    const item = calculateNextReview(null, RATINGS.HARD);
    expect(item.stage).toBe(1);
    expect(item.intervalDays).toBe(1);
    expect(item.rating).toBe("hard");
    expect(item.history.length).toBe(1);
  });

  it("should initialize first review on MEDIUM rating with stage 2", () => {
    const item = calculateNextReview(null, RATINGS.MEDIUM);
    expect(item.stage).toBe(2);
    expect(item.intervalDays).toBe(3);
    expect(item.rating).toBe("medium");
  });

  it("should initialize first review on EASY rating with stage 3", () => {
    const item = calculateNextReview(null, RATINGS.EASY);
    expect(item.stage).toBe(3);
    expect(item.intervalDays).toBe(7);
    expect(item.rating).toBe("easy");
  });

  it("should advance stage and increase interval on repeated success", () => {
    const first = calculateNextReview(null, RATINGS.MEDIUM);
    expect(first.stage).toBe(2);

    const second = calculateNextReview(first, RATINGS.MEDIUM);
    expect(second.stage).toBe(3);
    expect(second.intervalDays).toBe(STAGE_INTERVALS[3]);

    const third = calculateNextReview(second, RATINGS.EASY);
    expect(third.stage).toBe(5);
    expect(third.intervalDays).toBe(STAGE_INTERVALS[5]);
  });

  it("should cap stage at MAX_STAGE", () => {
    const mockItem: ReviewItem = {
      taskId: "task-1",
      stage: 5,
      intervalDays: 30,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2026-01-01",
      dueDate: "2026-01-31",
      nextReviewAt: Date.now() + 86400000 * 30,
      rating: "easy",
      history: [],
    };

    const next = calculateNextReview(mockItem, RATINGS.EASY);
    expect(next.stage).toBe(MAX_STAGE);
    expect(next.intervalDays).toBe(STAGE_INTERVALS[MAX_STAGE]);
  });

  it("should identify when a task is due", () => {
    const pastItem: ReviewItem = {
      taskId: "1",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now() - 86400000 * 2,
      lastReviewedDate: "2020-01-01",
      dueDate: "2020-01-02",
      nextReviewAt: Date.now() - 86400000 * 2,
      rating: "medium",
      history: [],
    };
    expect(isTaskDue(pastItem)).toBe(true);

    const futureItem: ReviewItem = {
      taskId: "2",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2099-01-01",
      dueDate: "2099-01-02",
      nextReviewAt: Date.now() + 86400000 * 30,
      rating: "medium",
      history: [],
    };
    expect(isTaskDue(futureItem)).toBe(false);
  });

  it("should format next review date correctly", () => {
    expect(formatNextReviewDate(undefined, undefined)).toBe("Не запланировано");
    expect(formatNextReviewDate(Date.now() - 1000)).toBe("Пора повторить сегодня!");
  });
});
