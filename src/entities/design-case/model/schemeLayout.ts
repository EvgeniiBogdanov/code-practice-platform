import type { DesignScheme, RadioStageId } from "./types";

type SchemeNode = DesignScheme["nodes"][number];
type SchemeEdge = DesignScheme["edges"][number];
type Side = "top" | "right" | "bottom" | "left";

/**
 * Reference cards sit on a grid: a cell is a card plus the gap an arrow and its caption need.
 * The first line of a card is its title, the rest are short details (about 26 characters a line).
 */
const CELL_WIDTH = 280;
const CELL_HEIGHT = 140;
const CARD_WIDTH = 200;
const LINE_HEIGHT = 18;
const CARD_PADDING = 16;

export const card = (
  stage: RadioStageId,
  id: string,
  [column, row]: readonly [number, number],
  lines: readonly string[]
): SchemeNode => ({
  id,
  stage,
  x: column * CELL_WIDTH,
  y: row * CELL_HEIGHT,
  width: CARD_WIDTH,
  height: lines.length * LINE_HEIGHT + CARD_PADDING,
  text: lines.join("\n"),
});

export const arrow = (
  stage: RadioStageId,
  source: string,
  target: string,
  label: string,
  [sourceHandle, targetHandle]: readonly [Side, Side] = ["right", "left"]
): SchemeEdge => ({
  id: `${source}->${target}`,
  stage,
  source,
  target,
  label,
  sourceHandle,
  targetHandle,
});
