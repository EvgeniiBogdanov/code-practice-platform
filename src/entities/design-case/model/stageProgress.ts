import type { BoardValue } from "@/shared/ui/UiBoardEditor";
import type { DesignCase, DesignStage, StageProgress } from "./types";

export const EMPTY_STAGE_PROGRESS: StageProgress = { choices: {}, rubric: [] };

/** What the board shows before the learner draws anything. */
export const EMPTY_BOARD: BoardValue = { nodes: [], edges: [] };

export const getStageKey = (caseId: string, stageId: string): string => `${caseId}:${stageId}`;

/** A stage is done when every fork is answered and the scheme is checked against the whole rubric. */
export const isStageComplete = (stage: DesignStage, progress: StageProgress): boolean =>
  stage.forks.every((fork) => progress.choices[fork.id] !== undefined) &&
  stage.rubric.every((_, index) => progress.rubric.includes(index));

export const countCompletedStages = (
  designCase: DesignCase,
  stages: Readonly<Record<string, StageProgress>>
): number =>
  designCase.stages.filter((stage) =>
    isStageComplete(stage, stages[getStageKey(designCase.id, stage.id)] ?? EMPTY_STAGE_PROGRESS)
  ).length;

/** A case is passed when all its stages are done and every drill it links to is solved. */
export const isCaseCompleted = (
  designCase: DesignCase,
  stages: Readonly<Record<string, StageProgress>>,
  isDrillSolved: (drillId: string) => boolean
): boolean =>
  countCompletedStages(designCase, stages) === designCase.stages.length &&
  designCase.stages.every((stage) => stage.drillIds.every(isDrillSolved));
