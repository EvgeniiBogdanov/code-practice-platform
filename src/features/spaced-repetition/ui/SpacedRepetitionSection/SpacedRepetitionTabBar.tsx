import { memo } from "react";
import {
  PieChart as PieChartIcon,
  BarChart3,
  RotateCcw,
  CalendarClock,
  CircleSlash,
} from "lucide-react";
import { clsx } from "clsx";
import { NotificationBadge } from "@/shared/ui";
import styles from "./SpacedRepetitionSection.module.css";

export type SRTabType = "distribution" | "schedule" | "due" | "upcoming" | "unsolved";

interface SpacedRepetitionTabBarProps {
  activeTab: SRTabType;
  dueTasksCount: number;
  upcomingTasksCount: number;
  unsolvedTasksCount: number;
  onSelectTab: (tab: SRTabType) => void;
}

export const SpacedRepetitionTabBar = memo(
  ({
    activeTab,
    dueTasksCount,
    upcomingTasksCount,
    unsolvedTasksCount,
    onSelectTab,
  }: SpacedRepetitionTabBarProps) => {
    return (
      <nav className={styles.tabBar} aria-label="Вкладки аналитики">
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === "distribution" && styles.active)}
          onClick={() => onSelectTab("distribution")}
        >
          <PieChartIcon size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Статистика</span>
        </button>

        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === "schedule" && styles.active)}
          onClick={() => onSelectTab("schedule")}
        >
          <BarChart3 size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Графики</span>
        </button>

        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === "due" && styles.active)}
          onClick={() => onSelectTab("due")}
        >
          <RotateCcw size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Повтор</span>
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
          className={clsx(styles.tabBtn, activeTab === "upcoming" && styles.active)}
          onClick={() => onSelectTab("upcoming")}
        >
          <CalendarClock size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>В очереди</span>
          <NotificationBadge
            count={upcomingTasksCount}
            variant="blue"
            pinned={false}
            ring={false}
            size="sm"
          />
        </button>

        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === "unsolved" && styles.active)}
          onClick={() => onSelectTab("unsolved")}
        >
          <CircleSlash size={15} className={styles.tabBtnIcon} />
          <span className={styles.tabBtnLabel}>Нерешенные</span>
          <NotificationBadge
            count={unsolvedTasksCount}
            variant="red"
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
