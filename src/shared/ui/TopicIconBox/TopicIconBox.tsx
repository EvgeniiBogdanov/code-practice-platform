import React from "react";
import { clsx } from "clsx";
import {
  TopicIconBoxColor,
  TopicIconBoxSize,
  resolveColorVariant,
} from "./resolveColorVariant";
import styles from "./TopicIconBox.module.css";

export interface TopicIconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  colorVariant?: TopicIconBoxColor;
  color?: string;
  size?: TopicIconBoxSize;
  hoverable?: boolean;
  children?: React.ReactNode;
}

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
