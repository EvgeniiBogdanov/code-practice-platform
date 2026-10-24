import { describe, expect, it } from "vitest";
import { getSectionSkills, getSkillTasks } from "../config/skillCatalog";
import type { SkillTaskStatus } from "../types";
import { computeAllSkillStats } from "./skillMastery";
import { getSectionSummary } from "./skillSummary";

const NOW = new Date(2026, 9, 22, 15).getTime();

const statsWith = (statuses: Record<string, SkillTaskStatus> = {}) =>
  computeAllSkillStats({ statuses, reviews: {}, excluded: new Set(), now: NOW });

/** `js.this` in route order; the first task is the one a test marks. */
const THIS_FIRST_TASK = getSkillTasks("js.this")[0].id;

describe("getSectionSummary", () => {
  it("counts every skill of the section for a new user", () => {
    const summary = getSectionSummary(statsWith(), "javascript");

    expect(summary).toEqual({
      readiness: 0,
      total: getSectionSkills("javascript").length,
      weakCount: 0,
      fadingCount: 0,
    });
  });

  it("counts a skill with an unsolved task as weak in its section only", () => {
    const stats = statsWith({ [THIS_FIRST_TASK]: "unsolved" });

    expect(getSectionSummary(stats, "javascript").weakCount).toBe(1);
    expect(getSectionSummary(stats, "react").weakCount).toBe(0);
  });
});
