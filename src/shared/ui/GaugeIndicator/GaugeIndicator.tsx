import React from "react";
import { clsx } from "clsx";
import { Tooltip } from "../Tooltip";
import styles from "./GaugeIndicator.module.css";

export interface GaugeIndicatorProps {
  /**
   * Probability value from 0 to 100
   */
  value: number;
  /**
   * Size in pixels (width and height). Defaults to 14.
   */
  size?: number;
  className?: string;
  title?: string;
  "aria-label"?: string;
}

// 4 equal 65-degree outer arc sectors spanning 260 degrees (-130 deg to +130 deg)
// Seg 1: Gray (0% - 25%)
const ARC_PATH_SEG_1 =
  "M 16.29 78.28 A 44 44 0 0 1 10.12 31.41 L 24.62 38.17 A 28 28 0 0 0 28.55 68.00 Z";
// Seg 2: Orange (25% - 50%)
const ARC_PATH_SEG_2 =
  "M 10.12 31.41 A 44 44 0 0 1 50.00 6.00 L 50.00 22.00 A 28 28 0 0 0 24.62 38.17 Z";
// Seg 3: Yellow (50% - 75%)
const ARC_PATH_SEG_3 =
  "M 50.00 6.00 A 44 44 0 0 1 89.88 31.41 L 75.38 38.17 A 28 28 0 0 0 50.00 22.00 Z";
// Seg 4: Green (75% - 100%)
const ARC_PATH_SEG_4 =
  "M 89.88 31.41 A 44 44 0 0 1 83.71 78.28 L 71.45 68.00 A 28 28 0 0 0 75.38 38.17 Z";

const calculateNeedleAngle = (value: number): number => {
  const normalized = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return -130 + (normalized / 100) * 260;
};

export const GaugeIndicator = ({
  value,
  size = 14,
  className,
  title,
  "aria-label": ariaLabel,
}: GaugeIndicatorProps): React.JSX.Element => {
  const needleAngle = calculateNeedleAngle(value);

  const indicator = (
    <span
      className={clsx(styles.gaugeContainer, className)}
      role="img"
      aria-label={ariaLabel ?? `Индикатор вероятности: ${Math.round(value)}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.gaugeSvg}
      >
        {/* 4 Outer Colored Arc Segments: Gray -> Orange -> Yellow -> Green */}
        <path d={ARC_PATH_SEG_1} className={styles.seg1} />
        <path d={ARC_PATH_SEG_2} className={styles.seg2} />
        <path d={ARC_PATH_SEG_3} className={styles.seg3} />
        <path d={ARC_PATH_SEG_4} className={styles.seg4} />

        {/* Inner concentric background tracks */}
        <circle cx="50" cy="50" r="22" className={styles.innerRing} />
        <circle cx="50" cy="50" r="16" className={styles.innerDial} />

        {/* Dynamic needle with rotation */}
        <g transform={`rotate(${needleAngle.toFixed(1)}, 50, 50)`}>
          <path d="M 44 50 A 6 6 0 0 0 56 50 L 52 14 A 2 2 0 0 0 48 14 Z" className={styles.needle} />
          <circle cx="50" cy="50" r="2.5" className={styles.pivotDot} />
        </g>
      </svg>
    </span>
  );

  if (title) {
    return (
      <Tooltip content={title} side="top">
        {indicator}
      </Tooltip>
    );
  }

  return indicator;
};

GaugeIndicator.displayName = "GaugeIndicator";
