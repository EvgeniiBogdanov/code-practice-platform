import { describe, expect, it } from "vitest";
import {
  computeAllSkillStats,
  getSkillTasks,
  type SkillStats,
  type SkillTaskStatus,
} from "@/entities/skill";
import { matchesSkillFilter } from "./skillFilter";

const NOW = new Date(2026, 9, 22, 15).getTime();
const THIS_FIRST_TASK = getSkillTasks("js.this")[0].id;

const statsWith = (statuses: Record<string, SkillTaskStatus>): SkillStats => {
  const stats = computeAllSkillStats({ statuses, reviews: {}, excluded: new Set(), now: NOW }).get(
    "js.this"
  );
  if (!stats) throw new Error("js.this is missing from the skill map");
  return stats;
};

describe("matchesSkillFilter", () => {
  it("keeps every skill under «Все»", () => {
    expect(matchesSkillFilter(statsWith({}), "all")).toBe(true);
    expect(matchesSkillFilter(statsWith({ [THIS_FIRST_TASK]: "unsolved" }), "all")).toBe(true);
  });

  it("keeps only the weak skills under «Слабые»", () => {
    expect(matchesSkillFilter(statsWith({ [THIS_FIRST_TASK]: "unsolved" }), "weak")).toBe(true);
    expect(matchesSkillFilter(statsWith({}), "weak")).toBe(false);
  });

  it("keeps only the skills nothing is started in under «Не начаты»", () => {
    expect(matchesSkillFilter(statsWith({}), "new")).toBe(true);
    expect(matchesSkillFilter(statsWith({ [THIS_FIRST_TASK]: "unsolved" }), "new")).toBe(false);
  });

  it("keeps no fresh skill under «Угасают»", () => {
    expect(matchesSkillFilter(statsWith({}), "fading")).toBe(false);
  });
});
