import React, { memo } from "react";
import { Task } from "@/entities/task";
import { isTaskCompleted, ProgressState } from "@/entities/progress";
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
  completedTasks: ProgressState["completedTasks"];
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
    completedTasks,
    reviews,
  }: SidebarJsSubgroupItemProps) => {
    const subCompleted = tasks.filter((task) =>
      isTaskCompleted(completedTasks[String(task.id)])
    ).length;
    const subCompletionClass = getGroupCompletionClass(tasks, reviews, completedTasks);
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
          completedTasks={completedTasks}
          reviews={reviews}
          expanded={isSubOpen}
        />
      </div>
    );
  }
);

SidebarJsSubgroupItem.displayName = "SidebarJsSubgroupItem";
