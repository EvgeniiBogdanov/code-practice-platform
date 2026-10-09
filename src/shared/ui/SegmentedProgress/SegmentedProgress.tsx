import React from "react";
import { clsx } from "clsx";
import styles from "./SegmentedProgress.module.css";

export type ProgressSegmentTone = "success" | "danger" | "neutral";

export interface SegmentedProgressProps {
  /** One entry per step, in order. */
  segments: readonly ProgressSegmentTone[];
  /** Accessible name, e.g. "Пройдено тестов". */
  label: string;
  className?: string;
}

/** A progress bar split into one segment per step, each coloured by its own outcome. */
export const SegmentedProgress = ({
  segments,
  label,
  className,
}: SegmentedProgressProps): React.JSX.Element => (
  <div
    className={clsx(styles.bar, className)}
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={segments.length}
    aria-valuenow={segments.filter((tone) => tone === "success").length}
  >
    {segments.map((tone, index) => (
      <span key={index} className={clsx(styles.segment, styles[tone])} />
    ))}
  </div>
);
