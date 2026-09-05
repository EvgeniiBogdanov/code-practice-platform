import { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SpacedRepetitionScheduleSkeleton.module.css";

interface ScheduleBarSkeletonItem {
  id: string;
  labelWidth: number;
  barClass: string;
}

const SCHEDULE_BARS_SKELETON: readonly ScheduleBarSkeletonItem[] = [
  { id: "today", labelWidth: 44, barClass: styles.barToday },
  { id: "tomorrow", labelWidth: 40, barClass: styles.barTomorrow },
  { id: "2-3d", labelWidth: 42, barClass: styles.bar23d },
  { id: "4-7d", labelWidth: 46, barClass: styles.bar47d },
  { id: "8-14d", labelWidth: 50, barClass: styles.bar814d },
  { id: "15-30d", labelWidth: 54, barClass: styles.bar1530d },
  { id: "master", labelWidth: 42, barClass: styles.barMaster },
] as const;

export interface SpacedRepetitionScheduleSkeletonProps {
  className?: string;
}

export const SpacedRepetitionScheduleSkeleton = memo(
  ({ className }: SpacedRepetitionScheduleSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.scheduleView, className)}
        role="status"
        aria-label="Загрузка графика повторений"
      >
        <div className={styles.scheduleDescWrapper}>
          <UiSkeleton variant="rounded" width={380} height={13} radius={3} />
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.barsGrid}>
            {SCHEDULE_BARS_SKELETON.map((bar) => (
              <div key={bar.id} className={styles.barCol}>
                <div className={styles.countPlaceholder}>
                  <UiSkeleton variant="rounded" width={16} height={12} radius={2} />
                </div>
                <div className={clsx(styles.barTrack, bar.barClass)}>
                  <UiSkeleton
                    variant="rounded"
                    width="100%"
                    height="100%"
                    radius={4}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.labelsRow}>
            {SCHEDULE_BARS_SKELETON.map((bar) => (
              <div key={bar.id} className={styles.labelCol}>
                <UiSkeleton variant="rounded" width={bar.labelWidth} height={10} radius={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

SpacedRepetitionScheduleSkeleton.displayName = "SpacedRepetitionScheduleSkeleton";
