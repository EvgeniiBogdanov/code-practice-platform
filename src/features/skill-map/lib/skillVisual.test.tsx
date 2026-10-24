import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ALGO_GROUP_CONFIG,
  JS_GROUP_CONFIG,
  REACT_GROUPS_CONFIG,
  TYPESCRIPT_GROUP_CONFIG,
} from "@/entities/task";
import { SKILLS, getSkillById, getSkillTasks, type SkillDefinition } from "@/entities/skill";
import { getSkillVisual } from "./skillVisual";

const groupConfigOf = (skill: SkillDefinition): Record<string, unknown> => {
  if (skill.section === "javascript") return JS_GROUP_CONFIG;
  if (skill.section === "typescript") return TYPESCRIPT_GROUP_CONFIG;
  if (skill.section === "algorithms") return ALGO_GROUP_CONFIG;
  return REACT_GROUPS_CONFIG;
};

const skillOf = (id: string): SkillDefinition => {
  const skill = getSkillById(id);
  if (!skill) throw new Error(`unknown skill ${id}`);
  return skill;
};

describe("getSkillVisual", () => {
  it("draws a JavaScript skill with the icon and colour of its group", () => {
    const visual = getSkillVisual(skillOf("js.types"));

    expect(visual.color).toBe(JS_GROUP_CONFIG["Типы данных"].color);
    expect(render(<>{visual.icon}</>).container.querySelector("svg")).not.toBeNull();
  });

  it("takes the group of the skill's first task in route order", () => {
    expect(getSkillVisual(skillOf("js.loops")).color).toBe(JS_GROUP_CONFIG["Циклы"].color);
  });

  it("finds a group config for every skill's first task", () => {
    const unknown = SKILLS.filter((skill) => {
      const group = getSkillTasks(skill.id)[0]?.group;
      return !group || !(group in groupConfigOf(skill));
    }).map((skill) => skill.id);

    expect(unknown).toEqual([]);
  });
});
