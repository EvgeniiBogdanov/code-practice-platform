import React from "react";
import { clsx } from "clsx";
import { useSidebarJsList, useSidebarSync } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarJsGroupItem } from "./SidebarJsGroupItem";
import styles from "./SidebarJsList.module.css";

export interface SidebarJsListProps {
  className?: string;
  section?: "javascript" | "typescript";
}

export const SidebarJsList = ({
  className,
  section = "javascript",
}: SidebarJsListProps): React.JSX.Element => {
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
  } = useSidebarJsList(section);

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType={section}
      >
        <SidebarQuickActions section={section} currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      {Object.entries(groupedTasks).map(([groupName, subgroups]) => (
        <SidebarJsGroupItem
          key={groupName}
          section={section}
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
