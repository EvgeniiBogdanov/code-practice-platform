import { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./CommandPaletteSkeleton.module.css";

export interface CommandPaletteSkeletonProps {
  className?: string;
  count?: number;
}

const SKELETON_WIDTHS = ["68%", "52%", "75%", "60%", "45%", "64%"] as const;

export const CommandPaletteSkeleton = memo(
  ({ className, count = 6 }: CommandPaletteSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.skeletonList, className)}
        role="status"
        aria-label="Загрузка задач..."
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={styles.skeletonItem}>
            <UiSkeleton variant="rounded" width={14} height={14} radius={3} />
            <UiSkeleton variant="rounded" width={38} height={18} radius={4} />
            <div className={styles.itemTitle}>
              <UiSkeleton
                variant="rounded"
                width={SKELETON_WIDTHS[idx % SKELETON_WIDTHS.length]}
                height={14}
                radius={3}
              />
            </div>
            <UiSkeleton variant="rounded" width={52} height={18} radius={9999} />
          </div>
        ))}
      </div>
    );
  }
);

CommandPaletteSkeleton.displayName = "CommandPaletteSkeleton";
