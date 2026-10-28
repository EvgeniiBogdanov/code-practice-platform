import { type JSX } from "react";
import { clsx } from "clsx";
import { useReactFlow, type EdgeProps } from "@xyflow/react";
import type { CardFlowNode, LabeledFlowEdge } from "./boardModel";
import { EdgeWithCaption } from "./EdgeWithCaption";
import styles from "./BoardCanvas.module.css";

const LABEL_PLACEHOLDER = "Текст";

/** An arrow with an editable caption on its middle, like a connector caption in Miro. */
export const BoardLabeledEdge = ({
  id,
  selected,
  data,
  ...geometry
}: EdgeProps<LabeledFlowEdge>): JSX.Element => {
  const { updateEdgeData } = useReactFlow<CardFlowNode, LabeledFlowEdge>();
  const label = data?.label ?? "";

  return (
    <EdgeWithCaption id={id} {...geometry}>
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
    </EdgeWithCaption>
  );
};
