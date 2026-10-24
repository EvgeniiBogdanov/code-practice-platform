import type {
  SkillProgressInput,
  SkillTaskEntry,
  SkillTaskProgress,
  SkillTaskState,
} from "../types";

/** Evidence of a solved task by review stage: 0 — solved but never rated, 6 — «Мастер». */
const EVIDENCE_BY_STAGE = [0.5, 0.4, 0.6, 0.75, 0.85, 0.95, 1] as const;
const UNSOLVED_EVIDENCE = 0.1;
/** Forgetting never takes more than half: knowledge needs refreshing, it does not vanish. */
const DECAY_FLOOR = 0.5;
/** A task from this stage on counts as solid in the skill's task list. */
export const SOLID_STAGE = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfLocalDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const parseLocalDate = (value: string): number | null => {
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day).getTime() : null;
};

/** Whole days since a `YYYY-MM-DD` due date; 0 on the due day and before it. */
export const getOverdueDays = (dueDate: string, now: number): number => {
  const due = parseLocalDate(dueDate);
  return due === null ? 0 : Math.max(0, Math.round((startOfLocalDay(now) - due) / DAY_MS));
};

/** A review is due from its due day on, like `isTaskDue` in the review entity. */
const isReviewDue = (dueDate: string, now: number): boolean => {
  const due = parseLocalDate(dueDate);
  return due !== null && startOfLocalDay(now) >= due;
};

/** Share of the evidence kept after `overdueDays` past a review interval of `intervalDays`. */
export const getRetention = (overdueDays: number, intervalDays: number): number =>
  overdueDays > 0 ? Math.max(DECAY_FLOOR, 1 - (0.5 * overdueDays) / Math.max(1, intervalDays)) : 1;

/** Interview weight of a task: up to twice as much for a task that is very likely to come up. */
export const getTaskWeight = (entry: Pick<SkillTaskEntry, "probability">): number =>
  0.5 + (entry.probability ?? 50) / 200;

const getState = (
  status: string | null | undefined,
  stage: number,
  isDue: boolean,
  isHard: boolean
): SkillTaskState => {
  if (status === "unsolved") return "unsolved";
  if (status !== "solved") return "new";
  if (isDue) return "overdue";
  if (isHard) return "hard";
  return stage >= SOLID_STAGE ? "solid" : "learning";
};

export interface TaskProgressWithDecay extends SkillTaskProgress {
  /** Evidence as if every review were on time. */
  evidenceWithoutDecay: number | null;
}

/** Where a task stands and how much it proves of its skill. */
export const getTaskProgress = (
  entry: SkillTaskEntry,
  { statuses, reviews, excluded, now }: SkillProgressInput
): TaskProgressWithDecay => {
  const base = { ...entry, stage: 0, overdueDays: 0, intervalDays: 0 };
  if (excluded.has(entry.id)) {
    return { ...base, state: "excluded", evidence: null, evidenceWithoutDecay: null };
  }

  const status = statuses[entry.id];
  const review = status === "solved" ? reviews[entry.id] : undefined;
  const stage = review?.stage ?? 0;
  const intervalDays = review?.intervalDays ?? 0;
  const overdueDays = review ? getOverdueDays(review.dueDate, now) : 0;
  const isDue = stage > 0 && review !== undefined && isReviewDue(review.dueDate, now);
  const state = getState(status, stage, isDue, review?.rating === "hard");

  const raw =
    status === "unsolved"
      ? UNSOLVED_EVIDENCE
      : status === "solved"
        ? EVIDENCE_BY_STAGE[Math.min(stage, EVIDENCE_BY_STAGE.length - 1)]
        : null;
  const evidence = raw === null ? null : raw * getRetention(overdueDays, intervalDays);
  return { ...base, stage, intervalDays, overdueDays, state, evidence, evidenceWithoutDecay: raw };
};
