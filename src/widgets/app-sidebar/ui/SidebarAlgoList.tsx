import React from "react";
import { clsx } from "clsx";
import { useSidebarAlgoList, useSidebarSync } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarAlgoGroupItem } from "./SidebarAlgoGroupItem";
import styles from "./SidebarAlgoList.module.css";

export interface SidebarAlgoListProps {
  className?: string;
}

export const SidebarAlgoList = ({ className }: SidebarAlgoListProps): React.JSX.Element => {
  useSidebarSync();
  const {
    currentTaskId,
    decodedCurrentId,
    completedTasks,
    reviews,
    expandedGroups,
    toggleGroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
    totalCount,
  } = useSidebarAlgoList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType="algorithms"
      >
        <SidebarQuickActions section="algorithms" currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      {Object.entries(groupedTasks).map(([groupName, tasks]) => (
        <SidebarAlgoGroupItem
          key={groupName}
          groupName={groupName}
          tasks={tasks}
          groupMeta={groupMetaMap[groupName]}
          isGroupOpen={Boolean(expandedGroups[groupName])}
          onToggle={(e) => toggleGroup(groupName, e)}
          currentTaskId={currentTaskId}
          decodedCurrentId={decodedCurrentId}
          completedTasks={completedTasks}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarAlgoList.displayName = "SidebarAlgoList";
