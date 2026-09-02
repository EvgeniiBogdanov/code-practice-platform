import React from "react";
import { clsx } from "clsx";
import styles from "./MetaBadge.module.css";

export type MetaBadgeVariant =
  | "default"
  | "blue"
  | "yellow"
  | "purple"
  | "green"
  | "red"
  | "gray"
  | "orange"
  | "lime"
  | "dark-blue"
  | "light-blue"
  | "coral"
  | "pink"
  | "cyan";

export interface MetaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: MetaBadgeVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

export const MetaBadge = ({
  variant = "default",
  icon,
  children,
  className,
  ref,
  ...props
}: MetaBadgeProps): React.JSX.Element => {
  const variantClass = styles[`variant-${variant}`] || styles["variant-default"];
  const classNames = clsx(styles.metaBadge, variantClass, className);

  return (
    <span ref={ref} className={classNames} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </span>
  );
};

MetaBadge.displayName = "MetaBadge";

export interface MetaRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const MetaRow = ({
  children,
  className,
  ref,
  ...props
}: MetaRowProps): React.JSX.Element => {
  const classNames = clsx(styles.metaRow, className);

  return (
    <div ref={ref} className={classNames} {...props}>
      {children}
    </div>
  );
};

MetaRow.displayName = "MetaRow";
