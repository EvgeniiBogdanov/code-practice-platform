import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { TS_HINTS } from "./tsHints";

describe("TS_HINTS", () => {
  it("covers every TypeScript task and nothing else", async () => {
    const tasks = await loadTaskSection("typescript");
    const taskIds = tasks.map((task) => String(task.id)).sort();

    expect(Object.keys(TS_HINTS).sort()).toEqual(taskIds);
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
