import { lazy, type JSX } from "react";
import { BoardFrame } from "./BoardFrame";
import type { UiBoardEditorProps } from "./boardTypes";

const BoardCanvas = lazy(() =>
  import("./BoardCanvas").then((module) => ({ default: module.BoardCanvas }))
);

/** A board for drawing cards and arrows with text; the value is plain JSON the caller persists. */
export const UiBoardEditor = (props: UiBoardEditorProps): JSX.Element => (
  <BoardFrame label={props.label}>
    {({ isFullscreen, toggleFullscreen }) => (
      <BoardCanvas {...props} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
    )}
  </BoardFrame>
);
