import { type JSX } from "react";
import { clsx } from "clsx";
import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import {
  MIN_CARD_HEIGHT,
  MIN_CARD_WIDTH,
  type CardFlowNode,
  type LabeledFlowEdge,
} from "./boardModel";
import { CardAlignToolbar } from "./CardAlignToolbar";
import styles from "./BoardCanvas.module.css";

const SIDES: readonly { id: string; position: Position }[] = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
];

/** A resizable card with editable text, a text-position panel when selected and a connection point on every side. */
export const BoardCardNode = ({ id, data, selected }: NodeProps<CardFlowNode>): JSX.Element => {
  const { updateNodeData } = useReactFlow<CardFlowNode, LabeledFlowEdge>();

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={MIN_CARD_WIDTH} minHeight={MIN_CARD_HEIGHT} />
      <NodeToolbar position={Position.Top}>
        <CardAlignToolbar value={data.align} onChange={(align) => updateNodeData(id, { align })} />
      </NodeToolbar>
      <div className={clsx(styles.card, selected && styles.selected)}>
        {SIDES.map((side) => (
          <Handle
            key={side.id}
            id={side.id}
            type="source"
            position={side.position}
            className={styles.handle}
          />
        ))}
        <textarea
          className={clsx(
            "nodrag",
            "nowheel",
            styles.text,
            data.align === "center" && styles.alignCenter,
            data.align === "right" && styles.alignRight
          )}
          aria-label="Текст карточки"
          placeholder="Текст"
          value={data.text}
          onChange={(event) => updateNodeData(id, { text: event.target.value })}
        />
      </div>
    </>
  );
};
