import React, { memo } from "react";
import { Task, getGroupMeta } from "@/entities/task";
import { selectIsTaskCompleted, ProgressState } from "@/entities/progress";
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
  onToggleGroup: () => void;
  expandedSubgroups: Record<string, boolean>;
  onToggleSubgroup: (groupName: string, subName: string) => void;
  currentTaskId: string;
  decodedCurrentId: string;
  progressState: ProgressState;
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
    progressState,
    reviews,
  } = props;

  const allTasks = Object.values(subgroups).flat();
  const completed = allTasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
  const compClass = getGroupCompletionClass(allTasks, reviews, progressState.completedTasks);
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
            onToggle={() => onToggleSubgroup(groupName, subName)}
            currentTaskId={currentTaskId}
            decodedCurrentId={decodedCurrentId}
            progressState={progressState}
            reviews={reviews}
          />
        ))}
      </TaskListWrapper>
    </div>
  );
});

SidebarJsGroupItem.displayName = "SidebarJsGroupItem";
