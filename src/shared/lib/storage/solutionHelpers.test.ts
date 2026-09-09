import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { shouldResetDueSolution } from "./solutionHelpers";
import { saveReviewsToLocalStorage } from "./reviewService";
import { saveProgressToLocalStorage } from "./progressService";

describe("solutionHelpers - shouldResetDueSolution", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("returns false for non-candidate ids or empty id", () => {
    expect(shouldResetDueSolution("")).toBe(false);
    expect(shouldResetDueSolution("sol_task_1")).toBe(false);
  });

  it("resets solution if review is due and solution was updated before or on review", () => {
    const yesterday = Date.now() - 86400000;
    saveReviewsToLocalStorage({
      "task-1": {
        taskId: "task-1",
        stage: 1,
        dueDate: "2020-01-01",
        nextReviewAt: yesterday,
        lastReviewedAt: yesterday,
      },
    });

    expect(shouldResetDueSolution("cand_task-1", yesterday)).toBe(true);
    expect(shouldResetDueSolution("cand_task-1", yesterday - 1000)).toBe(true);
    // If solution was updated AFTER review (e.g. today during review), it shouldn't reset
    expect(shouldResetDueSolution("cand_task-1", Date.now())).toBe(false);
  });

  it("resets solution on next day after task is marked unsolved", () => {
    const yesterday = Date.now() - 86400000;
    saveProgressToLocalStorage({
      "task-2": {
        status: "unsolved",
        updatedAt: yesterday,
      },
    });

    // Marked yesterday, updated yesterday -> resets
    expect(shouldResetDueSolution("cand_task-2", yesterday)).toBe(true);
    expect(shouldResetDueSolution("cand_task-2", undefined)).toBe(true);

    // Even if user typed code yesterday after marking unsolved, it resets on next day
    expect(shouldResetDueSolution("cand_task-2", yesterday + 10000)).toBe(true);

    // If new code was saved today (after being marked yesterday), don't reset
    expect(shouldResetDueSolution("cand_task-2", Date.now())).toBe(false);
  });

  it("resets solution for task IDs with underscore digits (e.g. js_while_1)", () => {
    const yesterday = Date.now() - 86400000;
    saveProgressToLocalStorage({
      js_while_1: {
        status: "unsolved",
        updatedAt: yesterday,
      },
    });

    expect(shouldResetDueSolution("cand_js_while_1", yesterday)).toBe(true);
    expect(shouldResetDueSolution("cand_js_while_1", yesterday + 5000)).toBe(true);
    expect(shouldResetDueSolution("cand_js_while_1", Date.now())).toBe(false);
  });

  it("does NOT reset solution on the same day task is marked unsolved", () => {
    const today = Date.now();
    saveProgressToLocalStorage({
      "task-3": {
        status: "unsolved",
        updatedAt: today,
      },
    });

    // Same day -> do not reset yet
    expect(shouldResetDueSolution("cand_task-3", today)).toBe(false);
    expect(shouldResetDueSolution("cand_task-3", today + 5000)).toBe(false);
  });
});
