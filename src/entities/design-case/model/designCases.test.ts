import { describe, expect, it } from "vitest";
import { DESIGN_CASES } from "../content/cases";
import { loadDesignCase } from "./designCases";
import { RADIO_STAGES } from "./radioStages";

describe("design cases", () => {
  it("has a unique id and a module for every case", async () => {
    const ids = DESIGN_CASES.map((meta) => meta.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      expect(designCase).toMatchObject(meta);
    }
  });

  it("walks every case through all RADIO stages in order, each with a rubric", async () => {
    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      expect(designCase?.stages.map((stage) => stage.id)).toEqual(RADIO_STAGES.map(({ id }) => id));
      for (const stage of designCase?.stages ?? []) {
        expect(stage.rubric.length).toBeGreaterThan(0);
        for (const fork of stage.forks) {
          expect(fork.options.filter((option) => option.recommended)).toHaveLength(1);
        }
      }
    }
  });

  it("draws a reference scheme with a layer for every stage and arrows between its cards", async () => {
    const stageIds = new Set(RADIO_STAGES.map(({ id }) => id));
    const order = (stage: string): number => RADIO_STAGES.findIndex(({ id }) => id === stage);
    for (const meta of DESIGN_CASES) {
      const designCase = await loadDesignCase(meta.id);
      const { nodes = [], edges = [] } = designCase?.scheme ?? {};
      const nodeStages = new Map(nodes.map(({ id, stage }) => [id, order(stage)]));
      const ids = [...nodes, ...edges].map(({ id }) => id);

      expect(new Set(ids).size, meta.id).toBe(ids.length);
      expect(new Set(nodes.map(({ stage }) => stage)), meta.id).toEqual(stageIds);
      for (const edge of edges) {
        // An arrow never shows up before the cards it connects.
        const ends = [nodeStages.get(edge.source), nodeStages.get(edge.target)];
        expect(ends, edge.id).not.toContain(undefined);
        expect(Math.max(...ends.map((stage) => stage ?? Infinity)), edge.id).toBeLessThanOrEqual(
          order(edge.stage)
        );
      }
    }
  });

  it("returns null for an unknown case", async () => {
    expect(await loadDesignCase("no-such-case")).toBeNull();
  });
});
