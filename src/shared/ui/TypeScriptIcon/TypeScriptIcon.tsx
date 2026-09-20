import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./TypeScriptIcon.module.css";

export interface TypeScriptIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

const TS_LETTERS_PATH =
  "M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067z M4.96 11.031h8.448v1.7H10.134v9.16H8.234v-9.16H4.96z";

export const TypeScriptIcon = memo(
  ({
    size = 24,
    className,
    color,
    "aria-label": ariaLabel,
    ...restProps
  }: TypeScriptIconProps): React.JSX.Element => {
    const isAriaHidden =
      ariaLabel === undefined && restProps["aria-hidden"] === undefined
        ? true
        : restProps["aria-hidden"];

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(styles.icon, className)}
        color={color}
        aria-label={ariaLabel}
        aria-hidden={isAriaHidden}
        {...restProps}
      >
        <rect width="24" height="24" rx="3.5" className={styles.bg} />
        <path d={TS_LETTERS_PATH} className={styles.letters} />
      </svg>
    );
  }
);

TypeScriptIcon.displayName = "TypeScriptIcon";
