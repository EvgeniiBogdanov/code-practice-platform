import { describe, it, expect } from "vitest";
import { isCandidateLinterDisabled, CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS } from "./task-syntax-check";
import { Task } from "../types";

describe("task-syntax-check", () => {
  it("contains specified task IDs", () => {
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has("js188")).toBe(true);
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has("js127")).toBe(true);
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has("js128")).toBe(true);
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has("js73")).toBe(true);
    expect(CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has("js74")).toBe(true);
  });

  it("returns true for tasks in CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS", () => {
    const task188 = { id: "js188", title: "Test", section: "javascript" } as Task;
    const task127 = { id: "js127", title: "Test", section: "javascript" } as Task;
    const task128 = { id: "js128", title: "Test", section: "javascript" } as Task;
    const task73 = { id: "js73", title: "Test", section: "javascript" } as Task;
    const task74 = { id: "js74", title: "Test", section: "javascript" } as Task;

    expect(isCandidateLinterDisabled(task188)).toBe(true);
    expect(isCandidateLinterDisabled(task127)).toBe(true);
    expect(isCandidateLinterDisabled(task128)).toBe(true);
    expect(isCandidateLinterDisabled(task73)).toBe(true);
    expect(isCandidateLinterDisabled(task74)).toBe(true);
  });

  it("returns true when disableCandidateLinter flag is explicitly set", () => {
    const taskCustom = {
      id: "custom-task",
      title: "Custom",
      section: "javascript",
      disableCandidateLinter: true,
    } as Task;

    expect(isCandidateLinterDisabled(taskCustom)).toBe(true);
  });

  it("returns false for tasks with syntax checking enabled", () => {
    const taskOther = { id: "js1", title: "Test", section: "javascript" } as Task;
    expect(isCandidateLinterDisabled(taskOther)).toBe(false);
    expect(isCandidateLinterDisabled(null)).toBe(false);
    expect(isCandidateLinterDisabled(undefined)).toBe(false);
  });
});
