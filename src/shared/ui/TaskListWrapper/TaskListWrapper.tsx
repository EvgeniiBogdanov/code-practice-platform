import React from "react";
import { clsx } from "clsx";
import styles from "./TaskListWrapper.module.css";

export interface TaskListWrapperProps {
  expanded: boolean;
  children: React.ReactNode;
  isSubgroup?: boolean;
  className?: string;
}

export const TaskListWrapper = React.memo<TaskListWrapperProps>(
  ({ expanded, children, isSubgroup = false, className }) => {
    return (
      <div
        data-task-list-wrapper="true"
        data-expanded={expanded ? "true" : "false"}
        className={clsx(
          styles.taskListWrapper,
          expanded ? styles.expanded : styles.collapsed,
          isSubgroup ? styles.subgroupsContainer : styles.tasksContainer,
          className
        )}
      >
        {expanded && <div className={styles.taskListInner}>{children}</div>}
      </div>
    );
  }
);

TaskListWrapper.displayName = "TaskListWrapper";
