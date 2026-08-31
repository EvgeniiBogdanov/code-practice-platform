import React from "react";
import type { ReviewItem } from "@/entities/review";
import type { SectionType, Task } from "@/entities/task";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskTableHeader, TaskTableRow } from "@/features/task-table";
import type { FavoriteTaskStatus } from "../model/use-favorites-page";
import styles from "./FavoritesPage.module.css";

export interface FavoriteTaskListProps {
  tasks: Task[];
  section: SectionType;
  reviews: Record<string, ReviewItem>;
  getTaskStatus: (taskId: string | number) => FavoriteTaskStatus;
}

export const FavoriteTaskList = ({
  tasks,
  section,
  reviews,
  getTaskStatus,
}: Readonly<FavoriteTaskListProps>): React.JSX.Element => {
  const taskRoute = `/${section}/$taskId`;

  return (
    <div className={styles.taskList}>
      <TaskTableHeader />
      {tasks.map((task) => (
        <TaskTableRow
          key={task.id}
          task={task}
          to={taskRoute}
          status={getTaskStatus(task.id)}
          review={reviews[String(task.id)]}
          favoriteMarker={
            <TaskFavoriteButton
              taskId={task.id}
              taskTitle={task.title}
              size="sm"
              iconSize={13}
              className={styles.taskFavoriteQuickAction}
            />
          }
        />
      ))}
    </div>
  );
};
