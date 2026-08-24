import React, { memo } from "react";
import { Task } from "@/entities/task";
import { selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { getGroupCompletionClass, ReviewItem } from "@/entities/review";
import { SidebarSubgroupHeader } from "./SidebarSubgroupHeader/SidebarSubgroupHeader";
import { SidebarTasksList } from "./SidebarTasksList";

export interface SidebarJsSubgroupItemProps {
  groupName: string;
  subName: string;
  tasks: Task[];
  groupColor?: string;
  isSubOpen: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  currentTaskId: string;
  decodedCurrentId: string;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
}

export const SidebarJsSubgroupItem = memo(
  ({
    groupName,
    subName,
    tasks,
    groupColor,
    isSubOpen,
    onToggle,
    currentTaskId,
    decodedCurrentId,
    progressState,
    reviews,
  }: SidebarJsSubgroupItemProps) => {
    const subCompleted = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
    const subCompletionClass = getGroupCompletionClass(
      tasks,
      reviews,
      progressState.completedTasks
    );
    const subgroupId = `subgroup-${groupName}-${subName}`;
    const isSubFolderActive =
      decodedCurrentId === subgroupId ||
      currentTaskId === subgroupId ||
      decodedCurrentId === `subgroup-${subName}` ||
      currentTaskId === `subgroup-${subName}`;

    return (
      <div>
        <SidebarSubgroupHeader
          to="/javascript/$taskId"
          params={{ taskId: subgroupId }}
          title={subName}
          folderColor={groupColor}
          chevronExpanded={isSubOpen}
          onToggle={onToggle}
          isActive={isSubFolderActive}
          isCompleted={subCompleted > 0 && subCompleted === tasks.length}
          completedClass={subCompletionClass}
          completedCount={subCompleted}
          totalCount={tasks.length}
        />

        <SidebarTasksList
          tasks={tasks}
          to="/javascript/$taskId"
          currentTaskId={currentTaskId}
          progressState={progressState}
          reviews={reviews}
          expanded={isSubOpen}
        />
      </div>
    );
  }
);

SidebarJsSubgroupItem.displayName = "SidebarJsSubgroupItem";
