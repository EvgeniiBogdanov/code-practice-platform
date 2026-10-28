import { type JSX, type ReactNode } from "react";
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";
import type { LabeledFlowEdge } from "./boardModel";
import { LABEL_HEIGHT, LABEL_MAX_WIDTH } from "./edgeLabelLayout";
import styles from "./BoardCanvas.module.css";

type EdgeWithCaptionProps = Pick<
  EdgeProps<LabeledFlowEdge>,
  | "id"
  | "sourceX"
  | "sourceY"
  | "targetX"
  | "targetY"
  | "sourcePosition"
  | "targetPosition"
  | "markerEnd"
> & {
  /** The caption drawn on the middle of the arrow. */
  children: ReactNode;
};

/** A curved arrow with a caption box on its middle: the editor puts an input there, the viewer plain text. */
export const EdgeWithCaption = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  children,
}: EdgeWithCaptionProps): JSX.Element => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} />
      <foreignObject
        x={labelX - LABEL_MAX_WIDTH / 2}
        y={labelY - LABEL_HEIGHT / 2}
        width={LABEL_MAX_WIDTH}
        height={LABEL_HEIGHT}
      >
        <div className={styles.edgeLabelBox}>{children}</div>
      </foreignObject>
    </>
  );
};
