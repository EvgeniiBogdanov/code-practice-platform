import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isActive?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      leftIcon,
      rightIcon,
      isActive = false,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classNames = clsx(
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      isActive && styles.active,
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled}
        aria-pressed={isActive ? true : undefined}
        {...props}
      >
        {leftIcon && <span className={styles["icon-left"]}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles["icon-right"]}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
