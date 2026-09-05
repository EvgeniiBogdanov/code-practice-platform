import { memo } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { UiSkeleton } from "@/shared/ui";
import styles from "./CheatSheetDrawerSkeleton.module.css";

export interface CheatSheetDrawerSkeletonProps {
  onClose?: () => void;
  className?: string;
}

export const CheatSheetDrawerSkeleton = memo(
  ({ onClose, className }: CheatSheetDrawerSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.drawerSkeleton, className)}
        role="status"
        aria-label="Загрузка шпаргалки..."
      >
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <UiSkeleton variant="rounded" width={18} height={18} radius={4} />
            <UiSkeleton variant="rounded" width={110} height={16} radius={4} />
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть шпаргалку"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "var(--text-muted)",
              }}
            >
              <X size={16} />
            </button>
          ) : (
            <UiSkeleton variant="rounded" width={24} height={24} radius={6} />
          )}
        </div>

        <div className={styles.sectionTabs}>
          {[1, 2, 3].map((tab) => (
            <div key={tab} className={styles.tabItem}>
              <UiSkeleton variant="rounded" width={14} height={14} radius={3} />
              <UiSkeleton variant="rounded" width={64} height={13} radius={3} />
            </div>
          ))}
        </div>

        <div className={styles.searchPlaceholder}>
          <UiSkeleton variant="rounded" width="100%" height={36} radius={8} />
        </div>

        <div className={styles.categoryTabs}>
          {[72, 96, 84, 108].map((width, idx) => (
            <UiSkeleton key={idx} variant="rounded" width={width} height={28} radius={9999} />
          ))}
        </div>

        <div className={styles.cardList}>
          {[1, 2, 3].map((card) => (
            <div key={card} className={styles.cardItem}>
              <UiSkeleton variant="rounded" width="60%" height={16} radius={4} />
              <UiSkeleton variant="rounded" width="85%" height={12} radius={3} />
              <div className={styles.codePlaceholder}>
                <UiSkeleton variant="rounded" width="100%" height={64} radius={6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CheatSheetDrawerSkeleton.displayName = "CheatSheetDrawerSkeleton";
