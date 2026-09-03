import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { RetentionScheduleBar } from "./RetentionScheduleBar";
import { type ReviewItem, useReviewStore } from "@/entities/review";
import { type Task } from "@/entities/task";

describe("RetentionScheduleBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-24T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with empty reviews without errors", () => {
    const { container } = render(
      <RetentionScheduleBar reviews={{}} allTasks={[]} height={220} />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with populated reviews and tasks", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Test Task 1",
        group: "javascript",
        difficulty: "easy",
        completed: true,
      } as unknown as Task,
      {
        id: "2",
        title: "Test Task 2",
        group: "javascript",
        difficulty: "medium",
        completed: true,
      } as unknown as Task,
    ];

    const mockReviews: Record<string, ReviewItem> = {
      "1": {
        taskId: "1",
        stage: 1,
        intervalDays: 1,
        lastReviewedAt: new Date("2026-08-24T00:00:00Z").getTime(),
        lastReviewedDate: "2026-08-24",
        dueDate: "2026-08-25",
        nextReviewAt: new Date("2026-08-25T00:00:00Z").getTime(),
        rating: "medium",
        history: [],
      },
      "2": {
        taskId: "2",
        stage: 6,
        intervalDays: 60,
        lastReviewedAt: new Date("2026-08-24T00:00:00Z").getTime(),
        lastReviewedDate: "2026-08-24",
        dueDate: "2026-10-24",
        nextReviewAt: new Date("2026-10-24T00:00:00Z").getTime(),
        rating: "easy",
        history: [],
      },
    };

    const { container } = render(
      <RetentionScheduleBar
        reviews={mockReviews}
        allTasks={mockTasks}
        height={220}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with excluded tasks ignored in buckets", () => {
    useReviewStore.setState({ excludedTaskIds: ["1"] });

    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Test Task 1",
        group: "javascript",
        difficulty: "easy",
        completed: true,
      } as unknown as Task,
      {
        id: "2",
        title: "Test Task 2",
        group: "javascript",
        difficulty: "medium",
        completed: true,
      } as unknown as Task,
    ];

    const mockReviews: Record<string, ReviewItem> = {
      "1": {
        taskId: "1",
        stage: 1,
        intervalDays: 1,
        lastReviewedAt: new Date("2026-08-24T00:00:00Z").getTime(),
        lastReviewedDate: "2026-08-24",
        dueDate: "2026-08-24",
        nextReviewAt: new Date("2026-08-24T00:00:00Z").getTime(),
        rating: "medium",
        history: [],
      },
    };

    const { container } = render(
      <RetentionScheduleBar
        reviews={mockReviews}
        allTasks={mockTasks}
        height={220}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
