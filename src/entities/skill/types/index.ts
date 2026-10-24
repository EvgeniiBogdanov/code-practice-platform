import type { SectionType } from "@/entities/task/meta";

/** How a step picks its tasks out of the curriculum. Used only when the task index is generated. */
export type SkillStepMatch =
  { group: string; subgroups?: readonly string[] } | { taskIds: readonly string[] };

export interface SkillStep {
  title: string;
  match: SkillStepMatch;
}

export interface SkillDefinition {
  id: string;
  section: SectionType;
  title: string;
  /** Skills this one builds on. Soft links: they shape recommendations, never lock anything. */
  requires: readonly string[];
  steps: readonly SkillStep[];
}

/** One task of the generated index: everything the skill math needs, without task sources. */
export interface SkillTaskEntry {
  id: string;
  skill: string;
  step: number;
  /** The curriculum group the task belongs to, keyed as its section's group config is (React: the group id). */
  group: string | null;
  difficulty: string | null;
  probability: number | null;
  title: string;
}

export type SkillLevel = "new" | "intro" | "practice" | "confident" | "master";

/** What a skill node shows: a flag when one is raised, otherwise the level. */
export type SkillState = SkillLevel | "weak" | "fading";

export type SkillTaskStatus = "solved" | "unsolved" | null;

/** The review fields the skill math reads; `ReviewItem` from the review entity satisfies it. */
export interface SkillReviewInput {
  stage: number;
  intervalDays: number;
  dueDate: string;
  rating: "hard" | "medium" | "easy";
}

export interface SkillProgressInput {
  statuses: Readonly<Record<string, SkillTaskStatus | undefined>>;
  reviews: Readonly<Record<string, SkillReviewInput | undefined>>;
  excluded: ReadonlySet<string>;
  /** Timestamp the overdue days are counted from. */
  now: number;
}

export type SkillTaskState =
  "new" | "unsolved" | "hard" | "overdue" | "learning" | "solid" | "excluded";

export interface SkillTaskProgress extends SkillTaskEntry {
  state: SkillTaskState;
  /** 0–1, or null when the task was never started or is excluded. */
  evidence: number | null;
  stage: number;
  overdueDays: number;
  intervalDays: number;
}

export interface SkillStats {
  id: string;
  /** 0–1 over every active task; tasks not started count as 0. */
  mastery: number;
  /** Mastery without forgetting: the gap to `mastery` is what overdue reviews cost. */
  masteryWithoutDecay: number;
  /** 0–1 over started tasks only, null when nothing is started. */
  quality: number | null;
  level: SkillLevel;
  state: SkillState;
  isWeak: boolean;
  isFading: boolean;
  total: number;
  started: number;
  unsolved: number;
  hard: number;
  overdue: number;
  /** Average task weight: how much this skill matters at an interview. */
  importance: number;
  tasks: readonly SkillTaskProgress[];
}

export type SkillReasonKind = "unsolved" | "hard" | "overdue" | "new" | "solid" | "prerequisite";

export interface SkillReason {
  kind: SkillReasonKind;
  text: string;
}

export interface SkillRecommendation {
  skillId: string;
  /** The weak skill that led here when the recommendation is its weak prerequisite. */
  viaSkillId: string | null;
  reasons: readonly SkillReason[];
  nextTask: SkillTaskProgress | null;
}
