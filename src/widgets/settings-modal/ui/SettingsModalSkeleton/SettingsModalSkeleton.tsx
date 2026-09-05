import { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SettingsModalSkeleton.module.css";

export interface SettingsModalSkeletonProps {
  className?: string;
}

export const SettingsModalSkeleton = memo(
  ({ className }: SettingsModalSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.skeletonContainer, className)}
        role="status"
        aria-label="Загрузка настроек..."
      >
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.workspaceHeader}>
              <UiSkeleton variant="rounded" width={26} height={26} radius={5} />
              <div className={styles.workspaceInfo}>
                <UiSkeleton variant="rounded" width={80} height={14} radius={3} />
                <UiSkeleton variant="rounded" width={110} height={11} radius={3} />
              </div>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.sectionTitle}>
                <UiSkeleton variant="rounded" width={68} height={11} radius={3} />
              </div>
              <div className={styles.navItem}>
                <UiSkeleton variant="rounded" width={16} height={16} radius={4} />
                <UiSkeleton variant="rounded" width={120} height={14} radius={3} />
              </div>
              <div className={styles.navItem}>
                <UiSkeleton variant="rounded" width={16} height={16} radius={4} />
                <UiSkeleton variant="rounded" width={95} height={14} radius={3} />
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.closeBtnPlaceholder}>
            <UiSkeleton variant="rounded" width={24} height={24} radius={6} />
          </div>

          <div className={styles.mainScrollable}>
            <div className={styles.pageHeader}>
              <UiSkeleton variant="rounded" width={220} height={24} radius={6} />
              <UiSkeleton variant="rounded" width={420} height={14} radius={4} />
            </div>

            <div className={styles.cardsGrid}>
              {[1, 2, 3].map((key) => (
                <div key={key} className={styles.cardItem}>
                  <div className={styles.cardLeft}>
                    <UiSkeleton variant="rounded" width={36} height={36} radius={8} />
                    <div className={styles.cardText}>
                      <UiSkeleton variant="rounded" width={160} height={15} radius={3} />
                      <UiSkeleton variant="rounded" width={280} height={12} radius={3} />
                    </div>
                  </div>
                  <UiSkeleton variant="rounded" width={90} height={32} radius={6} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
);

SettingsModalSkeleton.displayName = "SettingsModalSkeleton";
