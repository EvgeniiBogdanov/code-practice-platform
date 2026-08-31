import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./UiLoader.module.css";

export type UiLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type UiLoaderVariant =
  | "primary"
  | "secondary"
  | "muted"
  | "white"
  | "accent"
  | "gray"
  | "blue";

export interface UiLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: UiLoaderSize | number;
  variant?: UiLoaderVariant;
  center?: boolean;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const STROKE_WIDTH_MAP: Record<UiLoaderSize, number> = {
  xs: 2.8,
  sm: 2.6,
  md: 2.4,
  lg: 2.2,
  xl: 2.0,
};

export const UiLoader = memo(
  ({
    size = "md",
    variant = "primary",
    center = false,
    label,
    showLabel = false,
    className,
    ...props
  }: UiLoaderProps): React.JSX.Element => {
    const isNamedSize = typeof size === "string";
    const strokeWidth = isNamedSize ? STROKE_WIDTH_MAP[size] : 2.4;
    const customStyle: React.CSSProperties | undefined = !isNamedSize
      ? { width: size, height: size }
      : undefined;

    const accessibleLabel = label ?? "Загрузка...";

    const spinner = (
      <svg
        className={clsx(styles.spinner, isNamedSize && styles[`size_${size}`])}
        style={customStyle}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className={styles.track}
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.indicator}
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray="45 15"
        />
      </svg>
    );

    return (
      <div
        role="status"
        aria-label={accessibleLabel}
        className={clsx(
          styles.container,
          styles[`variant_${variant}`],
          center && styles.center,
          className
        )}
        {...props}
      >
        {spinner}
        {showLabel && label && <span className={styles.label}>{label}</span>}
      </div>
    );
  }
);

UiLoader.displayName = "UiLoader";
