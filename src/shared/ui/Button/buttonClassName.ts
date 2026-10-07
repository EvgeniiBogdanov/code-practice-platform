import { clsx } from "clsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonShape = "default" | "pill";
export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon" | "icon-sm";

export interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  isActive?: boolean;
  className?: string;
}

/** Button styles for non-button elements, e.g. external links: `<a className={buttonClassName()}>`. */
export const buttonClassName = ({
  variant = "secondary",
  size = "md",
  shape = "default",
  isActive = false,
  className,
}: ButtonClassNameOptions = {}): string =>
  clsx(
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    shape === "pill" && styles["shape-pill"],
    isActive && styles.active,
    className
  );
