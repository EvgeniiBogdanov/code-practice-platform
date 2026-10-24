import type { SectionType } from "@/entities/task/meta";
import { SKILLS, getSkillById } from "../config/skillCatalog";

const dependents = new Map<string, string[]>();
for (const skill of SKILLS) {
  for (const required of skill.requires) {
    dependents.set(required, [...(dependents.get(required) ?? []), skill.id]);
  }
}

/** Skills that list `skillId` among their prerequisites. */
export const getSkillDependents = (skillId: string): readonly string[] =>
  dependents.get(skillId) ?? [];

const unlockCounts = new Map<string, number>();

/** How many skills build on this one, directly or transitively. */
export const getSkillUnlockCount = (skillId: string): number => {
  const cached = unlockCounts.get(skillId);
  if (cached !== undefined) return cached;
  const seen = new Set<string>();
  const visit = (id: string): void =>
    getSkillDependents(id).forEach((next) => {
      if (seen.has(next)) return;
      seen.add(next);
      visit(next);
    });
  visit(skillId);
  unlockCounts.set(skillId, seen.size);
  return seen.size;
};

/** A prerequisite path that leads back to its start, or null when the graph is acyclic. */
export const findSkillCycle = (): string[] | null => {
  const state = new Map<string, "visiting" | "done">();
  const walk = (id: string, path: string[]): string[] | null => {
    if (state.get(id) === "done") return null;
    if (state.get(id) === "visiting") return [...path.slice(path.indexOf(id)), id];
    state.set(id, "visiting");
    for (const required of getSkillById(id)?.requires ?? []) {
      const cycle = walk(required, [...path, id]);
      if (cycle) return cycle;
    }
    state.set(id, "done");
    return null;
  };
  for (const skill of SKILLS) {
    const cycle = walk(skill.id, []);
    if (cycle) return cycle;
  }
  return null;
};

/**
 * Graph level of every skill of a section: the longest prerequisite path inside the section.
 * Prerequisites from other sections do not shift a skill: they are shown as links, not levels.
 */
export const getSectionSkillDepths = (section: SectionType): Map<string, number> => {
  const depths = new Map<string, number>();
  const depthOf = (id: string): number => {
    const known = depths.get(id);
    if (known !== undefined) return known;
    const inSection = (getSkillById(id)?.requires ?? []).filter(
      (required) => getSkillById(required)?.section === section
    );
    const depth = inSection.length ? Math.max(...inSection.map(depthOf)) + 1 : 0;
    depths.set(id, depth);
    return depth;
  };
  SKILLS.filter((skill) => skill.section === section).forEach((skill) => depthOf(skill.id));
  return depths;
};
