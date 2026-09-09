import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { groupAlgoTasks } from "./group-algo-tasks";

describe("groupAlgoTasks", () => {
  it("places Hash Map as the very first group in algorithms", async () => {
    const algoTasks = await loadTaskSection("algorithms");
    const { groupedTasks, groupMetaMap } = groupAlgoTasks(algoTasks);

    const groupKeys = Object.keys(groupedTasks);
    expect(groupKeys[0]).toBe("Hash Map");
    expect(groupKeys[1]).toBe("Two Pointers");

    expect(groupMetaMap["Hash Map"]).toBeDefined();
    expect(groupMetaMap["Hash Map"].title).toBe("Hash Map");
    expect(groupMetaMap["Two Pointers"]).toBeDefined();
    expect(groupMetaMap["Two Pointers"].title).toBe("Two Pointers");

    // Check that Hash Map tasks are present
    expect(groupedTasks["Hash Map"].length).toBeGreaterThan(0);
    expect(groupedTasks["Hash Map"][0].group).toBe("Hash Map");
  });
});
