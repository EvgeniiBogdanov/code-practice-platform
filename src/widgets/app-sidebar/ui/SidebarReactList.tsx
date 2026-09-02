import React, { useMemo } from "react";
import { clsx } from "clsx";
import { useSidebarReactList, useSidebarSync } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarReactCategoryItem } from "./SidebarReactCategoryItem";
import { getReactCategories } from "../lib/get-react-categories";
import styles from "./SidebarReactList.module.css";

export interface SidebarReactListProps {
  className?: string;
}

export const SidebarReactList = ({ className }: SidebarReactListProps): React.JSX.Element => {
  useSidebarSync();
  const { currentTaskId, completedTasks, reviews, uiState, completedTotal, totalCount, tasks } =
    useSidebarReactList();

  const categories = useMemo(() => getReactCategories(uiState, tasks), [uiState, tasks]);

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType="react"
      >
        <SidebarQuickActions section="react" currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      {categories.map((cat) => (
        <SidebarReactCategoryItem
          key={cat.id}
          category={cat}
          currentTaskId={currentTaskId}
          completedTasks={completedTasks}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarReactList.displayName = "SidebarReactList";
