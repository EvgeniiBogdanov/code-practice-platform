import { MarkerType, type Connection, type Edge, type Node } from "@xyflow/react";
import type { BoardEdge, BoardNode, BoardValue, CardAlign } from "./boardTypes";

export type CardData = { text: string; align: CardAlign };
export type EdgeData = { label: string };
export type CardFlowNode = Node<CardData, "card">;
export type LabeledFlowEdge = Edge<EdgeData, "labeled">;

export interface BoardPoint {
  x: number;
  y: number;
}

/** Card size in board units: small by default, and the learner can resize down to the minimum. */
export const DEFAULT_CARD_WIDTH = 140;
export const DEFAULT_CARD_HEIGHT = 56;
export const MIN_CARD_WIDTH = 80;
export const MIN_CARD_HEIGHT = 40;
export const DEFAULT_CARD_ALIGN: CardAlign = "left";

/** Settings the editor and the viewer share, so a scheme looks the same in both. */
export const DEFAULT_EDGE_OPTIONS = { markerEnd: { type: MarkerType.ArrowClosed } };
export const FIT_VIEW_OPTIONS = { padding: 0.2, maxZoom: 1 };
export const BOARD_BACKGROUND_GAP = 20;

/**
 * New cards fill a grid row by row, so a few quick additions never land on top of each other.
 * The step leaves room between cards for an arrow and its caption.
 */
const GRID_COLUMNS = 3;
const GRID_STEP_X = 240;
const GRID_STEP_Y = 90;

export const toFlowNodes = (nodes: readonly BoardNode[]): CardFlowNode[] =>
  nodes.map((node) => ({
    id: node.id,
    type: "card",
    position: { x: node.x, y: node.y },
    width: node.width ?? DEFAULT_CARD_WIDTH,
    height: node.height ?? DEFAULT_CARD_HEIGHT,
    data: { text: node.text, align: node.align ?? DEFAULT_CARD_ALIGN },
  }));

/**
 * Arrows are drawn above the cards: a caption wider than the gap between close cards would
 * otherwise be cut off by them. Not saved, it is the same for every arrow.
 */
const EDGE_Z_INDEX = 1;

export const toFlowEdges = (edges: readonly BoardEdge[]): LabeledFlowEdge[] =>
  edges.map((edge) => ({
    id: edge.id,
    type: "labeled",
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    zIndex: EDGE_Z_INDEX,
    data: { label: edge.label },
  }));

/** The reverse of `toFlowNodes` / `toFlowEdges`: drops everything the library adds (selection, measurements). */
export const serializeBoard = (
  nodes: readonly CardFlowNode[],
  edges: readonly LabeledFlowEdge[]
): BoardValue => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    x: Math.round(node.position.x),
    y: Math.round(node.position.y),
    width: Math.round(node.width ?? DEFAULT_CARD_WIDTH),
    height: Math.round(node.height ?? DEFAULT_CARD_HEIGHT),
    text: node.data.text,
    align: node.data.align,
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.data?.label ?? "",
    ...(edge.sourceHandle ? { sourceHandle: edge.sourceHandle } : {}),
    ...(edge.targetHandle ? { targetHandle: edge.targetHandle } : {}),
  })),
});

/** `prefix` + the next free number: `n1`, `n2`, … never reuses the id of a deleted item still referenced. */
const nextId = (prefix: string, ids: readonly string[]): string => {
  const highest = ids.reduce((max, id) => {
    const number = Number(id.slice(prefix.length));
    return id.startsWith(prefix) && Number.isInteger(number) ? Math.max(max, number) : max;
  }, 0);
  return `${prefix}${highest + 1}`;
};

export const createBoardNode = (
  existing: readonly { id: string }[],
  origin: BoardPoint
): CardFlowNode => {
  const column = existing.length % GRID_COLUMNS;
  const row = Math.floor(existing.length / GRID_COLUMNS);
  return {
    id: nextId(
      "n",
      existing.map((node) => node.id)
    ),
    type: "card",
    position: { x: origin.x + column * GRID_STEP_X, y: origin.y + row * GRID_STEP_Y },
    width: DEFAULT_CARD_WIDTH,
    height: DEFAULT_CARD_HEIGHT,
    data: { text: "", align: DEFAULT_CARD_ALIGN },
  };
};

/** The arrow for a new connection, or `null` for a self-loop or a pair that is already connected. */
export const createBoardEdge = (
  existing: readonly LabeledFlowEdge[],
  connection: Connection
): LabeledFlowEdge | null => {
  const { source, target, sourceHandle, targetHandle } = connection;
  if (source === target) return null;
  if (existing.some((edge) => edge.source === source && edge.target === target)) return null;
  return {
    id: nextId(
      "e",
      existing.map((edge) => edge.id)
    ),
    type: "labeled",
    source,
    target,
    sourceHandle,
    targetHandle,
    zIndex: EDGE_Z_INDEX,
    data: { label: "" },
  };
};
