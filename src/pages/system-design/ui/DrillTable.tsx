import React from "react";
import { getTaskRoute, type Task } from "@/entities/task";
import { isTaskCompleted, useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskTableHeader, TaskTableRow, type TaskRowStatus } from "@/features/task-table";
import styles from "./DrillTable.module.css";

export interface DrillTableProps {
  drills: readonly Task[];
}

/** The «Дриллы» folder: the same table of tasks as on the group pages of the other sections. */
export const DrillTable = ({ drills }: DrillTableProps): React.JSX.Element => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const getStatus = (taskId: string | number): TaskRowStatus => {
    const status = completedTasks[String(taskId)];
    if (isTaskCompleted(status)) return "solved";
    return status === "unsolved" ? "unsolved" : "unstarted";
  };

  return (
    <div className={styles.table}>
      <TaskTableHeader />
      {drills.map((task) => (
        <TaskTableRow
          key={task.id}
          task={task}
          to={getTaskRoute(task)}
          status={getStatus(task.id)}
          review={reviews[String(task.id)]}
          isExcluded={excludedTaskIds.includes(String(task.id))}
          favoriteMarker={
            <TaskFavoriteButton
              taskId={task.id}
              size="sm"
              iconSize={13}
              className={styles.favorite}
            />
          }
        />
      ))}
    </div>
  );
};
