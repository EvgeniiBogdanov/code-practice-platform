import { memo } from "react";
import { PieChart as PieChartIcon, BarChart3, RotateCcw, CalendarClock } from "lucide-react";
import { NotificationBadge } from "@/shared/ui";
import styles from "./SpacedRepetitionSection.module.css";

export type SRTabType = "distribution" | "schedule" | "due" | "upcoming";

interface SpacedRepetitionTabBarProps {
  activeTab: SRTabType;
  dueTasksCount: number;
  upcomingTasksCount: number;
  onSelectTab: (tab: SRTabType) => void;
}

export const SpacedRepetitionTabBar = memo(
  ({ activeTab, dueTasksCount, upcomingTasksCount, onSelectTab }: SpacedRepetitionTabBarProps) => {
    return (
      <nav className={styles.tabBar} aria-label="Вкладки аналитики">
        <button
          type="button"
          className={[styles.tabBtn, activeTab === "distribution" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("distribution")}
        >
          <PieChartIcon size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Статистика</span>
        </button>

        <button
          type="button"
          className={[styles.tabBtn, activeTab === "schedule" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("schedule")}
        >
          <BarChart3 size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Графики</span>
        </button>

        <button
          type="button"
          className={[styles.tabBtn, activeTab === "due" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("due")}
        >
          <RotateCcw size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Срочные задачи</span>
          <NotificationBadge
            count={dueTasksCount}
            variant="yellow"
            pinned={false}
            ring={false}
            size="sm"
          />
        </button>

        <button
          type="button"
          className={[styles.tabBtn, activeTab === "upcoming" && styles.active]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTab("upcoming")}
        >
          <CalendarClock size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Предстоящий повтор</span>
          <NotificationBadge
            count={upcomingTasksCount}
            variant="blue"
            pinned={false}
            ring={false}
            size="sm"
          />
        </button>
      </nav>
    );
  }
);

SpacedRepetitionTabBar.displayName = "SpacedRepetitionTabBar";
