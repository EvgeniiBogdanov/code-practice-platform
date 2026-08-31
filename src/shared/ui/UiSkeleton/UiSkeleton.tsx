import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./UiSkeleton.module.css";

export type UiSkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type UiSkeletonAnimation = "shimmer" | "pulse" | "none";

export interface UiSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: UiSkeletonVariant;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  animation?: UiSkeletonAnimation;
  lines?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const UiSkeleton = memo(
  ({
    variant = "rounded",
    width,
    height,
    radius,
    animation = "shimmer",
    lines = 1,
    className,
    style,
    ...props
  }: UiSkeletonProps): React.JSX.Element => {
    const customStyle: React.CSSProperties = {
      ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
      ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
      ...(radius !== undefined ? { borderRadius: typeof radius === "number" ? `${radius}px` : radius } : {}),
      ...style,
    };

    const skeletonClass = clsx(
      styles.skeleton,
      styles[`variant_${variant}`],
      styles[`animation_${animation}`],
      className
    );

    if (lines > 1) {
      return (
        <div className={styles.linesContainer} aria-hidden="true">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={skeletonClass}
              style={customStyle}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        className={skeletonClass}
        style={customStyle}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

UiSkeleton.displayName = "UiSkeleton";
