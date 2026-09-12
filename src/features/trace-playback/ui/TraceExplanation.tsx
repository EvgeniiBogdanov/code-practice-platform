import type { JSX } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import type { TraceExplanationProps } from "../model/trace-view";
import styles from "./TraceExplanation.module.css";

export const TraceExplanation = ({ step, playing }: TraceExplanationProps): JSX.Element => (
  <div className={styles.explanation} aria-live={playing ? "off" : "polite"} aria-atomic="true">
    <div className={styles.explanationHeading}>
      {step.result === false ? (
        <X size={16} />
      ) : step.result !== undefined ? (
        <Check size={16} />
      ) : (
        <ArrowRight size={16} />
      )}
      <h3>{step.title}</h3>
      {step.formula && <output className={styles.formula}>{step.formula}</output>}
    </div>
    <p>{step.explanation}</p>
    {step.structure && step.result !== undefined && (
      <output className={styles.result} aria-label="Результат алгоритма">
        {JSON.stringify(step.result)}
      </output>
    )}
    {step.found && step.found.length > 0 && (
      <div className={styles.found}>
        <span>Найдено:</span>
        {step.found.map((tuple) => (
          <code key={tuple.join(",")}>[{tuple.join(", ")}]</code>
        ))}
      </div>
    )}
  </div>
);
