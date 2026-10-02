import type { JSX } from "react";
import { clsx } from "clsx";
import { Button } from "../Button";
import styles from "./UiSegmentedControl.module.css";

export interface UiSegmentedControlProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  descriptionId?: string;
}

export const UiSegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  label,
  descriptionId,
}: UiSegmentedControlProps<T>): JSX.Element => (
  <div role="group" aria-label={label} aria-describedby={descriptionId} className={styles.group}>
    {options.map((option) => (
      <Button
        key={option.value}
        variant={value === option.value ? "primary" : "ghost"}
        size="sm"
        aria-pressed={value === option.value}
        className={clsx(styles.option, value === option.value && styles.active)}
        onClick={(): void => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);
