import { describe, it, expect } from "vitest";
import {
  isCandidateLinterDisabled,
  CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS,
} from "./task-syntax-check";
import { Task } from "../types";

describe("task-syntax-check", () => {
  it("defaults to empty set of disabled task IDs", () => {
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.size).toBe(0);
  });

  it("returns false for tasks by default", () => {
    const task188 = { id: "js188", title: "Test", section: "javascript" } as Task;
    const task128 = { id: "js128", title: "Test", section: "javascript" } as Task;
    const taskTs = { id: "typescript-1", title: "Test", section: "typescript" } as Task;
    const taskOther = { id: "js1", title: "Test", section: "javascript" } as Task;

    expect(isCandidateLinterDisabled(task188)).toBe(false);
    expect(isCandidateLinterDisabled(task128)).toBe(false);
    expect(isCandidateLinterDisabled(taskTs)).toBe(false);
    expect(isCandidateLinterDisabled(taskOther)).toBe(false);
    expect(isCandidateLinterDisabled(null)).toBe(false);
    expect(isCandidateLinterDisabled(undefined)).toBe(false);
  });
});
