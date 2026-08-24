import React, { memo } from "react";
import { Task, getAlgoGroupMeta } from "@/entities/task";
import { selectIsTaskCompleted, ProgressState } from "@/entities/progress";
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
  progressState: ProgressState;
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
    progressState,
    reviews,
  }: SidebarAlgoGroupItemProps) => {
    const completedCount = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
    const groupCompletionClass = getGroupCompletionClass(
      tasks,
      reviews,
      progressState.completedTasks
    );
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
          progressState={progressState}
          reviews={reviews}
          expanded={isGroupOpen}
        />
      </div>
    );
  }
);

SidebarAlgoGroupItem.displayName = "SidebarAlgoGroupItem";
