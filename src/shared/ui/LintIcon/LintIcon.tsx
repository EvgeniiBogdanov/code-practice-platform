import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./LintIcon.module.css";

export interface LintIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
}

/** Строки кода с волнистым подчёркиванием — как диагностика ошибок в редакторе. Стиль совпадает с lucide. */
export const LintIcon = memo(
  ({
    size = 24,
    strokeWidth = 2,
    className,
    "aria-label": ariaLabel,
    ...restProps
  }: LintIconProps): React.JSX.Element => {
    const isAriaHidden =
      ariaLabel === undefined && restProps["aria-hidden"] === undefined
        ? true
        : restProps["aria-hidden"];

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx(styles.icon, className)}
        aria-label={ariaLabel}
        aria-hidden={isAriaHidden}
        {...restProps}
      >
        <path d="M3 6h18" />
        <path d="M3 11h11" />
        <path d="M3 19l3-3 3 3 3-3 3 3 3-3 3 3" />
      </svg>
    );
  }
);

LintIcon.displayName = "LintIcon";
