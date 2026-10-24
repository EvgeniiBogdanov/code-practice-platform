import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { computeAllSkillStats, getSkillById, type SkillStats } from "@/entities/skill";
import { SkillNode } from "./SkillNode";

const NOW = new Date(2026, 9, 22, 15).getTime();

const renderNode = (skillId: string) => {
  const skill = getSkillById(skillId);
  if (!skill) throw new Error(`unknown skill ${skillId}`);
  const stats: SkillStats | undefined = computeAllSkillStats({
    statuses: {},
    reviews: {},
    excluded: new Set(),
    now: NOW,
  }).get(skillId);
  if (!stats) throw new Error(`no stats for ${skillId}`);
  render(
    <SkillNode
      skill={skill}
      stats={stats}
      isSelected={false}
      isActive={false}
      isRelated={false}
      isMuted={false}
      isDimmed={false}
      onSelect={vi.fn()}
      onHover={vi.fn()}
      onKeyDown={vi.fn()}
    />
  );
  return skill;
};

describe("SkillNode", () => {
  it("keeps the full name in a tooltip, because the card may clip it to two lines", () => {
    const skill = renderNode("js.hof");

    expect(screen.getByText(skill.title)).toHaveAttribute("title", skill.title);
  });
});
