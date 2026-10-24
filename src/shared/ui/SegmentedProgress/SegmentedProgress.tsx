import React from "react";
import { clsx } from "clsx";
import styles from "./SegmentedProgress.module.css";

export type ProgressSegmentTone = "success" | "danger" | "warning" | "accent" | "neutral";

export interface SegmentedProgressProps {
  /** One entry per step, in order. */
  segments: readonly ProgressSegmentTone[];
  /** Accessible name, e.g. "Пройдено тестов". */
  label: string;
  /** Reported progress when the segments are a scale, not steps: e.g. 42 of 100. */
  value?: { now: number; max: number };
  className?: string;
}

/** A progress bar split into one segment per step, each coloured by its own outcome. */
export const SegmentedProgress = ({
  segments,
  label,
  value,
  className,
}: SegmentedProgressProps): React.JSX.Element => (
  <div
    className={clsx(styles.bar, className)}
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={value?.max ?? segments.length}
    aria-valuenow={value?.now ?? segments.filter((tone) => tone === "success").length}
  >
    {segments.map((tone, index) => (
      <span key={index} className={clsx(styles.segment, styles[tone])} />
    ))}
  </div>
);
