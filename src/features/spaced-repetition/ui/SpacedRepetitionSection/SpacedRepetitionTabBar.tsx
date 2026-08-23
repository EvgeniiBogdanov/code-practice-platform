import { memo } from "react";
import { PieChart as PieChartIcon, BarChart3, RotateCcw } from "lucide-react";
import styles from "./SpacedRepetitionSection.module.css";

export type SRTabType = "distribution" | "schedule" | "due";

interface SpacedRepetitionTabBarProps {
  activeTab: SRTabType;
  dueTasksCount: number;
  onSelectTab: (tab: SRTabType) => void;
}

export const SpacedRepetitionTabBar = memo(
  ({ activeTab, dueTasksCount, onSelectTab }: SpacedRepetitionTabBarProps) => {
    return (
      <div className={styles.tabBar}>
        <button
          type="button"
          className={[styles.tabBtn, activeTab === "distribution" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("distribution")}
        >
          <PieChartIcon size={13} />
          <span>Распределение мастерства</span>
        </button>

        <button
          type="button"
          className={[styles.tabBtn, activeTab === "schedule" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("schedule")}
        >
          <BarChart3 size={13} />
          <span>График повторений</span>
        </button>

        <button
          type="button"
          className={[styles.tabBtn, activeTab === "due" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("due")}
        >
          <RotateCcw size={13} />
          <span>Срочные задачи</span>
          {dueTasksCount > 0 && <span className={styles.tabDueBadge}>{dueTasksCount}</span>}
        </button>
      </div>
    );
  }
);

SpacedRepetitionTabBar.displayName = "SpacedRepetitionTabBar";
