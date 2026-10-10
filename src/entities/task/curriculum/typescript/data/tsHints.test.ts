import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { TS_HINTS } from "./tsHints";

describe("TS_HINTS", () => {
  it("covers every TypeScript task and nothing else", async () => {
    const tasks = await loadTaskSection("typescript");
    const taskIds = tasks.map((task) => String(task.id)).sort();

    expect(Object.keys(TS_HINTS).sort()).toEqual(taskIds);
  });

  it("names only the types the reference solution declares", async () => {
    const tasks = await loadTaskSection("typescript");
    for (const task of tasks) {
      const solution = task.rawSolution ?? "";
      const named = TS_HINTS[String(task.id)].flatMap((hint) =>
        [...hint.matchAll(/`(?:type|interface|class) (\w+)/g)].map(([, name]) => name)
      );
      for (const name of named) {
        expect(solution, `${task.id}: ${name}`).toMatch(
          new RegExp(`\\b(?:type|interface|class) ${name}\\b`)
        );
      }
    }
  });

  it("gives every task three non-empty hints without code blocks", () => {
    for (const [taskId, hints] of Object.entries(TS_HINTS)) {
      expect(hints, taskId).toHaveLength(3);
      for (const hint of hints) {
        expect(hint.trim(), taskId).not.toBe("");
        expect(hint, taskId).not.toContain("```");
      }
    }
  });
});
