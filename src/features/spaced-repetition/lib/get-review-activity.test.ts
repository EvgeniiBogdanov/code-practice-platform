import { describe, expect, it } from "vitest";
import type { ReviewItem } from "@/entities/review";
import type { Task } from "@/entities/task/meta";
import { getReviewActivityByDate } from "./get-review-activity";

const createReview = (taskId: string, dates: string[]): ReviewItem => ({
  taskId,
  stage: 2,
  intervalDays: 3,
  lastReviewedAt: new Date(`${dates.at(-1)}T12:00:00`).getTime(),
  lastReviewedDate: dates.at(-1) ?? "",
  dueDate: "2026-09-10",
  nextReviewAt: new Date("2026-09-10T00:00:00").getTime(),
  rating: "medium",
  history: dates.map((date) => ({
    date: new Date(`${date}T12:00:00`).getTime(),
    localDate: date,
    rating: "medium",
    stage: 2,
    intervalDays: 3,
    dueDate: "2026-09-10",
  })),
});

describe("getReviewActivityByDate", () => {
  it("aggregates review history by day for target tasks only", () => {
    const reviews = {
      first: createReview("first", ["2026-09-01", "2026-09-02"]),
      second: createReview("second", ["2026-09-02"]),
      excluded: createReview("excluded", ["2026-09-02"]),
    };
    const targetTasks = [{ id: "first" }, { id: "second" }] as Task[];

    expect(getReviewActivityByDate(reviews, targetTasks)).toEqual({
      "2026-09-01": 1,
      "2026-09-02": 2,
    });
  });

  it("uses the last review date for legacy entries without history", () => {
    const legacyReview = createReview("legacy", ["2026-09-03"]);
    legacyReview.history = [];

    expect(getReviewActivityByDate({ legacy: legacyReview }, [{ id: "legacy" }] as Task[])).toEqual(
      {
        "2026-09-03": 1,
      }
    );
  });
});
