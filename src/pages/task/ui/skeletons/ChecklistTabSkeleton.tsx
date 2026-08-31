import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./TaskTabSkeleton.module.css";

export interface ChecklistTabSkeletonProps {
  className?: string;
}

export const ChecklistTabSkeleton = memo(
  ({ className }: ChecklistTabSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.checklistContainer, className)}>
        {/* Checklist Header matching ChecklistTab header */}
        <div className={styles.checklistHeader}>
          <div className={styles.checklistHeaderLeft}>
            <UiSkeleton width={160} height={18} radius={4} />
            <UiSkeleton width="75%" height={14} radius={3} />
          </div>
          <UiSkeleton width={135} height={28} radius={100} />
        </div>

        {/* Checklist Section matching ChecklistTab section & Checkbox */}
        <div className={styles.checklistSection}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={styles.checklistItem}>
              <UiSkeleton
                width={16}
                height={16}
                radius={3}
                style={{ flexShrink: 0, marginTop: 2.5 }}
              />
              <UiSkeleton
                width={`${50 + (idx % 4) * 12}%`}
                height={15}
                radius={3}
                style={{ marginTop: 2 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ChecklistTabSkeleton.displayName = "ChecklistTabSkeleton";
