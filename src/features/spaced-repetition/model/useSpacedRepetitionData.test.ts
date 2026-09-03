import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSpacedRepetitionData } from "./useSpacedRepetitionData";
import { useReviewStore, ReviewItem } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { Task } from "@/entities/task";

describe("useSpacedRepetitionData - task exclusion", () => {
  const mockTasks: Task[] = [
    {
      id: "t1",
      title: "Task 1",
      section: "javascript",
      group: "basics",
      difficulty: "easy",
    } as unknown as Task,
    {
      id: "t2",
      title: "Task 2",
      section: "javascript",
      group: "basics",
      difficulty: "medium",
    } as unknown as Task,
  ];

  const mockReviews: Record<string, ReviewItem> = {
    t1: {
      taskId: "t1",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now() - 86400000 * 2,
      lastReviewedDate: "2026-09-01",
      dueDate: "2026-09-02",
      nextReviewAt: Date.now() - 86400000,
      rating: "medium",
      history: [],
    },
    t2: {
      taskId: "t2",
      stage: 1,
      intervalDays: 3,
      lastReviewedAt: Date.now(),
      lastReviewedDate: "2026-09-03",
      dueDate: "2026-09-06",
      nextReviewAt: Date.now() + 86400000 * 3,
      rating: "easy",
      history: [],
    },
  };

  beforeEach(() => {
    useReviewStore.setState({
      reviews: mockReviews,
      excludedTaskIds: [],
      isInitialized: true,
    });
    useProgressStore.setState({
      completedTasks: { t1: "unsolved", t2: "solved" },
    });
  });

  it("includes all tasks when not excluded", () => {
    const { result } = renderHook(() =>
      useSpacedRepetitionData({ taskList: mockTasks, sectionName: "JavaScript" })
    );

    expect(result.current.targetTasks.length).toBe(2);
    expect(result.current.dueTasks.length).toBe(1);
    expect(result.current.dueTasks[0].id).toBe("t1");
    expect(result.current.unsolvedTasks.length).toBe(1);
    expect(result.current.unsolvedTasks[0].id).toBe("t1");
    expect(result.current.upcomingTasks.length).toBe(1);
    expect(result.current.upcomingTasks[0].task.id).toBe("t2");
  });

  it("completely excludes task from due, unsolved, upcoming and targetTasks when excluded", () => {
    useReviewStore.setState({ excludedTaskIds: ["t1", "t2"] });

    const { result } = renderHook(() =>
      useSpacedRepetitionData({ taskList: mockTasks, sectionName: "JavaScript" })
    );

    expect(result.current.targetTasks.length).toBe(0);
    expect(result.current.dueTasks.length).toBe(0);
    expect(result.current.unsolvedTasks.length).toBe(0);
    expect(result.current.upcomingTasks.length).toBe(0);
    expect(result.current.masteryStats.totalCount).toBe(0);
    expect(result.current.masteryStats.dueToday).toBe(0);
  });
});
