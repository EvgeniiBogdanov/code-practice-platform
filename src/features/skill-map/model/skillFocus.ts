import {
  getNextStepSkills,
  getSkillById,
  getWeakSkillRecommendations,
  pickNextTask,
  type SkillReason,
  type SkillRecommendation,
  type SkillStats,
  type SkillSection,
} from "@/entities/skill";

export interface SkillFocusItem extends SkillRecommendation {
  /** «weak» — work on a gap; «next» — the next skill of the route. */
  kind: "weak" | "next";
}

const getNextStepReason = (stats: SkillStats): SkillReason => {
  if (stats.started) {
    return { kind: "solid", text: `Начато ${stats.started} из ${stats.total}` };
  }
  const requires = getSkillById(stats.id)?.requires ?? [];
  return requires.length
    ? { kind: "prerequisite", text: "Предпосылки освоены — можно начинать" }
    : { kind: "new", text: "Стартовый навык маршрута" };
};

/**
 * What to work on now: weak and fading skills first, the next route steps fill the rest.
 * With a section, a weak foundation from another section still shows when it holds up this one.
 */
export const getSkillFocus = (
  stats: ReadonlyMap<string, SkillStats>,
  { limit, maxWeak = limit, section }: { limit: number; maxWeak?: number; section?: SkillSection }
): SkillFocusItem[] => {
  const weak = getWeakSkillRecommendations(stats, maxWeak, section).map((item): SkillFocusItem => ({
    ...item,
    kind: "weak",
  }));

  const next = getNextStepSkills(stats, limit, section)
    .filter((skill) => !weak.some((item) => item.skillId === skill.id))
    .map((skill): SkillFocusItem => ({
      kind: "next",
      skillId: skill.id,
      viaSkillId: null,
      reasons: [getNextStepReason(skill)],
      nextTask: pickNextTask(skill),
    }));

  return [...weak, ...next].slice(0, limit);
};
