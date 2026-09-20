import React, { forwardRef, memo } from "react";
import { clsx } from "clsx";
import styles from "./Switch.module.css";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  size?: "sm" | "md";
}

export const Switch = memo(
  forwardRef<HTMLLabelElement, SwitchProps>(
    (
      {
        checked,
        onChange,
        disabled = false,
        label,
        id,
        name,
        className,
        "aria-label": ariaLabel,
        size = "md",
      }: SwitchProps,
      ref
    ): React.JSX.Element => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (disabled) return;
        onChange(e.target.checked);
      };

      return (
        <label
          ref={ref}
          className={clsx(
            styles.switchWrapper,
            styles[`size_${size}`],
            disabled && styles.disabled,
            className
          )}
        >
          <input
            type="checkbox"
            role="switch"
            id={id}
            name={name}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={checked}
            aria-label={ariaLabel}
            className={styles.nativeInput}
          />
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
          {label && <span className={styles.label}>{label}</span>}
        </label>
      );
    }
  )
);

Switch.displayName = "Switch";
