import React from "react";
import { clsx } from "clsx";
import { ALL_ALGO_TASKS } from "@/entities/task";
import { useSidebarAlgoList } from "../model/useSidebarAlgoList";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarAlgoGroupItem } from "./SidebarAlgoGroupItem";
import styles from "./SidebarAlgoList.module.css";

export interface SidebarAlgoListProps {
  className?: string;
}

export const SidebarAlgoList = ({ className }: SidebarAlgoListProps) => {
  const {
    currentTaskId,
    decodedCurrentId,
    progressState,
    reviews,
    expandedGroups,
    toggleGroup,
    groupedTasks,
    groupMetaMap,
    completedTotal,
  } = useSidebarAlgoList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={ALL_ALGO_TASKS.length}
        sectionType="algorithms"
      />

      {Object.entries(groupedTasks).map(([groupName, tasks]) => (
        <SidebarAlgoGroupItem
          key={groupName}
          groupName={groupName}
          tasks={tasks}
          groupMeta={groupMetaMap[groupName]}
          isGroupOpen={Boolean(expandedGroups[groupName])}
          onToggle={() => toggleGroup(groupName)}
          currentTaskId={currentTaskId}
          decodedCurrentId={decodedCurrentId}
          progressState={progressState}
          reviews={reviews}
        />
      ))}
    </div>
  );
};

SidebarAlgoList.displayName = "SidebarAlgoList";
