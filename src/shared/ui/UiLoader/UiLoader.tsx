import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./UiLoader.module.css";

export type UiLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type UiLoaderVariant =
  "primary" | "secondary" | "muted" | "white" | "accent" | "gray" | "blue";

export interface UiLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: UiLoaderSize | number;
  variant?: UiLoaderVariant;
  center?: boolean;
  fullscreen?: boolean;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

/** Overall height of the loader; one bar unit is 1/48 of it. */
const BOX_UNITS = 48;

export const UiLoader = memo(
  ({
    size = "md",
    variant = "gray",
    center = false,
    fullscreen = false,
    label,
    showLabel = false,
    className,
    ...props
  }: UiLoaderProps): React.JSX.Element => {
    const isNamedSize = typeof size === "string";
    const customStyle: React.CSSProperties | undefined = isNamedSize
      ? undefined
      : ({ "--size": `${size / BOX_UNITS}px` } as React.CSSProperties);

    const accessibleLabel = label ?? "Загрузка...";

    const spinner = (
      <span
        className={clsx(styles.spinner, isNamedSize && styles[`size_${size}`])}
        style={customStyle}
        aria-hidden="true"
      >
        <span className={styles.bars} />
      </span>
    );

    return (
      <div
        role="status"
        aria-label={accessibleLabel}
        className={clsx(
          styles.container,
          styles[`variant_${variant}`],
          center && styles.center,
          fullscreen && styles.fullscreen,
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
