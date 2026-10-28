import { type JSX } from "react";
import { type EdgeProps } from "@xyflow/react";
import type { LabeledFlowEdge } from "./boardModel";
import { EdgeWithCaption } from "./EdgeWithCaption";
import styles from "./BoardCanvas.module.css";

/** An arrow of the viewer: the caption is plain text, an arrow without one stays clean. */
export const BoardStaticEdge = ({
  id,
  data,
  ...geometry
}: EdgeProps<LabeledFlowEdge>): JSX.Element => {
  const label = data?.label ?? "";

  return (
    <EdgeWithCaption id={id} {...geometry}>
      {label && <span className={styles.staticCaption}>{label}</span>}
    </EdgeWithCaption>
  );
};
