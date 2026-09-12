import type { JSX } from "react";
import { clsx } from "clsx";
import type { TraceExplanationProps } from "../model/trace-view";
import styles from "./TraceScene.module.css";

export const TracePointerLegend = ({ step }: Pick<TraceExplanationProps, "step">): JSX.Element => {
  const hasContent = step.pointers.length > 0 || Boolean(step.settled?.length);

  return (
    <div className={styles.pointerLegend} aria-label="Указатели">
      {step.pointers.map((pointer) => (
        <span key={pointer.label} className={clsx(styles.pointer, styles[pointer.tone])}>
          <b>{pointer.label}</b>
          <span>[{pointer.index}]</span>
          <span>
            ={" "}
            {step.values[pointer.index] === undefined
              ? "за границей"
              : JSON.stringify(step.values[pointer.index])}
          </span>
        </span>
      ))}
      {Boolean(step.settled?.length) && <span className={styles.settledLegend}>Готовая часть</span>}
      {!hasContent && (
        <span className={clsx(styles.pointer, styles.pointerPlaceholder)} aria-hidden="true">
          <span>—</span>
        </span>
      )}
    </div>
  );
};
