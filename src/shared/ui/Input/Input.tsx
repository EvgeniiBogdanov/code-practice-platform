import React, { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "transparent";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      error,
      className,
      containerClassName,
      size = "md",
      variant = "default",
      disabled,
      ...props
    },
    ref
  ): React.JSX.Element => {
    const inputClassNames = clsx(
      styles.input,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
      error && styles.hasError,
      className
    );

    return (
      <div className={clsx(styles.container, containerClassName)}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input ref={ref} disabled={disabled} className={inputClassNames} {...props} />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
