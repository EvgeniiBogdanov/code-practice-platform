import type { JSX } from "react";
import { clsx } from "clsx";
import { LoaderCircle } from "lucide-react";
import styles from "./UiSpinner.module.css";

export interface UiSpinnerProps {
  /**
   * Accessible name of what is loading. Without it the spinner is decorative: next to a text that
   * already says it, or inside a button.
   */
  label?: string;
  /** Icon size in pixels. */
  size?: number;
  className?: string;
}

/**
 * The round spinner for a UI element that is loading (a console, a diagram, a running test). It takes
 * the colour of its parent. Page loads during routing use `UiLoader` instead.
 */
export const UiSpinner = ({ label, size = 18, className }: UiSpinnerProps): JSX.Element => (
  <span
    role={label ? "status" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    className={clsx(styles.spinner, className)}
  >
    <LoaderCircle size={size} className={styles.icon} aria-hidden="true" />
  </span>
);
