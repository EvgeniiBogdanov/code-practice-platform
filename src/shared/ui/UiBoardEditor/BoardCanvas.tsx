import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { Plus, Redo2, Trash2, Undo2 } from "lucide-react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "../Button";
import { BoardCardNode } from "./BoardCardNode";
import { BoardLabeledEdge } from "./BoardLabeledEdge";
import { BoardViewControls } from "./BoardViewControls";
import {
  BOARD_BACKGROUND_GAP,
  DEFAULT_EDGE_OPTIONS,
  FIT_VIEW_OPTIONS,
  createBoardEdge,
  createBoardNode,
  toFlowEdges,
  toFlowNodes,
  type CardFlowNode,
  type LabeledFlowEdge,
} from "./boardModel";
import type { BoardCanvasProps, BoardValue } from "./boardTypes";
import { useBoardCommit } from "./useBoardCommit";
import { useBoardHistory } from "./useBoardHistory";
import styles from "./BoardCanvas.module.css";

const NODE_TYPES = { card: BoardCardNode };
const EDGE_TYPES = { labeled: BoardLabeledEdge };
const DELETE_KEYS = ["Backspace", "Delete"];
/** Where a new card appears, measured from the top-left corner of the visible area. */
const NEW_CARD_MARGIN = 40;
const ICON_SIZE = 16;

const BoardEditor = ({
  value,
  onChange,
  isFullscreen,
  onToggleFullscreen,
}: BoardCanvasProps): JSX.Element => {
  const [initial] = useState(() => ({
    nodes: toFlowNodes(value.nodes),
    edges: toFlowEdges(value.edges),
  }));
  const [nodes, setNodes, onNodesChange] = useNodesState<CardFlowNode>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<LabeledFlowEdge>(initial.edges);
  const [hasSelection, setHasSelection] = useState(false);
  const { getViewport, deleteElements, getNodes, getEdges } = useReactFlow<
    CardFlowNode,
    LabeledFlowEdge
  >();

  const applyBoard = useCallback(
    (board: BoardValue): void => {
      setNodes(toFlowNodes(board.nodes));
      setEdges(toFlowEdges(board.edges));
    },
    [setNodes, setEdges]
  );

  useBoardCommit(nodes, edges, onChange);
  const { undo, redo, canUndo, canRedo } = useBoardHistory(nodes, edges, applyBoard);

  const addCard = useCallback((): void => {
    const { x, y, zoom } = getViewport();
    const origin = { x: -x / zoom + NEW_CARD_MARGIN, y: -y / zoom + NEW_CARD_MARGIN };
    setNodes((current) => [...current, createBoardNode(current, origin)]);
  }, [getViewport, setNodes]);

  const removeSelected = useCallback((): void => {
    void deleteElements({
      nodes: getNodes().filter((node) => node.selected),
      edges: getEdges().filter((edge) => edge.selected),
    });
  }, [deleteElements, getNodes, getEdges]);

  const onConnect = useCallback(
    (connection: Connection): void => {
      setEdges((current) => {
        const edge = createBoardEdge(current, connection);
        return edge ? [...current, edge] : current;
      });
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams): void =>
      setHasSelection(selectedNodes.length > 0 || selectedEdges.length > 0),
    []
  );

  /** Ctrl/⌘+Z undoes and Ctrl/⌘+Shift+Z or Ctrl+Y redoes; inside a text field the browser keeps its own text undo. */
  const canvasRef = useRef<HTMLDivElement>(null);
  const onKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );

  // A click on empty space focuses the canvas, so the shortcuts work there too, not only after a card click.
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.addEventListener("keydown", onKeyDown);
    return (): void => canvas?.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const focusCanvas = useCallback((): void => canvasRef.current?.focus(), []);

  return (
    <div className={clsx(styles.board, isFullscreen && styles.fullscreen)}>
      <div className={styles.toolbar} role="toolbar" aria-label="Инструменты схемы">
        <div className={styles.toolGroup}>
          <Button size="sm" leftIcon={<Plus size={ICON_SIZE} />} onClick={addCard}>
            Добавить карточку
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Trash2 size={ICON_SIZE} />}
            onClick={removeSelected}
            disabled={!hasSelection}
          >
            Удалить выбранное
          </Button>
        </div>
        <div className={styles.toolGroup}>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Отменить"
            title="Отменить (Ctrl/⌘+Z)"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 size={ICON_SIZE} />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Вернуть"
            title="Вернуть (Ctrl/⌘+Shift+Z)"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 size={ICON_SIZE} />
          </Button>
          <BoardViewControls isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
        </div>
      </div>
      <div ref={canvasRef} tabIndex={-1} className={styles.canvas}>
        <ReactFlow<CardFlowNode, LabeledFlowEdge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onPaneClick={focusCanvas}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={DELETE_KEYS}
          fitView={initial.nodes.length > 0}
          fitViewOptions={FIT_VIEW_OPTIONS}
          zoomOnScroll={false}
          preventScrolling={false}
        >
          <Background gap={BOARD_BACKGROUND_GAP} />
        </ReactFlow>
        {nodes.length === 0 && (
          <p className={styles.empty}>
            Добавьте карточку и соедините карточки стрелками: потяните за точку на краю карточки.
          </p>
        )}
      </div>
    </div>
  );
};

export const BoardCanvas = (props: BoardCanvasProps): JSX.Element => (
  <ReactFlowProvider>
    <BoardEditor {...props} />
  </ReactFlowProvider>
);
