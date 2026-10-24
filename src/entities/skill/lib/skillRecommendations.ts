import type { SectionType } from "@/entities/task/meta";
import { pluralizeRu } from "@/shared/lib/plural";
import { SKILLS, getSkillById } from "../config/skillCatalog";
import type { SkillReason, SkillRecommendation, SkillStats } from "../types";
import { pickNextTask } from "./pickNextTask";
import { getSkillUnlockCount } from "./skillGraph";
import { SOLID_STAGE } from "./taskEvidence";

/** Prerequisites at or above this mastery are ready: the skill becomes a next step. */
const READY_PREREQUISITE = 0.6;

const TASKS = ["задача", "задачи", "задач"] as const;

/** Why a skill has its mastery, one line per signal; the same counters drive the ranking. */
export const getSkillReasons = (stats: SkillStats): SkillReason[] => {
  const reasons: SkillReason[] = [];
  const maxOverdue = Math.max(0, ...stats.tasks.map((task) => task.overdueDays));
  const solid = stats.tasks.filter((task) => task.stage >= SOLID_STAGE).length;
  const notStarted = stats.tasks.filter((task) => task.state === "new").length;

  if (stats.unsolved) {
    const marked = pluralizeRu(stats.unsolved, ["отмечена", "отмечены", "отмечены"]);
    reasons.push({
      kind: "unsolved",
      text: `${stats.unsolved} ${pluralizeRu(stats.unsolved, TASKS)} ${marked} «не решено»`,
    });
  }
  if (stats.hard) {
    const ratings = pluralizeRu(stats.hard, ["оценка", "оценки", "оценок"]);
    reasons.push({ kind: "hard", text: `${stats.hard} ${ratings} «тяжело»` });
  }
  if (stats.overdue) {
    const reviews = pluralizeRu(stats.overdue, [
      "повтор просрочен",
      "повтора просрочены",
      "повторов просрочено",
    ]);
    const days = maxOverdue
      ? `, до ${maxOverdue} ${pluralizeRu(maxOverdue, ["дня", "дней", "дней"])}`
      : "";
    reasons.push({ kind: "overdue", text: `${stats.overdue} ${reviews}${days}` });
  }
  if (solid) {
    const held = pluralizeRu(solid, ["задача закреплена", "задачи закреплены", "задач закреплено"]);
    reasons.push({ kind: "solid", text: `${solid} ${held} повторениями` });
  }
  if (notStarted) {
    const started = pluralizeRu(notStarted, ["не начата", "не начаты", "не начаты"]);
    reasons.push({
      kind: "new",
      text: `${notStarted} ${pluralizeRu(notStarted, TASKS)} ${started}`,
    });
  }
  return reasons;
};

/** How urgently a weak or fading skill needs work; foundations outrank the skills built on them. */
const getWeaknessScore = (stats: SkillStats): number => {
  const overdueShare = stats.tasks.reduce(
    (sum, task) => sum + Math.min(task.overdueDays / Math.max(1, task.intervalDays), 2),
    0
  );
  return (
    stats.importance *
    (3 * stats.unsolved + 2 * stats.hard + overdueShare + 0.3 * getSkillUnlockCount(stats.id))
  );
};

/** The deepest weak prerequisite of a weak skill: fix the foundation first. */
const findWeakFoundation = (
  skillId: string,
  stats: ReadonlyMap<string, SkillStats>,
  seen = new Set<string>()
): string | null => {
  for (const required of getSkillById(skillId)?.requires ?? []) {
    if (seen.has(required) || !stats.get(required)?.isWeak) continue;
    seen.add(required);
    return findWeakFoundation(required, stats, seen) ?? required;
  }
  return null;
};

const toRecommendation = (
  skillStats: SkillStats,
  viaSkillId: string | null
): SkillRecommendation => {
  const reasons = getSkillReasons(skillStats).filter((reason) => reason.kind !== "solid");
  const via = viaSkillId ? getSkillById(viaSkillId)?.title : null;
  return {
    skillId: skillStats.id,
    viaSkillId,
    reasons: via
      ? [{ kind: "prerequisite", text: `На нём держится «${via}»` }, ...reasons]
      : reasons,
    nextTask: pickNextTask(skillStats),
  };
};

/**
 * Weak and fading skills to work on, most urgent first, redirected to weak foundations.
 * With a section, only its skills are candidates, but a foundation may come from any section.
 */
export const getWeakSkillRecommendations = (
  stats: ReadonlyMap<string, SkillStats>,
  limit: number,
  section?: SectionType
): SkillRecommendation[] => {
  const ranked = [...stats.values()]
    .filter((skill) => skill.isWeak || skill.isFading)
    .filter((skill) => !section || getSkillById(skill.id)?.section === section)
    .sort((a, b) => getWeaknessScore(b) - getWeaknessScore(a));

  const result: SkillRecommendation[] = [];
  for (const skill of ranked) {
    const foundationId = skill.isWeak ? findWeakFoundation(skill.id, stats) : null;
    const target = foundationId ? stats.get(foundationId) : skill;
    if (!target || result.some((item) => item.skillId === target.id)) continue;
    result.push(toRecommendation(target, foundationId ? skill.id : null));
    if (result.length === limit) break;
  }
  return result;
};

/**
 * Skills to start next: not weak, below «Уверенно», with every prerequisite ready. Skills already
 * in progress come first, then the catalog order, which is the intended learning path.
 */
export const getNextStepSkills = (
  stats: ReadonlyMap<string, SkillStats>,
  limit: number,
  section?: SectionType
): SkillStats[] =>
  SKILLS.flatMap((skill) => {
    if (section && skill.section !== section) return [];
    const skillStats = stats.get(skill.id);
    if (!skillStats?.total || skillStats.isWeak) return [];
    if (!["new", "intro", "practice"].includes(skillStats.level)) return [];
    const isReady = skill.requires.every(
      (required) => (stats.get(required)?.mastery ?? 0) >= READY_PREREQUISITE
    );
    return isReady ? [skillStats] : [];
  })
    .sort((a, b) => Number(b.started > 0) - Number(a.started > 0))
    .slice(0, limit);
