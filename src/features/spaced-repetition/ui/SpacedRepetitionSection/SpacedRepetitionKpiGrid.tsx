import { memo } from "react";
import { Zap, RotateCcw, Trophy, Clock } from "lucide-react";
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
  }: SpacedRepetitionKpiGridProps) => {
    return (
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Zap size={13} style={{ color: "#f59e0b" }} />
            <span>В цикле SM-2</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={styles.kpiVal}>{totalReviewed}</span>
            <span className={styles.kpiSub}>из {totalCount}</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={[styles.kpiProgressBar, styles.amber].join(" ")}
              style={{
                width: `${totalCount > 0 ? (totalReviewed / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className={[styles.kpiCard, dueToday > 0 && styles.hasDue].filter(Boolean).join(" ")}>
          <div className={styles.kpiHeader}>
            <RotateCcw
              size={13}
              style={{ color: dueToday > 0 ? "#ef4444" : "var(--text-muted)" }}
            />
            <span>К повторению</span>
          </div>
          <div className={styles.kpiValRow}>
            <span
              className={styles.kpiVal}
              style={{ color: dueToday > 0 ? "#ef4444" : "var(--text-main)" }}
            >
              {dueToday}
            </span>
            <span className={styles.kpiSub}>сегодня</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={[styles.kpiProgressBar, styles.red].join(" ")}
              style={{ width: `${dueToday > 0 ? 100 : 0}%` }}
            />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Trophy size={13} style={{ color: "#10b981" }} />
            <span>Уровень Мастер</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={styles.kpiVal} style={{ color: "#10b981" }}>
              {masteryPercent}%
            </span>
            <span className={styles.kpiSub}>{mastered} задач</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={[styles.kpiProgressBar, styles.green].join(" ")}
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Clock size={13} style={{ color: "var(--accent-blue, #3b82f6)" }} />
            <span>Средний интервал</span>
          </div>
          <div className={styles.kpiValRow}>
            <span className={styles.kpiVal} style={{ color: "var(--accent-blue, #3b82f6)" }}>
              {avgInterval}
            </span>
            <span className={styles.kpiSub}>дней</span>
          </div>
          <div className={styles.kpiProgress}>
            <div
              className={[styles.kpiProgressBar, styles.blue].join(" ")}
              style={{ width: `${Math.min(100, (avgInterval / 60) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
);

SpacedRepetitionKpiGrid.displayName = "SpacedRepetitionKpiGrid";
