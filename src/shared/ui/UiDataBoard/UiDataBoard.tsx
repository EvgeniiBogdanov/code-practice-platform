import { memo, type JSX } from "react";
import { clsx } from "clsx";
import styles from "./UiDataBoard.module.css";

interface UiDataBoardProps {
  readonly label: string;
  readonly variant: "buckets" | "window" | "prefix" | "balance" | "search";
  readonly entries: readonly {
    readonly key: string;
    readonly value: string;
    readonly active?: boolean;
    readonly tone?: "primary" | "secondary" | "anchor";
  }[];
  readonly reducedMotion?: boolean;
}

export const UiDataBoard = memo(
  ({ label, variant, entries, reducedMotion = false }: UiDataBoardProps): JSX.Element => (
    <section
      aria-label={label}
      className={clsx(styles.board, styles[variant], reducedMotion && styles.still)}
    >
      <h4 className={styles.heading}>{label}</h4>
      <dl className={styles.entries}>
        {entries.map((entry) => (
          <div
            key={entry.key}
            className={clsx(
              styles.entry,
              entry.active && styles.active,
              entry.tone && styles[entry.tone]
            )}
          >
            <dt>{entry.key === "" ? '""' : entry.key === " " ? "␣" : entry.key}</dt>
            <dd>{entry.value === "" ? '""' : entry.value === " " ? "␣" : entry.value}</dd>
          </div>
        ))}
      </dl>
      {!entries.length && <p className={styles.empty}>∅ Пока пусто</p>}
    </section>
  )
);
