import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "./button-class-name";
import styles from "./Button.module.css";

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
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName({ variant, size, isActive, className })}
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
