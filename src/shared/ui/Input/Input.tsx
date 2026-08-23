import React, { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, className, disabled, ...props }, ref) => {
    const inputClassNames = clsx(
      styles.input,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
      error && styles.hasError,
      className
    );

    return (
      <div className={styles.container}>
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
