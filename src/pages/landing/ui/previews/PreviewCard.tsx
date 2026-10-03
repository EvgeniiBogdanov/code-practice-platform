import React from "react";
import { clsx } from "clsx";
import styles from "./PreviewCard.module.css";

export interface PreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Surface of a floating product preview. */
export const PreviewCard = ({
  className,
  children,
  ...props
}: PreviewCardProps): React.JSX.Element => (
  <div className={clsx(styles.card, className)} {...props}>
    {children}
  </div>
);

export interface PreviewWindowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

/** Workspace-like window with traffic lights, used by the editor and runner previews. */
export const PreviewWindow = ({
  title,
  icon,
  actions,
  className,
  children,
  ...props
}: PreviewWindowProps): React.JSX.Element => (
  <div className={clsx(styles.window, className)} {...props}>
    <div className={styles.windowBar}>
      <span className={styles.trafficLights} aria-hidden="true">
        <span className={styles.dotClose} />
        <span className={styles.dotMinimize} />
        <span className={styles.dotMaximize} />
      </span>
      <span className={styles.windowTitle}>
        {icon}
        {title}
      </span>
      {actions && <span className={styles.windowActions}>{actions}</span>}
    </div>
    {children}
  </div>
);
