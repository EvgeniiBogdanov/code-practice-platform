import { memo } from "react";
import { clsx } from "clsx";
import { Card } from "@/shared/ui";
import styles from "./ProgressKpiGrid.module.css";

export interface ProgressKpiGridProps {
  total: number;
  solved: number;
  percent: number;
  remaining: number;
  progressLabel?: string;
  className?: string;
}

export const ProgressKpiGrid = memo(
  ({
    total,
    solved,
    percent,
    remaining,
    progressLabel = "Общий прогресс",
    className,
  }: ProgressKpiGridProps) => {
    return (
      <div className={clsx(styles.kpiGrid, className)}>
        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Всего задач</span>
          <span className={styles.kpiValue}>{total}</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Решено задач</span>
          <span className={clsx(styles.kpiValue, styles.kpiSolved)}>{solved}</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>{progressLabel}</span>
          <span className={clsx(styles.kpiValue, styles.kpiPercent)}>{percent}%</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Осталось решить</span>
          <span className={clsx(styles.kpiValue, styles.kpiRemaining)}>{remaining}</span>
        </Card>
      </div>
    );
  }
);

ProgressKpiGrid.displayName = "ProgressKpiGrid";
