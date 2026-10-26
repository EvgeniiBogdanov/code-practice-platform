export type CardAlign = "left" | "center" | "right";

/** A card on the board: its top-left corner in board coordinates, its size and the text inside. */
export interface BoardNode {
  id: string;
  x: number;
  y: number;
  /** Absent in boards saved before cards became resizable: the default size applies. */
  width?: number;
  height?: number;
  text: string;
  /** Absent in boards saved before the alignment was added: the text is aligned left. */
  align?: CardAlign;
}

/** An arrow between two cards; `label` is the caption written on it. */
export interface BoardEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  /** Side of the card the arrow leaves from / enters, so a reload keeps the same attachment points. */
  sourceHandle?: string;
  targetHandle?: string;
}

/** The persisted board: plain JSON, independent of the drawing library. */
export interface BoardValue {
  nodes: readonly BoardNode[];
  edges: readonly BoardEdge[];
}

export interface UiBoardEditorProps {
  value: BoardValue;
  onChange: (value: BoardValue) => void;
  /** Accessible name of the whole editor. */
  label: string;
}

/** What the canvas needs on top of the editor props: the fullscreen state owned by the wrapper. */
export interface BoardCanvasProps extends UiBoardEditorProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}
