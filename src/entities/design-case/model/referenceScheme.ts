import type { BoardValue } from "@/shared/ui/UiBoardEditor";
import { RADIO_STAGES } from "./radioStages";
import type { DesignScheme, RadioStageId } from "./types";

export interface ReferenceBoard {
  board: BoardValue;
  /** Cards and arrows the stage itself adds; empty when the whole scheme is shown. */
  highlightedIds: string[];
}

const stageIndex = (stageId: RadioStageId): number =>
  RADIO_STAGES.findIndex(({ id }) => id === stageId);

/**
 * The reference scheme as it looks at a stage: the layers of this and every earlier stage, with what
 * the stage adds highlighted. `"all"` is the finished scheme without highlights.
 */
export const getReferenceBoard = (
  scheme: DesignScheme,
  stageId: RadioStageId | "all"
): ReferenceBoard => {
  const last = stageId === "all" ? RADIO_STAGES.length - 1 : stageIndex(stageId);
  const isShown = (item: { stage: RadioStageId }): boolean => stageIndex(item.stage) <= last;
  const isNew = (item: { stage: RadioStageId }): boolean =>
    stageId !== "all" && item.stage === stageId;

  const nodes = scheme.nodes.filter(isShown);
  const edges = scheme.edges.filter(isShown);
  return {
    board: {
      nodes: nodes.map(({ stage: _stage, ...node }) => node),
      edges: edges.map(({ stage: _stage, ...edge }) => edge),
    },
    highlightedIds: [...nodes, ...edges].filter(isNew).map(({ id }) => id),
  };
};
