import { memo, useMemo } from "react";
import {
  PieChart as PieChartIcon,
  BarChart3,
  RotateCcw,
  CalendarClock,
  CircleSlash,
} from "lucide-react";
import { Tabs, TabItem, NotificationBadge } from "@/shared/ui";
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
    const tabItems: TabItem[] = useMemo(
      () => [
        {
          id: "distribution",
          label: "Статистика",
          icon: <PieChartIcon size={15} />,
        },
        {
          id: "schedule",
          label: "Графики",
          icon: <BarChart3 size={15} />,
        },
        {
          id: "due",
          label: "Повтор",
          icon: <RotateCcw size={15} />,
          badge: (
            <NotificationBadge
              count={dueTasksCount}
              variant="yellow"
              pinned={false}
              ring={false}
              size="sm"
            />
          ),
        },
        {
          id: "upcoming",
          label: "В очереди",
          icon: <CalendarClock size={15} />,
          badge: (
            <NotificationBadge
              count={upcomingTasksCount}
              variant="blue"
              pinned={false}
              ring={false}
              size="sm"
            />
          ),
        },
        {
          id: "unsolved",
          label: "Нерешенные",
          icon: <CircleSlash size={15} />,
          badge: (
            <NotificationBadge
              count={unsolvedTasksCount}
              variant="red"
              pinned={false}
              ring={false}
              size="sm"
            />
          ),
        },
      ],
      [dueTasksCount, upcomingTasksCount, unsolvedTasksCount]
    );

    return (
      <Tabs
        orientation="vertical"
        items={tabItems}
        activeId={activeTab}
        onChange={(id) => onSelectTab(id as SRTabType)}
        ariaLabel="Вкладки аналитики"
        className={styles.tabBar}
      />
    );
  }
);

SpacedRepetitionTabBar.displayName = "SpacedRepetitionTabBar";
