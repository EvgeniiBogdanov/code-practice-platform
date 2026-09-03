import { memo } from "react";
import { UiSkeleton } from "@/shared/ui";
import styles from "./StatsModalSkeleton.module.css";

const TAB_WIDTHS = [140, 110, 60, 120, 110];

export const StatsModalSkeleton = memo((): React.JSX.Element => {
  return (
    <div className={styles.container} role="status" aria-label="Загрузка статистики повторений">
      <aside className={styles.sidebar}>
        <div className={styles.workspaceHeader}>
          <UiSkeleton variant="rounded" width={26} height={26} />
          <div className={styles.workspaceInfo}>
            <UiSkeleton variant="text" width={75} height={14} />
            <UiSkeleton variant="text" width={55} height={11} />
          </div>
        </div>

        <div className={styles.navGroup}>
          <UiSkeleton variant="text" width={70} height={11} style={{ margin: "4px 8px 2px" }} />
          {TAB_WIDTHS.map((width, index) => (
            <div key={index} className={styles.navItem}>
              <UiSkeleton variant="rounded" width={16} height={16} />
              <UiSkeleton variant="text" width={width} height={13} />
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <UiSkeleton variant="text" width={190} height={18} />
          <UiSkeleton variant="rounded" width={28} height={28} />
        </div>

        <div className={styles.body}>
          <div className={styles.kpiGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <UiSkeleton variant="circular" width={12} height={12} />
                  <UiSkeleton variant="text" width={70} height={11} />
                </div>
                <div className={styles.kpiValRow}>
                  <UiSkeleton variant="text" width={40} height={20} />
                  <UiSkeleton variant="text" width={30} height={11} />
                </div>
                <UiSkeleton variant="rounded" width="100%" height={3} />
              </div>
            ))}
          </div>

          <div className={styles.contentView}>
            <div className={styles.chartCard}>
              <UiSkeleton variant="circular" width={170} height={170} />
              <UiSkeleton variant="text" width={120} height={12} />
            </div>

            <div className={styles.legendCard}>
              <UiSkeleton variant="text" width={140} height={13} style={{ marginBottom: 4 }} />
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.legendItem}>
                  <UiSkeleton variant="circular" width={8} height={8} />
                  <div className={styles.legendText}>
                    <UiSkeleton variant="text" width={120} height={12} />
                    <UiSkeleton variant="text" width={160} height={10} />
                  </div>
                  <UiSkeleton variant="rounded" width={24} height={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

StatsModalSkeleton.displayName = "StatsModalSkeleton";
