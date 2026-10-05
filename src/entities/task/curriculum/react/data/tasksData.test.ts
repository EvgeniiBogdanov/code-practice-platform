import { describe, expect, it } from "vitest";
import {
  ADVANCED_TASKS,
  LIFECYCLE_TASKS,
  MAIN_TASKS,
  REACT_TASKS,
  REACT_TS_PRACTICE_TASKS,
  REACT_TS_TASKS,
  REFACTORING_TASKS,
  WARMUP_TASKS,
} from "./tasksData";

const LEVELS = ["junior", "middle", "senior"];

const LEVELED_GROUPS = {
  MAIN_TASKS,
  ADVANCED_TASKS,
  LIFECYCLE_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
};

describe("React tasks data", () => {
  it("keeps task ids unique", () => {
    const ids = REACT_TASKS.map((task) => String(task.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(Object.entries(LEVELED_GROUPS))(
    "%s: every task has a level and levels never decrease",
    (_, tasks) => {
      const levels = tasks.map((task) => LEVELS.indexOf(String(task.difficulty)));
      expect(levels).not.toContain(-1);
      expect(levels).toEqual([...levels].sort((a, b) => a - b));
    }
  );

  it.each(Object.entries({ WARMUP_TASKS, REFACTORING_TASKS, ...LEVELED_GROUPS }))(
    "%s: titles are numbered in order",
    (_, tasks) => {
      tasks.forEach((task, index) => {
        expect(task.title).toMatch(new RegExp(`^${index + 1}\\. `));
      });
    }
  );
});
