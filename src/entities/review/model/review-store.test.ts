import { beforeEach, describe, expect, it, vi } from "vitest";
import { useReviewStore } from "./review-store";
import { ReviewItem } from "../types";

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

describe("useReviewStore - Task Exclusion", () => {
  beforeEach(() => {
    useReviewStore.setState({
      reviews: {},
      excludedTaskIds: [],
      assistantName: "Интервальный помощник",
      isInitialized: true,
    });
  });

  it("toggles task exclusion on and off", async () => {
    expect(useReviewStore.getState().isTaskExcluded("task-1")).toBe(false);

    await useReviewStore.getState().toggleExcludeTask("task-1");
    expect(useReviewStore.getState().excludedTaskIds).toContain("task-1");
    expect(useReviewStore.getState().isTaskExcluded("task-1")).toBe(true);

    await useReviewStore.getState().toggleExcludeTask("task-1");
    expect(useReviewStore.getState().excludedTaskIds).not.toContain("task-1");
    expect(useReviewStore.getState().isTaskExcluded("task-1")).toBe(false);
  });

  it("filters out excluded tasks from getDueTasks", () => {
    const mockReview: ReviewItem = {
      taskId: "task-1",
      stage: 1,
      intervalDays: 1,
      lastReviewedAt: Date.now() - 86400000 * 2,
      lastReviewedDate: "2026-09-01",
      dueDate: "2026-09-02",
      nextReviewAt: Date.now() - 86400000,
      rating: "medium",
      history: [],
    };

    useReviewStore.setState({
      reviews: { "task-1": mockReview },
      excludedTaskIds: [],
    });

    const tasks = [{ id: "task-1" }];
    expect(useReviewStore.getState().getDueTasks(tasks).length).toBe(1);

    useReviewStore.setState({ excludedTaskIds: ["task-1"] });
    expect(useReviewStore.getState().getDueTasks(tasks).length).toBe(0);
  });

  it("excludes excluded tasks from mastery stats calculations", () => {
    const mockReview: ReviewItem = {
      taskId: "task-1",
      stage: 2,
      intervalDays: 3,
      lastReviewedAt: Date.now() - 86400000,
      lastReviewedDate: "2026-09-02",
      dueDate: "2026-09-05",
      nextReviewAt: Date.now() + 86400000 * 2,
      rating: "easy",
      history: [],
    };

    useReviewStore.setState({
      reviews: { "task-1": mockReview },
      excludedTaskIds: [],
    });

    const tasks = [{ id: "task-1" }, { id: "task-2" }];
    const statsBefore = useReviewStore.getState().getMasteryStats(tasks);
    expect(statsBefore.totalCount).toBe(2);
    expect(statsBefore.learning).toBe(1);

    useReviewStore.setState({ excludedTaskIds: ["task-1"] });
    const statsAfter = useReviewStore.getState().getMasteryStats(tasks);
    expect(statsAfter.totalCount).toBe(1);
    expect(statsAfter.learning).toBe(0);
  });
});

describe("useReviewStore - Assistant Name Customization", () => {
  beforeEach(() => {
    useReviewStore.setState({
      reviews: {},
      excludedTaskIds: [],
      assistantName: "Интервальный помощник",
      isInitialized: true,
    });
  });

  it("updates assistant name and persists it", async () => {
    expect(useReviewStore.getState().assistantName).toBe("Интервальный помощник");

    await useReviewStore.getState().setAssistantName("Джарвис");
    expect(useReviewStore.getState().assistantName).toBe("Джарвис");

    await useReviewStore.getState().setAssistantName("   ");
    expect(useReviewStore.getState().assistantName).toBe("Интервальный помощник");
  });

  it("resets assistant name back to default", async () => {
    await useReviewStore.getState().setAssistantName("Робо-Кодер");
    expect(useReviewStore.getState().assistantName).toBe("Робо-Кодер");

    await useReviewStore.getState().resetAssistantName();
    expect(useReviewStore.getState().assistantName).toBe("Интервальный помощник");
  });
});
