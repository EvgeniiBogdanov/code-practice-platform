import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { JAVASCRIPT_HINTS } from "./javascriptHints";

/** Basic syntax drills that intentionally have no hints. A new task must be hinted or listed here. */
const TASKS_WITHOUT_HINTS: readonly string[] = ["js1", "js2", "js3", "js4", "js6", "js8", "js9", "js10", "js11", "js12", "js13", "js189", "js190", "js191", "js192", "js193", "js194", "js195", "js_while_1", "js_while_2", "js14", "js15", "js16", "js17", "js18", "js19", "js20", "js21", "js22", "js23", "js24", "js25", "js26", "js27", "js28", "js29", "js30", "js31", "js32", "js33", "js34", "js35", "js36", "js38", "js39", "js42", "js43", "js44", "js45", "js46", "js47", "js48", "js50", "js51", "js52", "js53", "js54", "js55", "js56", "js57", "js63", "js64", "js68", "js257", "js258", "js259", "js263", "js81", "js82", "js84", "js85", "js86", "js88", "js89", "js90", "js91", "js92", "js272", "js93", "js94", "js95", "js96", "js132", "js133", "js134", "js135", "js147", "js69", "js76", "js78", "js79", "js103", "js104", "js105", "js106", "js107", "js108", "js197", "js199"];

describe("JAVASCRIPT_HINTS", () => {
  it("only describes existing JavaScript tasks", async () => {
    const taskIds = new Set((await loadTaskSection("javascript")).map((task) => String(task.id)));

    expect(Object.keys(JAVASCRIPT_HINTS).filter((id) => !taskIds.has(id))).toEqual([]);
  });

  it("hints every task except the intentional syntax drills", async () => {
    const taskIds = (await loadTaskSection("javascript")).map((task) => String(task.id));
    const unresolved = taskIds.filter(
      (id) => !(id in JAVASCRIPT_HINTS) && !TASKS_WITHOUT_HINTS.includes(id)
    );

    expect(unresolved).toEqual([]);
  });

  it("does not hint the syntax drills", () => {
    const hinted = TASKS_WITHOUT_HINTS.filter((id) => id in JAVASCRIPT_HINTS);

    expect(hinted).toEqual([]);
  });

  it("gives every task three non-empty hints without code blocks", () => {
    for (const [taskId, hints] of Object.entries(JAVASCRIPT_HINTS)) {
      expect(hints, taskId).toHaveLength(3);
      for (const hint of hints) {
        expect(hint.trim(), taskId).not.toBe("");
        expect(hint, taskId).not.toContain("```");
      }
    }
  });
});
