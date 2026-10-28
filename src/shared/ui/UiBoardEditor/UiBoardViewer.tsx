import { lazy, type JSX } from "react";
import { BoardFrame } from "./BoardFrame";
import type { UiBoardViewerProps } from "./boardTypes";

const BoardViewerCanvas = lazy(() =>
  import("./BoardViewerCanvas").then((module) => ({ default: module.BoardViewerCanvas }))
);

/** A read-only board: the same cards and arrows as the editor, with pan, zoom and fullscreen. */
export const UiBoardViewer = (props: UiBoardViewerProps): JSX.Element => (
  <BoardFrame label={props.label}>
    {({ isFullscreen, toggleFullscreen }) => (
      <BoardViewerCanvas
        {...props}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    )}
  </BoardFrame>
);
