import React, { memo } from "react";
import type { Task } from "@/entities/task/meta";
import { getGroupMeta } from "@/entities/task/groups";
import { isTaskCompleted, ProgressState } from "@/entities/progress";
import { getGroupCompletionClass, ReviewItem } from "@/entities/review";
import { TaskListWrapper } from "@/shared/ui";
import { SidebarGroupHeader } from "./SidebarGroupHeader/SidebarGroupHeader";
import { SidebarJsSubgroupItem } from "./SidebarJsSubgroupItem";
import styles from "./SidebarJsList.module.css";

export interface SidebarJsGroupItemProps {
  groupName: string;
  subgroups: Record<string, Task[]>;
  groupMeta?: ReturnType<typeof getGroupMeta>;
  isGroupOpen: boolean;
  onToggleGroup: (e?: React.MouseEvent) => void;
  expandedSubgroups: Record<string, boolean>;
  onToggleSubgroup: (groupName: string, subName: string, e?: React.MouseEvent) => void;
  currentTaskId: string;
  decodedCurrentId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
}

export const SidebarJsGroupItem = memo((props: SidebarJsGroupItemProps) => {
  const {
    groupName,
    subgroups,
    groupMeta,
    isGroupOpen,
    onToggleGroup,
    expandedSubgroups,
    onToggleSubgroup,
    currentTaskId,
    decodedCurrentId,
    completedTasks,
    reviews,
  } = props;

  const allTasks = Object.values(subgroups).flat();
  const completed = allTasks.filter((task) => isTaskCompleted(completedTasks[String(task.id)])).length;
  const compClass = getGroupCompletionClass(allTasks, reviews, completedTasks);
  const meta = groupMeta || getGroupMeta(groupName);
  const groupParamId = `group-${groupName}`;
  const isActive = decodedCurrentId === groupParamId || currentTaskId === groupParamId;

  return (
    <div className={styles.treeGroupBlock}>
      <SidebarGroupHeader
        to="/javascript/$taskId"
        params={{ taskId: groupParamId }}
        title={groupName}
        icon={meta.renderIcon(17)}
        chevronExpanded={isGroupOpen}
        onToggle={onToggleGroup}
        isActive={isActive}
        isCompleted={completed > 0 && completed === allTasks.length}
        completedClass={compClass}
        completedCount={completed}
        totalCount={allTasks.length}
      />
      <TaskListWrapper expanded={isGroupOpen} isSubgroup={true}>
        {Object.entries(subgroups).map(([subName, tasks]) => (
          <SidebarJsSubgroupItem
            key={subName}
            groupName={groupName}
            subName={subName}
            tasks={tasks}
            groupColor={meta.color}
            isSubOpen={Boolean(expandedSubgroups[`${groupName}/${subName}`])}
            onToggle={(e) => onToggleSubgroup(groupName, subName, e)}
            currentTaskId={currentTaskId}
            decodedCurrentId={decodedCurrentId}
            completedTasks={completedTasks}
            reviews={reviews}
          />
        ))}
      </TaskListWrapper>
    </div>
  );
});

SidebarJsGroupItem.displayName = "SidebarJsGroupItem";
