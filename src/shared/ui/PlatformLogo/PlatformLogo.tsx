import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./PlatformLogo.module.css";

export interface PlatformLogoProps {
  size?: number | "sm" | "md" | "lg";
  className?: string;
  withBackground?: boolean;
}

const SIZE_MAP = {
  sm: 20,
  md: 28,
  lg: 36,
} as const;

export const PlatformLogo = memo(
  ({
    size = "md",
    className,
    withBackground = true,
  }: PlatformLogoProps): React.JSX.Element => {
    const numericSize = typeof size === "number" ? size : SIZE_MAP[size] || 28;

    return (
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(styles.logoSvg, className)}
        aria-hidden="true"
      >
        {withBackground && (
          <>
            {/* Notion subtle bottom elevation */}
            <rect
              x="2"
              y="3"
              width="28"
              height="27"
              rx="7"
              className={styles.shadowRect}
            />
            {/* Main squircle card */}
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="7"
              strokeWidth="1.2"
              className={styles.bgRect}
            />
          </>
        )}

        {/* Left code bracket < */}
        <path
          d="M9.5 11.5L5.5 16L9.5 20.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right code bracket > */}
        <path
          d="M22.5 11.5L26.5 16L22.5 20.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Practice Slash */}
        <path
          d="M18 9.5L14 22.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Practice Core Node */}
        <circle
          cx="16"
          cy="16"
          r="1.4"
          className={styles.logoDot}
        />
      </svg>
    );
  }
);

PlatformLogo.displayName = "PlatformLogo";
