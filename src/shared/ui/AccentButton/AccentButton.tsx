import React, { forwardRef } from "react";
import { clsx } from "clsx";
import styles from "./AccentButton.module.css";

export type AccentButtonColor =
  "amber" | "blue" | "emerald" | "purple" | "red" | "cyan" | "pink" | "orange" | "default";

export type AccentButtonSize = "sm" | "md" | "lg";

export interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorVariant?: AccentButtonColor;
  color?: string;
  size?: AccentButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const resolveColorVariant = (
  colorVariant?: AccentButtonColor,
  color?: string
): AccentButtonColor => {
  if (colorVariant) return colorVariant;
  if (!color) return "default";

  const c = color.toLowerCase();
  if (
    c.includes("f59e0b") ||
    c.includes("fbbf24") ||
    c.includes("eab308") ||
    c.includes("amber") ||
    c.includes("yellow")
  ) {
    return "amber";
  }
  if (c.includes("3b82f6") || c.includes("2383e2") || c.includes("60a5fa") || c.includes("blue")) {
    return "blue";
  }
  if (
    c.includes("10b981") ||
    c.includes("059669") ||
    c.includes("16a34a") ||
    c.includes("green") ||
    c.includes("emerald")
  ) {
    return "emerald";
  }
  if (
    c.includes("a855f7") ||
    c.includes("8b5cf6") ||
    c.includes("c084fc") ||
    c.includes("9333ea") ||
    c.includes("purple") ||
    c.includes("violet")
  ) {
    return "purple";
  }
  if (
    c.includes("ff6b6b") ||
    c.includes("f43f5e") ||
    c.includes("ef4444") ||
    c.includes("dc2626") ||
    c.includes("red") ||
    c.includes("coral") ||
    c.includes("rose")
  ) {
    return "red";
  }
  if (c.includes("06b6d4") || c.includes("0891b2") || c.includes("cyan")) {
    return "cyan";
  }
  if (c.includes("ec4899") || c.includes("db2777") || c.includes("pink")) {
    return "pink";
  }
  if (c.includes("f97316") || c.includes("ea580c") || c.includes("orange")) {
    return "orange";
  }
  return "default";
};

export const AccentButton = forwardRef<HTMLButtonElement, AccentButtonProps>(
  (
    {
      colorVariant,
      color,
      size = "md",
      leftIcon,
      rightIcon,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const resolvedColor = resolveColorVariant(colorVariant, color);
    const classNames = clsx(
      styles.button,
      styles[`size_${size}`],
      styles[`color_${resolvedColor}`],
      className
    );

    return (
      <button ref={ref} type={type} className={classNames} {...props}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

AccentButton.displayName = "AccentButton";
