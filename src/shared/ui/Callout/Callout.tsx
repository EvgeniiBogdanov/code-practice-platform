import React from "react";
import { clsx } from "clsx";
import styles from "./Callout.module.css";

export type CalloutColor =
  | "default"
  | "gray"
  | "purple"
  | "blue"
  | "green"
  | "yellow"
  | "amber"
  | "orange"
  | "red";

export type CalloutSize = "default" | "md" | "sm" | "xs";

export interface CalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  /** Размер Callout (default: "default") */
  size?: CalloutSize;
  /** Цвет заливки и акцентной рамки (default: "default") */
  color?: CalloutColor;
  /** Иконка (эмодзи, строка, lucide иконка или React Node) */
  icon?: React.ReactNode;
  /** Текст заголовка */
  title?: React.ReactNode;
  /** Текст содержимого (альтернатива children) */
  content?: React.ReactNode;
  /** Дочерние элементы (списки, параграфы, кастомная разметка) */
  children?: React.ReactNode;
  /** Дополнительный класс */
  className?: string;
}

export const Callout = ({
  size = "default",
  color = "default",
  icon,
  title,
  content,
  children,
  className,
  ...props
}: CalloutProps): React.JSX.Element => {
  const colorClass = styles[`color-${color}`] || styles["color-default"];
  const sizeClass = size !== "default" && size !== "md" ? styles[`size-${size}`] : undefined;
  const classNames = clsx(styles.callout, colorClass, sizeClass, className);

  const hasBody = content !== undefined || children !== undefined;

  return (
    <div className={classNames} role="note" {...props}>
      {icon && <div className={styles.icon}>{icon}</div>}

      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}

        {hasBody && (
          <div className={styles.body}>
            {content}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

Callout.displayName = "Callout";
