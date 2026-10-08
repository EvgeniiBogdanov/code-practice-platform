import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { REACT_HINTS } from "./reactHints";

/** Hook-syntax and trivial warm-ups that intentionally have no hints. A new task must be hinted or listed here. */
const TASKS_WITHOUT_HINTS: readonly string[] = ["w1", "w13", "w15", "w22", "w18", "w20", "w5", "w2", "w3", "w9", "w10", "w11", "w14", "w23"];

describe("REACT_HINTS", () => {
  it("only describes existing React tasks", async () => {
    const taskIds = new Set((await loadTaskSection("react")).map((task) => String(task.id)));

    expect(Object.keys(REACT_HINTS).filter((id) => !taskIds.has(id))).toEqual([]);
  });

  it("hints every task except the intentional syntax drills", async () => {
    const taskIds = (await loadTaskSection("react")).map((task) => String(task.id));
    const unresolved = taskIds.filter(
      (id) => !(id in REACT_HINTS) && !TASKS_WITHOUT_HINTS.includes(id)
    );

    expect(unresolved).toEqual([]);
  });

  it("does not hint the syntax drills", () => {
    expect(TASKS_WITHOUT_HINTS.filter((id) => id in REACT_HINTS)).toEqual([]);
  });

  it("gives every task three non-empty hints without code blocks", () => {
    for (const [taskId, hints] of Object.entries(REACT_HINTS)) {
      expect(hints, taskId).toHaveLength(3);
      for (const hint of hints) {
        expect(hint.trim(), taskId).not.toBe("");
        expect(hint, taskId).not.toContain("```");
      }
    }
  });
});
