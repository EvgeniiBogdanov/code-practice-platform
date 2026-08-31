import { memo, useMemo } from "react";
import {
  PieChart as PieChartIcon,
  BarChart3,
  RotateCcw,
  CalendarClock,
  CircleSlash,
} from "lucide-react";
import { Tabs, TabItem } from "@/shared/ui";
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
          badge: dueTasksCount,
          badgeVariant: "yellow",
        },
        {
          id: "upcoming",
          label: "В очереди",
          icon: <CalendarClock size={15} />,
          badge: upcomingTasksCount,
          badgeVariant: "blue",
        },
        {
          id: "unsolved",
          label: "Нерешенные",
          icon: <CircleSlash size={15} />,
          badge: unsolvedTasksCount,
          badgeVariant: "red",
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
