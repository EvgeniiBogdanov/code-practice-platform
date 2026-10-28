import type { BoardEdge, BoardNode } from "@/shared/ui/UiBoardEditor";

/** RADIO: the order in which a frontend design is discussed. */
export type RadioStageId =
  "requirements" | "architecture" | "data-model" | "interface" | "optimizations";

export type DesignCaseDifficulty = "easy" | "medium" | "hard";

export interface DesignForkOption {
  id: string;
  label: string;
  /** Trade-offs of the option, shown for every option once the fork is answered. */
  explanation: string;
  recommended?: boolean;
}

export interface DesignFork {
  id: string;
  question: string;
  options: readonly DesignForkOption[];
}

/**
 * The reference scheme of a case, drawn the way it grows on an interview board: every card and
 * arrow belongs to the stage that adds it, so stage N shows the layers of stages 1..N.
 */
export interface DesignScheme {
  nodes: readonly (BoardNode & { stage: RadioStageId })[];
  edges: readonly (BoardEdge & { stage: RadioStageId })[];
}

export interface DesignStage {
  id: RadioStageId;
  /** Markdown: what the interviewer asks at this stage. */
  prompt: string;
  forks: readonly DesignFork[];
  /** Markdown: short points on why the reference scheme of this stage looks the way it does. */
  notes: string;
  /** Self-check of the learner's scheme against the reference; the stage counts as done when all are ticked. */
  rubric: readonly string[];
  /** Ids of code drills (tasks of the system design section) practising this stage. */
  drillIds: readonly string[];
  /** Ids of theory topics worth reading before this stage. */
  topicIds: readonly string[];
}

export interface DesignCaseMeta {
  id: string;
  title: string;
  difficulty: DesignCaseDifficulty;
  summary: string;
}

export interface DesignCase extends DesignCaseMeta {
  /** One stage per RADIO step, in order. */
  stages: readonly DesignStage[];
  scheme: DesignScheme;
  /** Markdown: what changes when the design meets real traffic, teams and incidents. */
  production: string;
}

export interface StageProgress {
  /** Chosen option id per fork id. */
  choices: Readonly<Record<string, string>>;
  /** Indexes of ticked rubric items. */
  rubric: readonly number[];
}
