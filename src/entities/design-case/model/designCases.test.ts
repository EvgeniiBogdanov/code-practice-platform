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

  it("returns null for an unknown case", async () => {
    expect(await loadDesignCase("no-such-case")).toBeNull();
  });
});
