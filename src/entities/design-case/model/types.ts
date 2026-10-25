import type { UiDiagramSceneProps } from "@/shared/ui/UiDiagramScene";

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

export interface DesignDiagram {
  label: string;
  nodes: UiDiagramSceneProps["nodes"];
  edges: UiDiagramSceneProps["edges"];
}

export interface DesignStage {
  id: RadioStageId;
  /** Markdown: what the interviewer asks at this stage. */
  prompt: string;
  forks: readonly DesignFork[];
  /** Markdown: the reference answer, always available. */
  reference: string;
  diagram?: DesignDiagram;
  /** Self-check items; the stage counts as done when all are ticked. */
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
  /** Markdown: what changes when the design meets real traffic, teams and incidents. */
  production: string;
}

export interface StageProgress {
  /** Chosen option id per fork id. */
  choices: Readonly<Record<string, string>>;
  answer: string;
  /** Indexes of ticked rubric items. */
  rubric: readonly number[];
}
