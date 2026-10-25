import { describe, expect, it } from "vitest";
import { DESIGN_CASES, loadDesignCase } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { loadTaskSection } from "@/entities/task/catalog";

describe("system design content", () => {
  it("links every case only to existing drills and topics", async () => {
    const drillIds = new Set(
      (await loadTaskSection("system-design")).map((task) => String(task.id))
    );
    const topicIds = new Set(DESIGN_TOPICS.map((topic) => topic.id));

    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      for (const stage of designCase?.stages ?? []) {
        for (const id of stage.drillIds)
          expect(drillIds.has(id), `${meta.id}: drill ${id}`).toBe(true);
        for (const id of stage.topicIds)
          expect(topicIds.has(id), `${meta.id}: topic ${id}`).toBe(true);
      }
    }
  });

  it("uses every drill and every topic in at least one case", async () => {
    const usedDrills = new Set<string>();
    const usedTopics = new Set<string>();
    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      for (const stage of designCase?.stages ?? []) {
        stage.drillIds.forEach((id) => usedDrills.add(id));
        stage.topicIds.forEach((id) => usedTopics.add(id));
      }
    }
    const drills = (await loadTaskSection("system-design")).map((task) => String(task.id));
    expect([...usedDrills].sort()).toEqual([...drills].sort());
    expect([...usedTopics].sort()).toEqual(DESIGN_TOPICS.map((topic) => topic.id).sort());
  });

  it("keeps fork ids and rubric items unique inside a case", async () => {
    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      const forkIds =
        designCase?.stages.flatMap((stage) => stage.forks.map((fork) => fork.id)) ?? [];
      expect(new Set(forkIds).size, meta.id).toBe(forkIds.length);
      for (const stage of designCase?.stages ?? []) {
        expect(new Set(stage.rubric).size, `${meta.id}/${stage.id}`).toBe(stage.rubric.length);
      }
    }
  });
});
