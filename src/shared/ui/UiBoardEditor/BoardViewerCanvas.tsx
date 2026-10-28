import { useEffect, useId, useMemo, type JSX } from "react";
import { clsx } from "clsx";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BoardStaticCard } from "./BoardStaticCard";
import { BoardStaticEdge } from "./BoardStaticEdge";
import { BoardViewControls } from "./BoardViewControls";
import {
  BOARD_BACKGROUND_GAP,
  DEFAULT_EDGE_OPTIONS,
  FIT_VIEW_OPTIONS,
  toFlowEdges,
  toFlowNodes,
  type CardFlowNode,
  type LabeledFlowEdge,
} from "./boardModel";
import type { BoardViewerCanvasProps } from "./boardTypes";
import styles from "./BoardCanvas.module.css";

const NODE_TYPES = { card: BoardStaticCard };
const EDGE_TYPES = { labeled: BoardStaticEdge };
/** A stable default: a new array on every render would frame the board again each time. */
const NO_HIGHLIGHTS: readonly string[] = [];
/** Tighter than in the editor: a reference has no empty space to draw in, only text to read. */
const VIEWER_FIT_OPTIONS = { ...FIT_VIEW_OPTIONS, padding: 0.05 };

const BoardViewer = ({
  value,
  highlightedIds = NO_HIGHLIGHTS,
  isFullscreen,
  onToggleFullscreen,
}: BoardViewerCanvasProps): JSX.Element => {
  // Two boards may share the page: the id keeps the arrowhead markers of this one apart.
  const flowId = useId();
  const { fitView } = useReactFlow<CardFlowNode, LabeledFlowEdge>();

  const { nodes, edges, focus } = useMemo(() => {
    const highlighted = new Set(highlightedIds);
    return {
      focus: value.nodes.filter((node) => highlighted.has(node.id)).map(({ id }) => ({ id })),
      nodes: toFlowNodes(value.nodes).map((node) => ({
        ...node,
        className: clsx(highlighted.has(node.id) && styles.highlighted),
      })),
      edges: toFlowEdges(value.edges).map((edge) => ({
        ...edge,
        className: clsx(highlighted.has(edge.id) && styles.highlighted),
      })),
    };
  }, [value, highlightedIds]);

  // Frame what is highlighted, so it is readable on a narrow board; «show all» frames the rest.
  useEffect(() => {
    void fitView({ ...VIEWER_FIT_OPTIONS, nodes: focus.length > 0 ? focus : undefined });
  }, [nodes, focus, fitView]);

  return (
    <div className={clsx(styles.board, isFullscreen && styles.fullscreen)}>
      <div className={styles.toolbar} role="toolbar" aria-label="Просмотр схемы">
        <div className={styles.toolGroup} />
        <div className={styles.toolGroup}>
          <BoardViewControls isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
        </div>
      </div>
      <div className={styles.canvas}>
        <ReactFlow<CardFlowNode, LabeledFlowEdge>
          id={flowId}
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          fitViewOptions={VIEWER_FIT_OPTIONS}
          zoomOnScroll={false}
          preventScrolling={false}
        >
          <Background gap={BOARD_BACKGROUND_GAP} />
        </ReactFlow>
        {nodes.length === 0 && <p className={styles.empty}>Схема пока пуста.</p>}
      </div>
    </div>
  );
};

export const BoardViewerCanvas = (props: BoardViewerCanvasProps): JSX.Element => (
  <ReactFlowProvider>
    <BoardViewer {...props} />
  </ReactFlowProvider>
);
