import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SidebarHomeOverview.module.css";

export interface SidebarHomeSkeletonProps {
  className?: string;
}

export const SidebarHomeSkeleton = memo(
  ({ className }: SidebarHomeSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.homeOverviewList, className)}
        role="status"
        aria-label="Загрузка навигации..."
      >
        {/* Placeholder for the overall progress card */}
        <UiSkeleton width="100%" height={46} radius={6} />
        <div className={clsx(styles.homeOverviewItem, styles.homeOverviewSkeletonItem)}>
          <UiSkeleton width={17} height={17} radius={4} />
          <span className={styles.homeItemTitle}>
            <UiSkeleton width={125} height={14} radius={3} />
          </span>
        </div>
      </div>
    );
  }
);

SidebarHomeSkeleton.displayName = "SidebarHomeSkeleton";
