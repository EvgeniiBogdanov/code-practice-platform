import React, { memo } from "react";
import { clsx } from "clsx";
import { Card } from "../Card";
import { UiSkeleton } from "../UiSkeleton";
import styles from "./GroupCard.module.css";

export interface GroupCardProps {
  icon: React.ReactNode;
  title: string;
  countBadge?: React.ReactNode;
  progressPercent?: number;
  progressFillClass?: string;
  isLoadingProgress?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const GroupCard = memo(
  ({
    icon,
    title,
    countBadge,
    progressPercent = 0,
    progressFillClass,
    isLoadingProgress = false,
    children,
    footer,
    className,
  }: GroupCardProps) => {
    return (
      <Card className={clsx(styles.groupCard, className)}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconWrapper}>{icon}</div>
            <span className={styles.title}>{title}</span>
          </div>
          {countBadge}
        </div>

        <div className={styles.progressBar}>
          {isLoadingProgress ? (
            <UiSkeleton width="100%" height="100%" radius={2} />
          ) : (
            <div
              className={clsx(styles.progressFill, progressFillClass)}
              style={{ width: `${progressPercent}%` }}
            />
          )}
        </div>

        {children && <div className={styles.content}>{children}</div>}

        {footer && <div className={styles.footer}>{footer}</div>}
      </Card>
    );
  }
);

GroupCard.displayName = "GroupCard";
