import React from "react";
import { clsx } from "clsx";
import { ALL_JS_TASKS } from "@/entities/task";
import { useSidebarJsList } from "../model/useSidebarJsList";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarJsGroupItem } from "./SidebarJsGroupItem";
import styles from "./SidebarJsList.module.css";

export interface SidebarJsListProps {
  className?: string;
}

export const SidebarJsList = ({ className }: SidebarJsListProps) => {
  const {
    currentTaskId,
    decodedCurrentId,
    progressState,
    reviews,
    expandedGroups,
    expandedSubgroups,
    toggleGroup,
    toggleSubgroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
  } = useSidebarJsList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={ALL_JS_TASKS.length}
        sectionType="javascript"
      />

      {Object.entries(groupedTasks).map(([groupName, subgroups]) => (
        <SidebarJsGroupItem
          key={groupName}
          groupName={groupName}
          subgroups={subgroups}
          groupMeta={groupMetaMap[groupName]}
          isGroupOpen={Boolean(expandedGroups[groupName])}
          onToggleGroup={() => toggleGroup(groupName)}
          expandedSubgroups={expandedSubgroups}
          onToggleSubgroup={toggleSubgroup}
          currentTaskId={currentTaskId}
          decodedCurrentId={decodedCurrentId}
          progressState={progressState}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarJsList.displayName = "SidebarJsList";
