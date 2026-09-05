import React from "react";
import { clsx } from "clsx";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "easy"
  | "medium"
  | "hard"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "purple"
  | "gray"
  | "ts"
  | "orange"
  | "cyan"
  | "pink";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  uppercase?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

export const Badge = ({
  variant = "gray",
  size = "md",
  icon,
  uppercase = true,
  className,
  children,
  ref,
  ...props
}: BadgeProps): React.JSX.Element => {
  const variantClass = styles[`variant-${variant}`];
  const sizeClass = styles[`size-${size}`];
  const classNames = clsx(
    styles.badge,
    variantClass,
    sizeClass,
    uppercase && styles.uppercase,
    className
  );

  return (
    <span ref={ref} className={classNames} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children !== undefined && children !== null && (
        <span className={styles.label}>{children}</span>
      )}
    </span>
  );
};

Badge.displayName = "Badge";
