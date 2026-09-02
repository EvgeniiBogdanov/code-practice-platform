import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { CURRICULUM_COUNTS } from "@/entities/task/meta";
import { useHomeStats } from "./use-home-stats";

vi.mock("@/shared/lib/storage", () => ({
  getAllReviewsFromDB: vi.fn().mockResolvedValue({}),
  getReviewsFromLocalStorage: vi.fn().mockReturnValue({}),
  saveReviewToDB: vi.fn().mockResolvedValue(undefined),
  deleteReviewFromDB: vi.fn().mockResolvedValue(undefined),
  deleteReviewsForTasksFromDB: vi.fn().mockResolvedValue(undefined),
  clearAllReviewsFromDB: vi.fn().mockResolvedValue(undefined),
  getExcludedTasksFromDB: vi.fn().mockResolvedValue([]),
  saveExcludedTasksToDB: vi.fn().mockResolvedValue(undefined),
  getExcludedTasksFromLocalStorage: vi.fn().mockReturnValue([]),
  getAssistantNameFromDB: vi.fn().mockResolvedValue("Интервальный помощник"),
  saveAssistantNameToDB: vi.fn().mockResolvedValue(undefined),
  clearAssistantNameFromDB: vi.fn().mockResolvedValue(undefined),
  getAssistantNameFromLocalStorage: vi.fn().mockReturnValue("Интервальный помощник"),
  DEFAULT_ASSISTANT_NAME: "Интервальный помощник",
  broadcastSyncEvent: vi.fn(),
  subscribeToSyncEvents: vi.fn(),
}));

describe("useHomeStats - excluded tasks deduction", () => {
  beforeEach(() => {
    useProgressStore.setState({ completedTasks: {} });
    useReviewStore.setState({ excludedTaskIds: [] });
  });

  it("calculates default totals matching curriculum counts when no tasks are excluded", () => {
    const { result } = renderHook(() => useHomeStats());

    expect(result.current.jsTotal).toBe(CURRICULUM_COUNTS.javascript);
    expect(result.current.reactTotal).toBe(CURRICULUM_COUNTS.react);
    expect(result.current.algoTotal).toBe(CURRICULUM_COUNTS.algorithms);
    expect(result.current.grandTotal).toBe(
      CURRICULUM_COUNTS.javascript + CURRICULUM_COUNTS.react + CURRICULUM_COUNTS.algorithms
    );
  });

  it("deducts excluded tasks from section and grand totals", () => {
    useReviewStore.setState({
      excludedTaskIds: ["js-1", "react-1", "algo-1"],
    });

    const { result } = renderHook(() => useHomeStats());

    expect(result.current.jsTotal).toBe(CURRICULUM_COUNTS.javascript - 1);
    expect(result.current.reactTotal).toBe(CURRICULUM_COUNTS.react - 1);
    expect(result.current.algoTotal).toBe(CURRICULUM_COUNTS.algorithms - 1);
    expect(result.current.grandTotal).toBe(
      CURRICULUM_COUNTS.javascript + CURRICULUM_COUNTS.react + CURRICULUM_COUNTS.algorithms - 3
    );
    expect(result.current.grandExcluded).toBe(3);
  });

  it("ignores solved state of excluded tasks in solved counts", () => {
    useProgressStore.setState({
      completedTasks: {
        "js-1": "solved",
        "js-2": "solved",
      },
    });

    const { result: beforeExclusion } = renderHook(() => useHomeStats());
    expect(beforeExclusion.current.jsSolved).toBe(2);

    useReviewStore.setState({
      excludedTaskIds: ["js-1"],
    });

    const { result: afterExclusion } = renderHook(() => useHomeStats());
    expect(afterExclusion.current.jsSolved).toBe(1);
    expect(afterExclusion.current.jsTotal).toBe(CURRICULUM_COUNTS.javascript - 1);
  });
});
