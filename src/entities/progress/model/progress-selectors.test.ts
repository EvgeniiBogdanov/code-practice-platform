import { describe, it, expect } from "vitest";
import {
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
});
