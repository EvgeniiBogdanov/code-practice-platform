import React, { useMemo } from "react";
import { clsx } from "clsx";
import { ALL_REACT_TASKS } from "@/entities/task";
import { useSidebarReactList } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarReactCategoryItem } from "./SidebarReactCategoryItem";
import { getReactCategories } from "../lib/get-react-categories";
import styles from "./SidebarReactList.module.css";

export interface SidebarReactListProps {
  className?: string;
}

export const SidebarReactList = ({ className }: SidebarReactListProps): React.JSX.Element => {
  const { currentTaskId, progressState, reviews, uiState, completedTotal } = useSidebarReactList();

  const categories = useMemo(() => getReactCategories(uiState), [uiState]);

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={ALL_REACT_TASKS.length}
        sectionType="react"
      />

      {categories.map((cat) => (
        <SidebarReactCategoryItem
          key={cat.id}
          category={cat}
          currentTaskId={currentTaskId}
          progressState={progressState}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarReactList.displayName = "SidebarReactList";
