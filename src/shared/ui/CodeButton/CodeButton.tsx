import React, { ButtonHTMLAttributes, forwardRef, memo, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./CodeButton.module.css";

export type CodeButtonVariant = "default" | "active" | "success" | "danger";
export type CodeButtonSize = "xs" | "sm" | "md";

export interface CodeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  isActive?: boolean;
  variant?: CodeButtonVariant;
  size?: CodeButtonSize;
}

export const CodeButton = memo(
  forwardRef<HTMLButtonElement, CodeButtonProps>(
    (
      {
        icon,
        children,
        isActive = false,
        variant = "default",
        size = "sm",
        className,
        type = "button",
        disabled,
        ...restProps
      },
      ref
    ) => {
      const effectiveVariant = isActive ? "active" : variant;
      const classNames = clsx(
        styles.codeBtn,
        styles[`size_${size}`],
        styles[`variant_${effectiveVariant}`],
        isActive && styles.active,
        Boolean(children) && styles.hasChildren,
        className
      );

      return (
        <button ref={ref} type={type} disabled={disabled} className={classNames} {...restProps}>
          {icon}
          {children}
        </button>
      );
    }
  )
);

CodeButton.displayName = "CodeButton";
