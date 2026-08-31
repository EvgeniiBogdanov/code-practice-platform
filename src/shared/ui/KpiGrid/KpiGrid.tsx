import { memo } from "react";
import { clsx } from "clsx";
import { Card } from "../Card";
import { UiNumberScramble } from "../UiNumberScramble";
import styles from "./KpiGrid.module.css";

export interface KpiGridProps {
  total: number;
  solved: number;
  percent: number;
  remaining: number;
  progressLabel?: string;
  className?: string;
}

export const KpiGrid = memo(
  ({
    total,
    solved,
    percent,
    remaining,
    progressLabel = "Общий прогресс",
    className,
  }: KpiGridProps) => {
    return (
      <div className={clsx(styles.kpiGrid, className)}>
        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Всего задач</span>
          <span className={styles.kpiValue}>
            <UiNumberScramble value={total} />
          </span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Решено задач</span>
          <span className={clsx(styles.kpiValue, styles.kpiSolved)}>
            <UiNumberScramble value={solved} />
          </span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>{progressLabel}</span>
          <span className={clsx(styles.kpiValue, styles.kpiPercent)}>
            <UiNumberScramble value={percent} suffix="%" />
          </span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Осталось решить</span>
          <span className={clsx(styles.kpiValue, styles.kpiRemaining)}>
            <UiNumberScramble value={remaining} />
          </span>
        </Card>
      </div>
    );
  }
);

KpiGrid.displayName = "KpiGrid";
