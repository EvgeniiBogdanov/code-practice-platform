import { type JSX } from "react";
import { clsx } from "clsx";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { CardFlowNode } from "./boardModel";
import styles from "./BoardCanvas.module.css";

const SIDES: readonly { id: string; position: Position }[] = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
];

/** A card of the viewer: plain text, no editing. The hidden handles are where the arrows attach. */
export const BoardStaticCard = ({ data }: NodeProps<CardFlowNode>): JSX.Element => (
  <div className={styles.card}>
    {SIDES.map((side) => (
      <Handle
        key={side.id}
        id={side.id}
        type="source"
        position={side.position}
        isConnectable={false}
        className={styles.hiddenHandle}
      />
    ))}
    <p
      className={clsx(
        styles.staticText,
        data.align === "center" && styles.alignCenter,
        data.align === "right" && styles.alignRight
      )}
    >
      {data.text}
    </p>
  </div>
);
