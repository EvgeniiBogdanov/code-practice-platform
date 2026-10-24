import { describe, expect, it } from "vitest";
import { SKILLS } from "@/entities/skill";
import { getSkillVisual } from "../../lib/skillVisual";
import { getGroupToneClass } from "./skillGroupTone";

describe("getGroupToneClass", () => {
  it("gives every skill's group colour a border class", () => {
    const missing = SKILLS.filter((skill) => !getGroupToneClass(getSkillVisual(skill).color)).map(
      (skill) => skill.id
    );

    expect(missing).toEqual([]);
  });

  it("reads the token behind a colour, ignoring its fallback", () => {
    expect(getGroupToneClass("var(--accent-orange, #f97316)")).toBe(
      getGroupToneClass("var(--accent-orange)")
    );
  });
});
