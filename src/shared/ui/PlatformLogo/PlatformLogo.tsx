import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./PlatformLogo.module.css";

export interface PlatformLogoProps extends Omit<React.SVGAttributes<SVGSVGElement>, "size"> {
  size?: number | "sm" | "md" | "lg" | string;
  className?: string;
  withBackground?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  sm: 20,
  md: 28,
  lg: 36,
};

export const PlatformLogo = memo(
  ({
    size = "md",
    className,
    withBackground = true,
    ...restProps
  }: PlatformLogoProps): React.JSX.Element => {
    const resolvedSize =
      typeof size === "number"
        ? size
        : size in SIZE_MAP
          ? SIZE_MAP[size]
          : typeof size === "string" && !isNaN(Number(size)) && size.trim() !== ""
            ? Number(size)
            : size || 28;

    return (
      <svg
        width={resolvedSize}
        height={resolvedSize}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(
          styles.logoSvg,
          !withBackground && styles.noBackground,
          className
        )}
        aria-hidden="true"
        {...restProps}
      >
        {withBackground && (
          /* Main Notion-style squircle card */
          <rect
            width="28"
            height="28"
            rx="4"
            className={styles.bgRect}
          />
        )}

        {/* Left code bracket < */}
        <path
          d="M7.5 9.5L3.5 14L7.5 18.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right code bracket > */}
        <path
          d="M20.5 9.5L24.5 14L20.5 18.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Practice Slash */}
        <path
          d="M16 7.5L12 20.5"
          className={styles.logoStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

PlatformLogo.displayName = "PlatformLogo";
