import React from "react";
import { clsx } from "clsx";
import styles from "./TopicIconBox.module.css";

export type TopicIconBoxColor =
  "amber" | "blue" | "emerald" | "purple" | "red" | "cyan" | "pink" | "orange" | "default";

export type TopicIconBoxSize = "sm" | "md" | "lg";

export interface TopicIconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  colorVariant?: TopicIconBoxColor;
  color?: string;
  size?: TopicIconBoxSize;
  hoverable?: boolean;
  children?: React.ReactNode;
}

const resolveColorVariant = (
  colorVariant?: TopicIconBoxColor,
  color?: string
): TopicIconBoxColor => {
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

export const TopicIconBox = ({
  colorVariant,
  color,
  size = "lg",
  hoverable = true,
  className,
  children,
  ...props
}: TopicIconBoxProps) => {
  const resolvedColor = resolveColorVariant(colorVariant, color);
  const classNames = clsx(
    styles.box,
    styles[`size_${size}`],
    styles[`color_${resolvedColor}`],
    hoverable && styles.hoverable,
    className
  );

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

TopicIconBox.displayName = "TopicIconBox";
