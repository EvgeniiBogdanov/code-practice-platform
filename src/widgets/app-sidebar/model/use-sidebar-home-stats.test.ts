import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { CURRICULUM_COUNTS } from "@/entities/task/meta";
import { useSidebarHomeStats } from "./use-sidebar-home-stats";

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

describe("useSidebarHomeStats", () => {
  beforeEach(() => {
    useProgressStore.setState({ completedTasks: {} });
    useReviewStore.setState({ excludedTaskIds: [] });
  });

  it("calculates active totals deducting excluded tasks", () => {
    const { result: before } = renderHook(() => useSidebarHomeStats());
    expect(before.current.totalJs).toBe(CURRICULUM_COUNTS.javascript);

    useReviewStore.setState({ excludedTaskIds: ["js-1", "js-2"] });
    const { result: after } = renderHook(() => useSidebarHomeStats());
    expect(after.current.totalJs).toBe(CURRICULUM_COUNTS.javascript - 2);
  });
  it("keeps the TypeScript counter separate from React TypeScript exercises", () => {
    useProgressStore.setState({
      completedTasks: { "typescript-1": "solved", "typescript-2": "solved", "ts-1": "solved" },
    });
    useReviewStore.setState({ excludedTaskIds: ["typescript-2"] });
    const { result } = renderHook(() => useSidebarHomeStats());
    expect(result.current.totalTs).toBe(23);
    expect(result.current.completedTsTotal).toBe(1);
    expect(result.current.completedReactTotal).toBe(1);
  });
});
