import { memo } from "react";
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
      <div className={[styles.kpiGrid, className].filter(Boolean).join(" ")}>
        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Всего задач</span>
          <span className={styles.kpiValue}>{total}</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Решено задач</span>
          <span className={[styles.kpiValue, styles.kpiSolved].join(" ")}>{solved}</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>{progressLabel}</span>
          <span className={[styles.kpiValue, styles.kpiPercent].join(" ")}>{percent}%</span>
        </Card>

        <Card className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Осталось решить</span>
          <span className={[styles.kpiValue, styles.kpiRemaining].join(" ")}>{remaining}</span>
        </Card>
      </div>
    );
  }
);

ProgressKpiGrid.displayName = "ProgressKpiGrid";
