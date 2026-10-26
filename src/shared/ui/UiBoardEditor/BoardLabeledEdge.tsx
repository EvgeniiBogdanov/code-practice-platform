import { type JSX } from "react";
import { clsx } from "clsx";
import { BaseEdge, getBezierPath, useReactFlow, type EdgeProps } from "@xyflow/react";
import type { CardFlowNode, LabeledFlowEdge } from "./boardModel";
import { LABEL_HEIGHT, LABEL_MAX_WIDTH } from "./edgeLabelLayout";
import styles from "./BoardCanvas.module.css";

const LABEL_PLACEHOLDER = "Текст";

/** An arrow with an editable caption on its middle, like a connector caption in Miro. */
export const BoardLabeledEdge = ({
  id,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<LabeledFlowEdge>): JSX.Element => {
  const { updateEdgeData } = useReactFlow<CardFlowNode, LabeledFlowEdge>();
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const label = data?.label ?? "";

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} />
      <foreignObject
        x={labelX - LABEL_MAX_WIDTH / 2}
        y={labelY - LABEL_HEIGHT / 2}
        width={LABEL_MAX_WIDTH}
        height={LABEL_HEIGHT}
      >
        <div className={styles.edgeLabelBox}>
          {/* The sizer in `data-value` makes the caption as wide as its text. */}
          <span
            className={clsx(
              styles.edgeCaption,
              !label && styles.edgeCaptionEmpty,
              selected && styles.edgeCaptionSelected
            )}
            data-value={label || LABEL_PLACEHOLDER}
          >
            <input
              className={clsx("nodrag", "nopan", styles.edgeInput)}
              aria-label="Подпись стрелки"
              title={label || undefined}
              placeholder={LABEL_PLACEHOLDER}
              value={label}
              onChange={(event) => updateEdgeData(id, { label: event.target.value })}
            />
          </span>
        </div>
      </foreignObject>
    </>
  );
};
