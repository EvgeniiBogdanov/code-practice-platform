import React from "react";
import { clsx } from "clsx";
import type { TextRange } from "../../lib/multiCursorOperations";
import styles from "./TextMarkLayer.module.css";

export interface TextMarkLayerProps {
  code: string;
  /** Ranges to mark; empty ranges (bare carets) are skipped. */
  marks: ReadonlyArray<TextRange>;
  /** `find` for search matches, `selection` for the extra selections of a multi-cursor edit. */
  variant: "find" | "selection";
  /** The range the editor selection sits on; drawn stronger than the others (find only). */
  active?: TextRange | null;
}

/** Marks ranges character by character, behind the highlighted code. */
export const TextMarkLayer = ({
  code,
  marks,
  variant,
  active = null,
}: TextMarkLayerProps): React.JSX.Element | null => {
  const ranges = [...marks]
    .filter((range) => range.end > range.start && range.start < code.length)
    .sort((a, b) => a.start - b.start);
  if (ranges.length === 0) return null;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    // Overlapping ranges would repeat text and shift every mark after them.
    if (range.start < cursor) continue;
    if (range.start > cursor) parts.push(code.slice(cursor, range.start));
    const isActive = active?.start === range.start && active.end === range.end;
    parts.push(
      <mark
        key={range.start}
        className={clsx(styles.mark, styles[variant], isActive && styles.active)}
      >
        {code.slice(range.start, range.end)}
      </mark>
    );
    cursor = range.end;
  }
  parts.push(code.slice(cursor), "\n");
  return (
    <span className={styles.layer} aria-hidden="true">
      {parts}
    </span>
  );
};
