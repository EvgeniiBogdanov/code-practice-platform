import React from "react";
import { clsx } from "clsx";
import { useSidebarJsList, useSidebarSync } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarJsGroupItem } from "./SidebarJsGroupItem";
import styles from "./SidebarJsList.module.css";

export interface SidebarJsListProps {
  className?: string;
}

export const SidebarJsList = ({ className }: SidebarJsListProps): React.JSX.Element => {
  useSidebarSync();
  const {
    currentTaskId,
    decodedCurrentId,
    completedTasks,
    reviews,
    expandedGroups,
    expandedSubgroups,
    toggleGroup,
    toggleSubgroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
    totalCount,
  } = useSidebarJsList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType="javascript"
      >
        <SidebarQuickActions section="javascript" currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      {Object.entries(groupedTasks).map(([groupName, subgroups]) => (
        <SidebarJsGroupItem
          key={groupName}
          groupName={groupName}
          subgroups={subgroups}
          groupMeta={groupMetaMap[groupName]}
          isGroupOpen={Boolean(expandedGroups[groupName])}
          onToggleGroup={(e) => toggleGroup(groupName, e)}
          expandedSubgroups={expandedSubgroups}
          onToggleSubgroup={toggleSubgroup}
          currentTaskId={currentTaskId}
          decodedCurrentId={decodedCurrentId}
          completedTasks={completedTasks}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarJsList.displayName = "SidebarJsList";
