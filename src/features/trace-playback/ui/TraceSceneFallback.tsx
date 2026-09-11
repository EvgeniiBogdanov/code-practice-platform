import type { JSX } from "react";
import { clsx } from "clsx";
import { Button } from "@/shared/ui";
import type { TraceFallbackProps } from "../model/trace-view";
import styles from "./TraceScene.module.css";

export const TraceSceneFallback = ({ step, onRetry }: TraceFallbackProps): JSX.Element => (
  <div className={styles.fallback}>
    <ol className={styles.fallbackArray} aria-label="Массив по индексам">
      {step.values.map((value, index) => (
        <li
          key={`slot-${index}`}
          className={clsx(
            styles.fallbackCell,
            step.focus?.includes(index) && styles.focusCell,
            step.settled?.includes(index) && styles.settledCell,
            step.dimmed?.includes(index) && styles.dimmedCell,
            step.band && index >= step.band.start && index <= step.band.end && styles.bandCell,
            step.shape === "token" && styles.tokenCell,
            step.shape === "diamond" && styles.searchCell
          )}
        >
          <span>{value === " " ? "␣" : value}</span>
          <small>{index}</small>
        </li>
      ))}
    </ol>
    <p className={styles.muted}>
      3D недоступно. Пошаговый разбор продолжает работать.{" "}
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Повторить 3D
      </Button>
    </p>
  </div>
);
