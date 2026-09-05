import { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SpacedRepetitionDistributionSkeleton.module.css";

interface StageSkeletonConfig {
  id: string;
  titleWidth: number;
  descWidth: number;
}

const STAGES_SKELETON: readonly StageSkeletonConfig[] = [
  { id: "mastered", titleWidth: 140, descWidth: 240 },
  { id: "reviewing", titleWidth: 150, descWidth: 215 },
  { id: "learning", titleWidth: 125, descWidth: 255 },
  { id: "unreviewed", titleWidth: 115, descWidth: 200 },
] as const;

export interface SpacedRepetitionDistributionSkeletonProps {
  className?: string;
}

export const SpacedRepetitionDistributionSkeleton = memo(
  ({ className }: SpacedRepetitionDistributionSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.distributionView, className)}
        role="status"
        aria-label="Загрузка диаграммы распределения"
      >
        <div className={styles.chartCol}>
          <div className={styles.donutPlaceholder}>
            <UiSkeleton variant="circular" width={190} height={190} />
            <div className={styles.donutHole}>
              <UiSkeleton variant="rounded" width={52} height={22} radius={4} />
              <UiSkeleton variant="rounded" width={68} height={10} radius={3} />
            </div>
          </div>
        </div>

        <div className={styles.legendCol}>
          <div className={styles.legendHeaderWrapper}>
            <UiSkeleton variant="rounded" width={160} height={14} radius={3} />
          </div>

          <div className={styles.stageList}>
            {STAGES_SKELETON.map((stage) => (
              <div key={stage.id} className={styles.stageItem}>
                <UiSkeleton variant="circular" width={8} height={8} />
                <div className={styles.stageInfo}>
                  <UiSkeleton variant="rounded" width={stage.titleWidth} height={14} radius={3} />
                  <UiSkeleton variant="rounded" width={stage.descWidth} height={12} radius={3} />
                </div>
                <UiSkeleton variant="rounded" width={28} height={20} radius={9999} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

SpacedRepetitionDistributionSkeleton.displayName = "SpacedRepetitionDistributionSkeleton";
