import { describe, it, expect } from "vitest";
import {
  selectDailyTaskStats,
  selectIsTaskCompleted,
  selectTaskStatus,
  selectSectionStats,
} from "./progress-selectors";
import { ProgressState } from "../types";

describe("progress-selectors", () => {
  const mockState: ProgressState = {
    completedTasks: {
      "1": "solved",
      "2": "unsolved",
    },
    taskStatusTimestamps: {},
    checklistState: {},
    copiedCodeId: null,
    isInitialized: true,
    initProgress: async () => {},
    setTaskStatus: async () => {},
    toggleChecklistItem: async () => {},
    handleCopyCode: () => {},
    handleFullReset: async () => {},
  };

  it("selectIsTaskCompleted should return true only for solved tasks", () => {
    expect(selectIsTaskCompleted(mockState, "1")).toBe(true);
    expect(selectIsTaskCompleted(mockState, "2")).toBe(false);
    expect(selectIsTaskCompleted(mockState, "3")).toBe(false);
  });

  it("selectTaskStatus should return exact status string", () => {
    expect(selectTaskStatus(mockState, "1")).toBe("solved");
    expect(selectTaskStatus(mockState, "2")).toBe("unsolved");
    expect(selectTaskStatus(mockState, "3")).toBe("unstarted");
  });

  it("selectSectionStats should calculate correct percentage and totals", () => {
    const tasks = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
    const stats = selectSectionStats(mockState, tasks);
    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(1);
    expect(stats.percentage).toBe(25);
  });

  it("selectSectionStats should handle empty task array gracefully", () => {
    const stats = selectSectionStats(mockState, []);
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.percentage).toBe(0);
  });

  it("selectDailyTaskStats counts statuses changed during the current local day", () => {
    const now = new Date(2026, 8, 7, 12).getTime();
    const state: ProgressState = {
      ...mockState,
      completedTasks: {
        todaySolved: "solved",
        todayUnsolved: "unsolved",
        yesterdaySolved: "solved",
        tomorrowUnsolved: "unsolved",
        missingTimestamp: "solved",
      },
      taskStatusTimestamps: {
        todaySolved: new Date(2026, 8, 7, 0).getTime(),
        todayUnsolved: new Date(2026, 8, 7, 23, 59, 59).getTime(),
        yesterdaySolved: new Date(2026, 8, 6, 23, 59, 59).getTime(),
        tomorrowUnsolved: new Date(2026, 8, 8, 0).getTime(),
      },
    };
    const tasks = Object.keys(state.completedTasks).map((id) => ({ id }));

    expect(selectDailyTaskStats(state, tasks, now)).toEqual({ solved: 1, unsolved: 1 });
  });

  it("selectDailyTaskStats only counts tasks from the provided scope", () => {
    const now = new Date(2026, 8, 7, 12).getTime();
    const state: ProgressState = {
      ...mockState,
      completedTasks: { included: "solved", excluded: "unsolved" },
      taskStatusTimestamps: { included: now, excluded: now },
    };

    expect(selectDailyTaskStats(state, [{ id: "included" }], now)).toEqual({
      solved: 1,
      unsolved: 0,
    });
  });
});
