import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./TaskButton.module.css";

export type TaskButtonStatus = "solved" | "unsolved" | "idle";

export interface TaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Target status variant for the button: 'solved' (green active) | 'unsolved' (red active) | 'idle' */
  statusVariant?: TaskButtonStatus;
  /** Whether the status is currently active/selected */
  isActive?: boolean;
  /** Accent color to match folder/topic color (e.g. #f59e0b, #3b82f6, #a855f7) */
  accentColor?: string;
}

export const TaskButton = forwardRef<HTMLButtonElement, TaskButtonProps>(
  (
    {
      statusVariant = "idle",
      isActive = false,
      accentColor,
      className,
      children,
      disabled,
      type = "button",
      style,
      ...props
    },
    ref
  ) => {
    const activeClass =
      isActive && statusVariant === "solved"
        ? styles.solvedActive
        : isActive && statusVariant === "unsolved"
          ? styles.unsolvedActive
          : undefined;

    const classNames = clsx(styles.taskButton, activeClass, className);

    const dynamicStyle: React.CSSProperties = {
      ...(accentColor
        ? ({
            "--task-btn-accent": accentColor,
            "--task-btn-hover-bg": `${accentColor}18`,
          } as React.CSSProperties)
        : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled}
        aria-pressed={isActive ? true : undefined}
        style={dynamicStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TaskButton.displayName = "TaskButton";
