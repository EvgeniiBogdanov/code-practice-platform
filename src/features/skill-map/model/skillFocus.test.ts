import { describe, expect, it } from "vitest";
import { computeAllSkillStats, getSkillTasks, type SkillTaskStatus } from "@/entities/skill";
import { getSkillFocus } from "./skillFocus";

const statsWith = (statuses: Record<string, SkillTaskStatus>) =>
  computeAllSkillStats({ statuses, reviews: {}, excluded: new Set(), now: Date.now() });

const firstTask = (skillId: string): string => getSkillTasks(skillId)[0].id;

describe("getSkillFocus", () => {
  it("shows a new user where the route starts", () => {
    expect(getSkillFocus(statsWith({}), { limit: 3 })).toMatchObject([
      { kind: "next", skillId: "js.scope", reasons: [{ text: "Стартовый навык маршрута" }] },
      { kind: "next", skillId: "js.types" },
      { kind: "next", skillId: "js.loops" },
    ]);
  });

  it("caps weak skills and fills the rest with the next steps", () => {
    const stats = statsWith({
      [firstTask("js.this")]: "unsolved",
      [firstTask("js.event-loop")]: "unsolved",
      [firstTask("js.recursion")]: "unsolved",
    });
    const focus = getSkillFocus(stats, { limit: 3, maxWeak: 2 });

    expect(focus.map((item) => item.kind)).toEqual(["weak", "weak", "next"]);
  });

  it("keeps a weak foundation from another section when it holds up this one", () => {
    // «Эффекты» in React build on JavaScript closures: both weak → the closures come first.
    const stats = statsWith({
      [firstTask("react.effects")]: "unsolved",
      [firstTask("js.closures")]: "unsolved",
    });
    const [top] = getSkillFocus(stats, { limit: 3, section: "react" });

    expect(top).toMatchObject({
      kind: "weak",
      skillId: "js.closures",
      viaSkillId: "react.effects",
    });
  });

  it("limits the next steps to the section", () => {
    const focus = getSkillFocus(statsWith({}), { limit: 2, section: "algorithms" });
    expect(focus.map((item) => item.skillId)).toEqual(["algo.binary-search", "algo.stack"]);
  });
});
