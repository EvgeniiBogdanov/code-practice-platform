import { getSectionSkills } from "../config/skillCatalog";
import type { SkillSection, SkillStats } from "../types";
import { getSkillReadiness } from "./skillMastery";

export interface SkillSectionSummary {
  /** Interview readiness of the section, 0–1. */
  readiness: number;
  /** Skills of the section, including the ones with no task started. */
  total: number;
  weakCount: number;
  fadingCount: number;
}

/** The counters the skill map header shows for one section. */
export const getSectionSummary = (
  stats: ReadonlyMap<string, SkillStats>,
  section: SkillSection
): SkillSectionSummary => {
  const sectionStats = getSectionSkills(section).flatMap((skill) => {
    const skillStats = stats.get(skill.id);
    return skillStats ? [skillStats] : [];
  });
  return {
    readiness: getSkillReadiness(stats, section),
    total: sectionStats.length,
    weakCount: sectionStats.filter((item) => item.isWeak).length,
    fadingCount: sectionStats.filter((item) => item.isFading).length,
  };
};
