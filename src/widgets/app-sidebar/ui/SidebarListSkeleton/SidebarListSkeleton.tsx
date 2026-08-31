import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SidebarListSkeleton.module.css";

export interface SidebarListSkeletonProps {
  className?: string;
}

const FOLDER_WIDTHS = [
  "55%",
  "70%",
  "45%",
  "65%",
  "50%",
  "80%",
  "60%",
  "75%",
  "40%",
  "68%",
];

export const SidebarListSkeleton = memo(
  ({ className }: SidebarListSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.container, className)}>
        {/* Sticky wrapper matching SidebarProgressCard layout */}
        <div className={styles.stickyWrapper}>
          <div className={styles.progressCard}>
            <div className={styles.headerRow}>
              <div className={styles.sectionTitle}>
                <UiSkeleton width={13} height={13} radius={2} />
                <UiSkeleton width={115} height={12} radius={3} />
              </div>
              <UiSkeleton width={32} height={14} radius={3} />
            </div>

            <div className={styles.barTrack}>
              <UiSkeleton width="45%" height={4} radius={2} />
            </div>
          </div>

          {/* Quick actions row matching SidebarQuickActions 4 buttons */}
          <div className={styles.quickActions} aria-label="Быстрые действия">
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
          </div>
        </div>

        {/* 10 identical folder skeletons matching SidebarGroupHeader */}
        <div className={styles.foldersList} aria-label="Загрузка списка тем...">
          {FOLDER_WIDTHS.map((width, idx) => (
            <div key={idx} className={styles.folderRow}>
              <div className={styles.folderLeft}>
                <UiSkeleton width={22} height={22} radius={6} />
                <UiSkeleton width={width} height={14} radius={4} />
              </div>
              <UiSkeleton width={26} height={18} radius={9999} />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SidebarListSkeleton.displayName = "SidebarListSkeleton";
