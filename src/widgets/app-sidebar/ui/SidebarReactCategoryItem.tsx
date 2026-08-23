import React, { memo } from "react";
import { Task } from "@/entities/task";
import { selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { getGroupCompletionClass, ReviewItem } from "@/entities/review";
import { SidebarGroupHeader } from "./SidebarGroupHeader/SidebarGroupHeader";
import { SidebarTasksList } from "./SidebarTasksList";
import styles from "./SidebarReactList.module.css";

export interface ReactCategoryDef {
  id: string;
  infoId: string;
  label: string;
  icon: React.ReactNode;
  tasks: Task[];
  isExpanded: boolean;
  toggle: () => void;
}

export interface SidebarReactCategoryItemProps {
  category: ReactCategoryDef;
  currentTaskId: string;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
}

export const SidebarReactCategoryItem = memo(
  ({ category, currentTaskId, progressState, reviews }: SidebarReactCategoryItemProps) => {
    const { id, infoId, label, icon, tasks, isExpanded, toggle } = category;
    const completedCount = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
    const completionClass = getGroupCompletionClass(tasks, reviews, progressState.completedTasks);
    const isFolderActive = currentTaskId === infoId;

    return (
      <div key={id} className={styles.treeGroupBlock}>
        <SidebarGroupHeader
          to="/react/$taskId"
          params={{ taskId: infoId }}
          title={label}
          icon={icon}
          chevronExpanded={isExpanded}
          onToggle={toggle}
          isActive={isFolderActive}
          isCompleted={completedCount > 0 && completedCount === tasks.length}
          completedClass={completionClass}
          completedCount={completedCount}
          totalCount={tasks.length}
        />

        <SidebarTasksList
          tasks={tasks}
          to="/react/$taskId"
          currentTaskId={currentTaskId}
          progressState={progressState}
          reviews={reviews}
          expanded={isExpanded}
        />
      </div>
    );
  }
);

SidebarReactCategoryItem.displayName = "SidebarReactCategoryItem";
