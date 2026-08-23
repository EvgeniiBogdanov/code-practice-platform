import React from "react";
import { clsx } from "clsx";
import styles from "./MetaBadge.module.css";

export type MetaBadgeVariant = "default" | "blue" | "yellow" | "purple" | "green" | "red" | "gray";

export interface MetaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: MetaBadgeVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function MetaBadge({
  variant = "default",
  icon,
  children,
  className,
  ...props
}: MetaBadgeProps) {
  const variantClass = styles[`variant-${variant}`] || styles["variant-default"];
  const classNames = clsx(styles.metaBadge, variantClass, className);

  return (
    <span className={classNames} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </span>
  );
}

export interface MetaRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export function MetaRow({ children, className, ...props }: MetaRowProps) {
  const classNames = clsx(styles.metaRow, className);

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
