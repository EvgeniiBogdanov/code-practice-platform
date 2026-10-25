import {
  getSectionSkillDepths,
  getSectionSkills,
  getSkillById,
  type SkillSection,
} from "@/entities/skill";

export interface SkillGraphEdge {
  from: string;
  to: string;
}

export interface SkillGraphLayout {
  /** Skill ids per prerequisite depth, left to right. */
  levels: string[][];
  edges: SkillGraphEdge[];
}

const sameSectionRequires = (skillId: string, section: SkillSection): string[] =>
  (getSkillById(skillId)?.requires ?? []).filter(
    (required) => getSkillById(required)?.section === section
  );

/**
 * Levels by prerequisite depth. Inside a level skills sit under their prerequisites
 * (average position of the parents), which keeps most edges short and uncrossed; ties keep
 * the catalog order.
 */
export const getSkillGraphLayout = (section: SkillSection): SkillGraphLayout => {
  const skills = getSectionSkills(section);
  const depths = getSectionSkillDepths(section);
  const levelCount = Math.max(0, ...depths.values()) + 1;
  const positionOf = new Map<string, number>();
  const levels: string[][] = [];

  for (let depth = 0; depth < levelCount; depth += 1) {
    const ids = skills.filter((skill) => depths.get(skill.id) === depth).map((skill) => skill.id);
    const barycenter = (id: string): number => {
      const positions = sameSectionRequires(id, section).map(
        (required) => positionOf.get(required) ?? 0
      );
      return positions.length
        ? positions.reduce((sum, position) => sum + position, 0) / positions.length
        : 0;
    };
    const level = depth === 0 ? ids : [...ids].sort((a, b) => barycenter(a) - barycenter(b));
    level.forEach((id, position) => positionOf.set(id, position));
    levels.push(level);
  }

  const edges = skills.flatMap((skill) =>
    sameSectionRequires(skill.id, section).map((from) => ({ from, to: skill.id }))
  );
  return { levels, edges };
};

/** The skill plus everything it builds on and everything built on it, inside the layout. */
export const getRelatedSkills = (
  skillId: string,
  edges: readonly SkillGraphEdge[]
): Set<string> => {
  const related = new Set([skillId]);
  const walk = (id: string, direction: "up" | "down"): void =>
    edges.forEach((edge) => {
      const [here, next] = direction === "up" ? [edge.to, edge.from] : [edge.from, edge.to];
      if (here !== id || related.has(next)) return;
      related.add(next);
      walk(next, direction);
    });
  walk(skillId, "up");
  walk(skillId, "down");
  return related;
};
