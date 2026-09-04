import { memo } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { UiSkeleton } from "@/shared/ui";
import styles from "./StatsModalSkeleton.module.css";

interface SkeletonTab {
  id: string;
  width: number;
  hasBadge: boolean;
}

const SKELETON_TABS: readonly SkeletonTab[] = [
  { id: "distribution", width: 72, hasBadge: false },
  { id: "schedule", width: 56, hasBadge: false },
  { id: "due", width: 52, hasBadge: true },
  { id: "upcoming", width: 68, hasBadge: true },
  { id: "unsolved", width: 84, hasBadge: true },
] as const;

interface SkeletonKpi {
  id: string;
  titleWidth: number;
  valWidth: number;
  subWidth: number;
  progressWidth: string;
}

const SKELETON_KPIS: readonly SkeletonKpi[] = [
  { id: "reviewed", titleWidth: 72, valWidth: 36, subWidth: 38, progressWidth: "65%" },
  { id: "due", titleWidth: 80, valWidth: 24, subWidth: 44, progressWidth: "40%" },
  { id: "mastered", titleWidth: 92, valWidth: 42, subWidth: 50, progressWidth: "75%" },
  { id: "interval", titleWidth: 104, valWidth: 28, subWidth: 32, progressWidth: "50%" },
] as const;

interface SkeletonStage {
  id: string;
  titleWidth: number;
  descWidth: number;
}

const SKELETON_STAGES: readonly SkeletonStage[] = [
  { id: "mastered", titleWidth: 140, descWidth: 240 },
  { id: "reviewing", titleWidth: 150, descWidth: 215 },
  { id: "learning", titleWidth: 125, descWidth: 255 },
  { id: "unreviewed", titleWidth: 115, descWidth: 200 },
] as const;

interface SkeletonSidebarProps {
  tabs: readonly SkeletonTab[];
}

const SkeletonSidebar = memo(({ tabs }: SkeletonSidebarProps): React.JSX.Element => (
  <aside className={styles.sidebar}>
    <div className={styles.sidebarTop}>
      <div className={styles.workspaceHeader}>
        <UiSkeleton variant="rounded" width={26} height={26} radius={5} />
        <div className={styles.workspaceInfo}>
          <UiSkeleton variant="rounded" width={75} height={14} radius={3} />
          <UiSkeleton variant="rounded" width={55} height={11} radius={3} />
        </div>
      </div>

      <div className={styles.navGroup}>
        <div className={styles.sectionTitleWrapper}>
          <UiSkeleton variant="rounded" width={64} height={11} radius={3} />
        </div>
        <div className={styles.tabBar}>
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={clsx(styles.navItem, index === 0 && styles.navItemActive)}
            >
              <UiSkeleton variant="rounded" width={15} height={15} radius={4} />
              <div className={styles.tabLabelWrapper}>
                <UiSkeleton variant="rounded" width={tab.width} height={13} radius={3} />
              </div>
              {tab.hasBadge && (
                <UiSkeleton variant="rounded" width={20} height={18} radius={9999} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </aside>
));
SkeletonSidebar.displayName = "SkeletonSidebar";

interface SkeletonKpiGridProps {
  kpis: readonly SkeletonKpi[];
}

const SkeletonKpiGrid = memo(({ kpis }: SkeletonKpiGridProps): React.JSX.Element => (
  <div className={styles.kpiGrid}>
    {kpis.map((kpi) => (
      <div key={kpi.id} className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <UiSkeleton variant="circular" width={13} height={13} />
          <UiSkeleton variant="rounded" width={kpi.titleWidth} height={12} radius={3} />
        </div>
        <div className={styles.kpiValRow}>
          <UiSkeleton variant="rounded" width={kpi.valWidth} height={20} radius={4} />
          <UiSkeleton variant="rounded" width={kpi.subWidth} height={12} radius={3} />
        </div>
        <div className={styles.kpiProgress}>
          <UiSkeleton variant="rounded" width={kpi.progressWidth} height={3} radius={2} />
        </div>
      </div>
    ))}
  </div>
));
SkeletonKpiGrid.displayName = "SkeletonKpiGrid";

interface SkeletonDistributionViewProps {
  stages: readonly SkeletonStage[];
}

const SkeletonDistributionView = memo(
  ({ stages }: SkeletonDistributionViewProps): React.JSX.Element => (
    <div className={styles.distributionView}>
      <div className={styles.chartCol}>
        <div className={styles.donutPlaceholder}>
          <UiSkeleton variant="circular" width={190} height={190} />
          <div className={styles.donutHole}>
            <UiSkeleton variant="rounded" width={52} height={22} radius={4} />
            <UiSkeleton variant="rounded" width={68} height={10} radius={3} />
          </div>
        </div>
      </div>

      <div className={styles.legendCol}>
        <div className={styles.legendHeaderWrapper}>
          <UiSkeleton variant="rounded" width={160} height={14} radius={3} />
        </div>
        <div className={styles.stageList}>
          {stages.map((stage) => (
            <div key={stage.id} className={styles.stageItem}>
              <UiSkeleton variant="circular" width={8} height={8} />
              <div className={styles.stageInfo}>
                <UiSkeleton variant="rounded" width={stage.titleWidth} height={14} radius={3} />
                <UiSkeleton variant="rounded" width={stage.descWidth} height={12} radius={3} />
              </div>
              <UiSkeleton variant="rounded" width={28} height={20} radius={9999} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);
SkeletonDistributionView.displayName = "SkeletonDistributionView";

export interface StatsModalSkeletonProps {
  onClose?: () => void;
  className?: string;
}

export const StatsModalSkeleton = memo(
  ({ onClose, className }: StatsModalSkeletonProps): React.JSX.Element => {
    return (
      <div
        className={clsx(styles.container, className)}
        role="status"
        aria-label="Загрузка статистики повторений"
      >
        <SkeletonSidebar tabs={SKELETON_TABS} />

        <main className={styles.main}>
          {onClose ? (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Закрыть статистику повторений"
            >
              <X size={16} />
            </button>
          ) : (
            <div className={styles.closeBtnPlaceholder}>
              <UiSkeleton variant="rounded" width={24} height={24} radius={6} />
            </div>
          )}

          <div className={styles.mainScrollable}>
            <div className={styles.pageHeader}>
              <UiSkeleton variant="rounded" width={360} height={28} radius={6} />
              <UiSkeleton variant="rounded" width={490} height={16} radius={4} />
            </div>

            <div className={styles.viewContent}>
              <SkeletonKpiGrid kpis={SKELETON_KPIS} />
              <div className={styles.sectionDivider} />
              <SkeletonDistributionView stages={SKELETON_STAGES} />
            </div>
          </div>
        </main>
      </div>
    );
  }
);

StatsModalSkeleton.displayName = "StatsModalSkeleton";



