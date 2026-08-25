import { memo } from "react";
import { Zap, RotateCcw, Trophy, Clock } from "lucide-react";
import { clsx } from "clsx";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionKpiGridProps {
  totalReviewed: number;
  totalCount: number;
  dueToday: number;
  mastered: number;
  masteryPercent: number;
  avgInterval: number;
}

export const SpacedRepetitionKpiGrid = memo(
  ({
    totalReviewed,
    totalCount,
    dueToday,
    mastered,
    masteryPercent,
    avgInterval,
  }: SpacedRepetitionKpiGridProps): React.JSX.Element => {
    return (
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Zap size={13} className={styles.kpiIconAmber} />
            <span>В цикле SM-2</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={styles.kpiVal}>{totalReviewed}</span>
            <span className={styles.kpiSub}>из {totalCount}</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={clsx(styles.kpiProgressBar, styles.amber)}
              style={{
                width: `${totalCount > 0 ? (totalReviewed / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <RotateCcw
              size={13}
              className={dueToday > 0 ? styles.kpiIconYellow : styles.kpiIconMuted}
            />
            <span>К повторению</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={clsx(styles.kpiVal, dueToday > 0 && styles.kpiValYellow)}>
              {dueToday}
            </span>
            <span className={styles.kpiSub}>сегодня</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={clsx(styles.kpiProgressBar, styles.yellow)}
              style={{ width: `${dueToday > 0 ? 100 : 0}%` }}
            />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Trophy size={13} className={styles.kpiIconGreen} />
            <span>Уровень Мастер</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={clsx(styles.kpiVal, styles.kpiValGreen)}>
              {masteryPercent}%
            </span>
            <span className={styles.kpiSub}>{mastered} задач</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={clsx(styles.kpiProgressBar, styles.green)}
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Clock size={13} className={styles.kpiIconBlue} />
            <span>Средний интервал</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={clsx(styles.kpiVal, styles.kpiValBlue)}>
              {avgInterval}
            </span>
            <span className={styles.kpiSub}>дней</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={clsx(styles.kpiProgressBar, styles.blue)}
              style={{ width: `${Math.min(100, (avgInterval / 60) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
);

SpacedRepetitionKpiGrid.displayName = "SpacedRepetitionKpiGrid";
