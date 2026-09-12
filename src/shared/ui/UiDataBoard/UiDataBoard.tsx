import { memo, type JSX } from "react";
import { clsx } from "clsx";
import styles from "./UiDataBoard.module.css";

interface UiDataBoardPlaceholder {
  readonly key?: string;
  readonly value?: string;
  readonly label?: string;
}

interface UiDataBoardProps {
  readonly label: string;
  readonly variant: "buckets" | "window" | "prefix" | "balance" | "search" | "sequence";
  readonly entries: readonly {
    readonly key: string;
    readonly value: string;
    readonly active?: boolean;
    readonly tone?: "primary" | "secondary" | "anchor";
  }[];
  readonly placeholders?: readonly (UiDataBoardPlaceholder | undefined)[];
  readonly minSlots?: number;
  readonly reducedMotion?: boolean;
}

export type { UiDataBoardProps, UiDataBoardPlaceholder };

export const UiDataBoard = memo(
  ({
    label,
    variant,
    entries,
    placeholders,
    minSlots,
    reducedMotion = false,
  }: UiDataBoardProps): JSX.Element => {
    const totalSlots = Math.max(
      entries.length,
      minSlots ?? 0,
      placeholders?.length ?? 0,
      1
    );

    const remainingCount = Math.max(0, totalSlots - entries.length);

    return (
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
          {Array.from({ length: remainingCount }, (_, offset) => {
            const index = entries.length + offset;
            const placeholder = placeholders?.[index];
            const isCompletelyEmpty = entries.length === 0 && !placeholders?.length && !minSlots;

            const keyText = isCompletelyEmpty
              ? "∅"
              : placeholder?.key !== undefined
                ? placeholder.key === ""
                  ? '""'
                  : placeholder.key === " "
                    ? "␣"
                    : placeholder.key
                : "—";

            const valueText = isCompletelyEmpty
              ? "пусто"
              : placeholder?.value !== undefined
                ? placeholder.value === ""
                  ? '""'
                  : placeholder.value === " "
                    ? "␣"
                    : placeholder.value
                : "—";

            return (
              <div
                key={`placeholder-${index}`}
                className={clsx(
                  styles.entry,
                  styles.placeholder,
                  isCompletelyEmpty && styles.emptyPlaceholder
                )}
                aria-hidden="true"
              >
                <dt>{keyText}</dt>
                <dd>{valueText}</dd>
              </div>
            );
          })}
        </dl>
      </section>
    );
  }
);
