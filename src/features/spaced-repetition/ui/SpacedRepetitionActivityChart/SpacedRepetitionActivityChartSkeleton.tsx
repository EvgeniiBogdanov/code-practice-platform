import { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SpacedRepetitionActivityChart.module.css";

export interface SpacedRepetitionActivityChartSkeletonProps {
  className?: string;
}

export const SpacedRepetitionActivityChartSkeleton = memo(
  ({ className }: SpacedRepetitionActivityChartSkeletonProps): React.JSX.Element => (
    <div
      className={clsx(styles.section, className)}
      role="status"
      aria-label="Загрузка активности решений"
    >
      <div className={styles.titleWrapper}>
        <UiSkeleton variant="rounded" width={145} height={13} radius={3} />
      </div>
      <UiSkeleton variant="rounded" radius={4} className={styles.chartPlaceholder} />
    </div>
  )
);

SpacedRepetitionActivityChartSkeleton.displayName = "SpacedRepetitionActivityChartSkeleton";
