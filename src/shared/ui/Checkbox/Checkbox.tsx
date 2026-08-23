import React from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  strikethrough?: boolean;
  color?: "blue" | "green" | "purple";
  size?: "sm" | "md";
  className?: string;
  labelClassName?: string;
}

export const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  children,
  strikethrough = true,
  color = "blue",
  size = "md",
  className,
  labelClassName,
  id,
  ...props
}: CheckboxProps) => {
  const isChecked = Boolean(checked);
  const labelText = label !== undefined ? label : children;

  const rowClasses = clsx(
    styles.checkboxRow,
    styles[`color-${color}`],
    styles[`size-${size}`],
    isChecked && styles.checked,
    disabled && styles.disabled,
    className
  );

  const labelClasses = clsx(
    styles.label,
    isChecked && strikethrough && styles.strikethrough,
    labelClassName
  );

  return (
    <label className={rowClasses}>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
        className={styles.nativeInput}
        {...props}
      />
      <span className={styles.customBox} aria-hidden="true">
        {isChecked && <Check className={styles.checkIcon} />}
      </span>
      {labelText != null && <span className={labelClasses}>{labelText}</span>}
    </label>
  );
};

Checkbox.displayName = "Checkbox";
