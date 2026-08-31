import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SidebarHomeOverview.module.css";

export interface SidebarHomeSkeletonProps {
  className?: string;
}

const HOME_ITEMS = [
  { titleWidth: 125, hasBadge: false },
  { titleWidth: 85, hasBadge: true },
  { titleWidth: 55, hasBadge: true },
  { titleWidth: 95, hasBadge: true },
];

export const SidebarHomeSkeleton = memo(
  ({ className }: SidebarHomeSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.homeOverviewList, className)}
        aria-label="Загрузка навигации..."
      >
        {HOME_ITEMS.map((item, idx) => (
          <div key={idx} className={styles.homeOverviewItem} style={{ pointerEvents: "none" }}>
            <UiSkeleton width={17} height={17} radius={4} />
            <span className={styles.homeItemTitle}>
              <UiSkeleton width={item.titleWidth} height={14} radius={3} />
            </span>
            {item.hasBadge && <UiSkeleton width={28} height={18} radius={9999} />}
          </div>
        ))}
      </div>
    );
  }
);

SidebarHomeSkeleton.displayName = "SidebarHomeSkeleton";
