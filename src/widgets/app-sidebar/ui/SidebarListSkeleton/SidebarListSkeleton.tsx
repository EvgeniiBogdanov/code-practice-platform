import React, { memo } from "react";
import { clsx } from "clsx";
import type { SectionType } from "@/entities/task";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SidebarListSkeleton.module.css";

export interface SidebarListSkeletonProps {
  className?: string;
  section?: SectionType;
  foldersCount?: number;
}

const SECTION_FOLDER_WIDTHS: Record<SectionType, readonly string[]> = {
  typescript: ["55%", "82%", "62%", "72%", "75%"],
  algorithms: ["55%", "70%", "45%", "65%", "50%", "80%", "60%", "75%", "40%", "68%", "58%"],
  javascript: [
    "72%",
    "55%",
    "38%",
    "45%",
    "45%",
    "38%",
    "52%",
    "78%",
    "48%",
    "85%",
    "85%",
    "62%",
    "85%",
    "45%",
  ],
  react: ["48%", "55%", "82%", "75%", "82%", "88%", "90%"],
};

const getFolderWidths = (section?: SectionType, foldersCount?: number): readonly string[] => {
  const widths = section ? SECTION_FOLDER_WIDTHS[section] : SECTION_FOLDER_WIDTHS.algorithms;
  if (foldersCount === undefined) {
    return widths;
  }
  return Array.from({ length: foldersCount }, (_, i) => widths[i % widths.length]);
};

export const SidebarListSkeleton = memo(
  ({ className, section, foldersCount }: SidebarListSkeletonProps): React.JSX.Element => {
    const widths = getFolderWidths(section, foldersCount);
    return (
      <div
        className={clsx(styles.container, className)}
        role="status"
        aria-label="Загрузка списка тем..."
      >
        {/* Sticky wrapper matching SidebarProgressCard layout */}
        <div className={styles.stickyWrapper}>
          {/* Same placeholder as the home skeleton for the progress card */}
          <UiSkeleton width="100%" height={46} radius={6} />

          {/* Quick actions row matching SidebarQuickActions 4 buttons */}
          <div className={styles.quickActions}>
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
            <UiSkeleton width={32} height={30} radius={8} />
          </div>
        </div>

        {/* Folder skeletons matching SidebarGroupHeader */}
        <div className={styles.foldersList}>
          {widths.map((width, idx) => (
            <div key={idx} className={styles.folderRow} data-testid="sidebar-folder-skeleton">
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
