import React from "react";
import { FileText } from "lucide-react";
import { clsx } from "clsx";
import type { ReviewItem } from "@/entities/review";
import type { Task } from "@/entities/task";
import { TreeNodeHeader } from "@/shared/ui";
import { getTaskRowTone } from "../../model/task-row-tone";
import type { TaskRowStatus } from "../../model/task-row-tone";
import { TaskTableCells } from "./TaskTableCells";
import styles from "./TaskTable.module.css";

export interface TaskTableRowProps {
  task: Task;
  to: string;
  status: TaskRowStatus;
  review?: ReviewItem;
  favoriteMarker?: React.ReactNode;
}

export const TaskTableRow = React.memo(
  ({
    task,
    to,
    status,
    review,
    favoriteMarker,
  }: Readonly<TaskTableRowProps>): React.JSX.Element => {
    const tone = getTaskRowTone(task, status, review);

    return (
      <TreeNodeHeader
        to={to}
        params={{ taskId: String(task.id) }}
        className={clsx(styles.taskRow, styles[`tone_${tone}`])}
      >
        <span className={styles.taskTitle}>
          <FileText size={16} className={styles.fileIcon} />
          <span className={styles.taskTitleText}>{task.title}</span>
        </span>
        <TaskTableCells status={status} review={review} favoriteMarker={favoriteMarker} />
      </TreeNodeHeader>
    );
  }
);

TaskTableRow.displayName = "TaskTableRow";
