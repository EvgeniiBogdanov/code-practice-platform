import React, { memo } from "react";
import type { Task } from "@/entities/task/meta";
import { getAlgoGroupMeta } from "@/entities/task/groups";
import { isTaskCompleted, ProgressState } from "@/entities/progress";
import { getGroupCompletionClass, ReviewItem } from "@/entities/review";
import { SidebarGroupHeader } from "./SidebarGroupHeader/SidebarGroupHeader";
import { SidebarTasksList } from "./SidebarTasksList";
import styles from "./SidebarAlgoList.module.css";

export interface SidebarAlgoGroupItemProps {
  groupName: string;
  tasks: Task[];
  groupMeta?: ReturnType<typeof getAlgoGroupMeta>;
  isGroupOpen: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  currentTaskId: string;
  decodedCurrentId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
}

export const SidebarAlgoGroupItem = memo(
  ({
    groupName,
    tasks,
    groupMeta,
    isGroupOpen,
    onToggle,
    currentTaskId,
    decodedCurrentId,
    completedTasks,
    reviews,
  }: SidebarAlgoGroupItemProps) => {
    const completedCount = tasks.filter((task) =>
      isTaskCompleted(completedTasks[String(task.id)])
    ).length;
    const groupCompletionClass = getGroupCompletionClass(tasks, reviews, completedTasks);
    const meta = groupMeta || getAlgoGroupMeta(groupName);
    const isFolderActive =
      currentTaskId === meta.infoId ||
      currentTaskId === `group-${groupName}` ||
      decodedCurrentId === `group-${groupName}`;

    return (
      <div className={styles.treeGroupBlock}>
        <SidebarGroupHeader
          to="/algorithms/$taskId"
          params={{ taskId: meta.infoId || "group-two-pointers" }}
          title={groupName}
          icon={meta.renderIcon(17)}
          chevronExpanded={isGroupOpen}
          onToggle={onToggle}
          isActive={isFolderActive}
          isCompleted={completedCount > 0 && completedCount === tasks.length}
          completedClass={groupCompletionClass}
          completedCount={completedCount}
          totalCount={tasks.length}
        />

        <SidebarTasksList
          tasks={tasks}
          to="/algorithms/$taskId"
          currentTaskId={currentTaskId}
          completedTasks={completedTasks}
          reviews={reviews}
          expanded={isGroupOpen}
        />
      </div>
    );
  }
);

SidebarAlgoGroupItem.displayName = "SidebarAlgoGroupItem";
