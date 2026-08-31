import { describe, expect, it } from "vitest";
import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";
import { getTaskRowTone } from "./task-row-tone";

const task = (difficulty: Task["difficulty"]): Task => ({
  id: "task-1",
  title: "Task",
  section: "javascript",
  difficulty,
});

const review = (rating: ReviewItem["rating"]): ReviewItem => ({
  taskId: "task-1",
  stage: 1,
  intervalDays: 1,
  lastReviewedAt: 1,
  lastReviewedDate: "2026-08-31",
  dueDate: "2026-09-01",
  nextReviewAt: 2,
  rating,
  history: [],
});

describe("getTaskRowTone", () => {
  it("prioritizes an unsolved status", () => {
    expect(getTaskRowTone(task("easy"), "unsolved", review("easy"))).toBe("unsolved");
  });

  it("uses the latest solution rating for solved tasks", () => {
    expect(getTaskRowTone(task("easy"), "solved", review("hard"))).toBe("hard");
  });

  it("falls back to task difficulty and leaves new tasks neutral", () => {
    expect(getTaskRowTone(task("middle"), "solved")).toBe("medium");
    expect(getTaskRowTone(task("hard"), "unstarted")).toBe("default");
  });
});
