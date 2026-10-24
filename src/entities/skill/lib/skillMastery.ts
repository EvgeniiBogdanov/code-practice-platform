import type { SectionType } from "@/entities/task/meta";
import { SKILLS, getSkillTasks } from "../config/skillCatalog";
import type { SkillDefinition, SkillLevel, SkillProgressInput, SkillStats } from "../types";
import { getTaskProgress, getTaskWeight, type TaskProgressWithDecay } from "./taskEvidence";

/** A skill is weak when the started tasks prove less than this on average. */
const WEAK_QUALITY = 0.5;
/** A skill is fading when overdue reviews cost it at least this much mastery. */
const FADING_LOSS = 0.15;
/** «Мастер» also needs every likely interview task at this review stage. */
const MASTER_STAGE = 4;
const MASTER_PROBABILITY = 75;

const getLevel = (mastery: number, started: number, isMastered: boolean): SkillLevel => {
  if (started === 0) return "new";
  if (mastery < 0.4) return "intro";
  if (mastery < 0.7) return "practice";
  return mastery >= 0.9 && isMastered ? "master" : "confident";
};

interface Weighted {
  weight: number;
  value: number;
}

const weightedAverage = (items: readonly Weighted[]): number => {
  const total = items.reduce((sum, { weight }) => sum + weight, 0);
  return total ? items.reduce((sum, { weight, value }) => sum + weight * value, 0) / total : 0;
};

const byEvidence = (task: TaskProgressWithDecay): Weighted => ({
  weight: getTaskWeight(task),
  value: task.evidence ?? 0,
});

const byEvidenceWithoutDecay = (task: TaskProgressWithDecay): Weighted => ({
  weight: getTaskWeight(task),
  value: task.evidenceWithoutDecay ?? 0,
});

export const computeSkillStats = (
  skill: SkillDefinition,
  progress: SkillProgressInput
): SkillStats => {
  const tasks = getSkillTasks(skill.id).map((entry) => getTaskProgress(entry, progress));
  const active = tasks.filter((task) => task.state !== "excluded");
  const started = active.filter((task) => task.evidence !== null);

  const mastery = weightedAverage(active.map(byEvidence));
  const masteryWithoutDecay = weightedAverage(active.map(byEvidenceWithoutDecay));
  // Quality judges how well tasks were solved; forgetting is the separate «fading» flag.
  const quality = started.length ? weightedAverage(started.map(byEvidenceWithoutDecay)) : null;

  const unsolved = active.filter((task) => task.state === "unsolved").length;
  const isWeak =
    unsolved > 0 || (started.length >= 2 && quality !== null && quality < WEAK_QUALITY);
  const isFading = masteryWithoutDecay - mastery >= FADING_LOSS;
  const isMastered = active.every(
    (task) => (task.probability ?? 0) < MASTER_PROBABILITY || task.stage >= MASTER_STAGE
  );
  const level = getLevel(mastery, started.length, isMastered);

  return {
    id: skill.id,
    mastery,
    masteryWithoutDecay,
    quality,
    level,
    state: isWeak ? "weak" : isFading ? "fading" : level,
    isWeak,
    isFading,
    total: active.length,
    started: started.length,
    unsolved,
    hard: active.filter((task) => task.state === "hard").length,
    overdue: active.filter((task) => task.state === "overdue").length,
    importance: weightedAverage(active.map((task) => ({ weight: 1, value: getTaskWeight(task) }))),
    tasks,
  };
};

/** Mastery of every skill; overdue days count from `progress.now`, the current time by default. */
export const computeAllSkillStats = (
  progress: Omit<SkillProgressInput, "now"> & { now?: number }
): Map<string, SkillStats> => {
  const input = { ...progress, now: progress.now ?? Date.now() };
  return new Map(SKILLS.map((skill) => [skill.id, computeSkillStats(skill, input)]));
};

/** Interview readiness of a section (or of everything): mastery weighted by skill importance. */
export const getSkillReadiness = (
  stats: ReadonlyMap<string, SkillStats>,
  section?: SectionType
): number =>
  weightedAverage(
    SKILLS.filter((skill) => !section || skill.section === section).flatMap((skill): Weighted[] => {
      const skillStats = stats.get(skill.id);
      return skillStats?.total
        ? [{ weight: skillStats.importance, value: skillStats.mastery }]
        : [];
    })
  );
