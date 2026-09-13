import { memo, useMemo } from "react";
import { clsx } from "clsx";
import { useParentSize } from "@/shared/lib/hooks";
import { UiSkeleton } from "@/shared/ui";
import {
  CHART_HEIGHT,
  computeChartLayout,
  getActivityRange,
} from "./SpacedRepetitionActivityChart";
import styles from "./SpacedRepetitionActivityChart.module.css";

export interface SpacedRepetitionActivityChartSkeletonProps {
  className?: string;
  endDate?: Date;
}

export const SpacedRepetitionActivityChartSkeleton = memo(
  ({ className, endDate }: SpacedRepetitionActivityChartSkeletonProps): React.JSX.Element => {
    const endTimestamp = endDate?.getTime() ?? Date.now();
    const { from, to } = useMemo(() => getActivityRange(endTimestamp), [endTimestamp]);
    const [containerRef, { width }] = useParentSize<HTMLDivElement>({
      width: 0,
      height: CHART_HEIGHT,
    });
    const { chartHeight } = useMemo(() => computeChartLayout(width, from, to), [width, from, to]);

    return (
      <div
        className={clsx(styles.section, className)}
        role="status"
        aria-label="Загрузка активности решений"
      >
        <div className={styles.titleWrapper}>
          <UiSkeleton variant="rounded" width={145} height={13} radius={3} />
        </div>
        <div ref={containerRef} className={styles.chart}>
          <UiSkeleton
            variant="rounded"
            width="100%"
            height={chartHeight}
            radius={4}
            className={styles.chartPlaceholder}
          />
        </div>
      </div>
    );
  }
);

SpacedRepetitionActivityChartSkeleton.displayName = "SpacedRepetitionActivityChartSkeleton";
