import type { SkillStats, SkillTaskProgress } from "../types";

const DIFFICULTY_RANK: Readonly<Record<string, number>> = {
  "warm-up": 0,
  easy: 0,
  junior: 1,
  refactoring: 1,
  medium: 1,
  middle: 1,
  hard: 2,
  senior: 2,
};
/** From this stage on a solved task is considered held for good and is not suggested again. */
const SETTLED_STAGE = 5;

const byDifficulty = (a: SkillTaskProgress, b: SkillTaskProgress): number =>
  (DIFFICULTY_RANK[a.difficulty ?? ""] ?? 1) - (DIFFICULTY_RANK[b.difficulty ?? ""] ?? 1);

const byOverdueShare = (a: SkillTaskProgress, b: SkillTaskProgress): number =>
  b.overdueDays / Math.max(1, b.intervalDays) - a.overdueDays / Math.max(1, a.intervalDays);

/**
 * The task to practise next in a skill: unsolved first (easiest first), then due reviews (most
 * overdue first), then the ones rated «тяжело», then new tasks in route order, then the least
 * reinforced solved ones. Null when every task is settled.
 */
export const pickNextTask = (stats: SkillStats): SkillTaskProgress | null => {
  const of = (state: SkillTaskProgress["state"]): SkillTaskProgress[] =>
    stats.tasks.filter((task) => task.state === state);

  return (
    of("unsolved").sort(byDifficulty)[0] ??
    of("overdue").sort(byOverdueShare)[0] ??
    of("hard")[0] ??
    of("new")[0] ??
    [...of("learning"), ...of("solid")]
      .filter((task) => task.stage < SETTLED_STAGE)
      .sort((a, b) => a.stage - b.stage)[0] ??
    null
  );
};
