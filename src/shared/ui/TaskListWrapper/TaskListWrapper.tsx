import React, { useState, useEffect, useRef } from "react";
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
    const isInitialMount = useRef(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      setHasInteracted(true);
    }, [expanded]);

    return (
      <div
        className={clsx(
          styles.taskListWrapper,
          expanded ? styles.expanded : styles.collapsed,
          isSubgroup ? styles.subgroupsContainer : styles.tasksContainer,
          !hasInteracted && styles.noTransition,
          className
        )}
      >
        <div className={styles.taskListInner}>{children}</div>
      </div>
    );
  }
);

TaskListWrapper.displayName = "TaskListWrapper";
