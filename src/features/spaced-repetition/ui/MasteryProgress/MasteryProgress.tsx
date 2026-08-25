import React from "react";
import { clsx } from "clsx";
import { useReviewStore } from "@/entities/review";
import { ALL_TASKS, Task } from "@/entities/task";
import styles from "./MasteryProgress.module.css";

export interface MasteryProgressProps {
  taskList?: Task[];
  className?: string;
}

export function MasteryProgress({ taskList, className }: MasteryProgressProps) {
  const getMasteryStats = useReviewStore((state) => state.getMasteryStats);
  const stats = getMasteryStats(taskList || ALL_TASKS);

  const total = stats.totalCount || 1;
  const masteredPercent = Math.round((stats.mastered / total) * 100);
  const reviewingPercent = Math.round((stats.reviewing / total) * 100);
  const learningPercent = Math.round((stats.learning / total) * 100);
  const duePercent = Math.round((stats.dueToday / total) * 100);

  const masteredRef = React.useRef<HTMLDivElement>(null);
  const reviewingRef = React.useRef<HTMLDivElement>(null);
  const learningRef = React.useRef<HTMLDivElement>(null);
  const dueRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (masteredRef.current) masteredRef.current.style.width = `${masteredPercent}%`;
    if (reviewingRef.current) reviewingRef.current.style.width = `${reviewingPercent}%`;
    if (learningRef.current) learningRef.current.style.width = `${learningPercent}%`;
    if (dueRef.current) dueRef.current.style.width = `${duePercent}%`;
  }, [masteredPercent, reviewingPercent, learningPercent, duePercent]);

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.progressBar}>
        <div ref={masteredRef} className={styles.segMastered} title={`Мастер: ${stats.mastered}`} />
        <div
          ref={reviewingRef}
          className={styles.segReviewing}
          title={`Повторение: ${stats.reviewing}`}
        />
        <div
          ref={learningRef}
          className={styles.segLearning}
          title={`Изучение: ${stats.learning}`}
        />
        <div ref={dueRef} className={styles.segDue} title={`Пора повторить: ${stats.dueToday}`} />
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            {stats.totalReviewed}/{stats.totalCount}
          </span>
          <span className={styles.statLabel}>Всего изучено</span>
        </div>

        <div className={styles.statCard}>
          <span className={clsx(styles.statValue, styles.valSuccess)}>{stats.mastered}</span>
          <span className={styles.statLabel}>Освоено (5★)</span>
        </div>

        <div className={styles.statCard}>
          <span className={clsx(styles.statValue, styles.valBlue)}>{stats.reviewing}</span>
          <span className={styles.statLabel}>Повторение (3-4★)</span>
        </div>

        <div className={styles.statCard}>
          <span className={clsx(styles.statValue, styles.valPurple)}>{stats.learning}</span>
          <span className={styles.statLabel}>Изучение (1-2★)</span>
        </div>

        <div className={styles.statCard}>
          <span className={clsx(styles.statValue, styles.valWarning)}>{stats.dueToday}</span>
          <span className={styles.statLabel}>К повторению</span>
        </div>
      </div>
    </div>
  );
}
