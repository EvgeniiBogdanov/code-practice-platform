import React, { ButtonHTMLAttributes, forwardRef, memo } from "react";
import { clsx } from "clsx";
import styles from "./SquareButton.module.css";

export type SquareButtonSize = "sm" | "md";
export type SquareButtonVariant = "default" | "transparent";

export interface SquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: React.ReactNode;
  size?: SquareButtonSize;
  variant?: SquareButtonVariant;
}

export const SquareButton = memo(
  forwardRef<HTMLButtonElement, SquareButtonProps>(
    (
      {
        icon,
        isActive = false,
        badge,
        size = "md",
        variant = "default",
        className,
        children,
        disabled,
        type = "button",
        ...restProps
      },
      ref
    ) => {
      const buttonClasses = clsx(
        styles.squareButton,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        isActive && styles.active,
        disabled && styles.disabled,
        className
      );

      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          className={buttonClasses}
          aria-pressed={isActive ? true : undefined}
          {...restProps}
        >
          {icon ?? children}
          {badge}
        </button>
      );
    }
  )
);

SquareButton.displayName = "SquareButton";
