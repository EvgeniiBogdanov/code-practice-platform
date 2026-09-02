import React from "react";
import { Calendar, Check, Minus, RotateCcw, X } from "lucide-react";
import { formatLastSolved, formatNextReviewDate, isTaskDue } from "@/entities/review";
import type { ReviewItem } from "@/entities/review";
import { Badge, Tooltip } from "@/shared/ui";
import type { TaskRowStatus } from "../../model/task-row-tone";
import styles from "./TaskTable.module.css";

interface TaskTableCellProps {
  review?: ReviewItem;
}

const TaskSolutionCell = ({ review }: Readonly<TaskTableCellProps>): React.JSX.Element => (
  <div className={styles.columnSolution}>
    {review?.lastReviewedAt ? (
      <Tooltip
        content={`Дата последнего решения: ${new Date(review.lastReviewedAt).toLocaleDateString(
          "ru-RU",
          { day: "numeric", month: "long", year: "numeric" }
        )}`}
        side="top"
      >
        <Badge
          variant="gray"
          size="sm"
          uppercase={false}
          icon={<Calendar size={11} />}
        >
          {formatLastSolved(review.lastReviewedAt)}
        </Badge>
      </Tooltip>
    ) : (
      <Tooltip content="Ещё не решалась" side="top">
        <span className={styles.statusUnstarted} aria-label="Ещё не решалась">
          <Minus size={8} />
        </span>
      </Tooltip>
    )}
  </div>
);

const TaskReviewCell = ({ review }: Readonly<TaskTableCellProps>): React.JSX.Element => {
  const due = isTaskDue(review);
  return (
    <div className={styles.columnReview}>
      {due ? (
        <Tooltip content="Пора повторить сегодня" side="top">
          <Badge variant="yellow" size="sm" uppercase={false}>
            Пора повторить
          </Badge>
        </Tooltip>
      ) : review?.nextReviewAt ? (
        <Tooltip
          content={`Следующее повторение: ${formatNextReviewDate(review)}`}
          side="top"
        >
          <Badge
            variant="blue"
            size="sm"
            uppercase={false}
          >
            {formatNextReviewDate(review)}
          </Badge>
        </Tooltip>
      ) : (
        <Tooltip content="Повторение не запланировано" side="top">
          <span className={styles.statusUnstarted} aria-label="Повторение не запланировано">
            <Minus size={8} />
          </span>
        </Tooltip>
      )}
    </div>
  );
};

interface TaskStatusCellProps extends TaskTableCellProps {
  status: TaskRowStatus;
}

const TaskStatusCell = ({ status, review }: Readonly<TaskStatusCellProps>): React.JSX.Element => {
  if (isTaskDue(review)) {
    return <RotateCcw size={11} className={styles.statusDue} aria-label="Пора повторить" />;
  }
  if (status === "solved") {
    return <Check size={13} className={styles.statusSolved} aria-label="Решено" />;
  }
  if (status === "unsolved") {
    return <X size={13} className={styles.statusUnsolved} aria-label="Не решено" />;
  }
  return <Minus size={8} className={styles.statusUnstarted} aria-label="Не начато" />;
};

export interface TaskTableCellsProps extends TaskStatusCellProps {
  favoriteMarker?: React.ReactNode;
}

export const TaskTableCells = ({
  status,
  review,
  favoriteMarker,
}: Readonly<TaskTableCellsProps>): React.JSX.Element => (
  <div className={styles.rowMeta}>
    <TaskSolutionCell review={review} />
    <TaskReviewCell review={review} />
    <span className={styles.columnStatus}>
      <TaskStatusCell status={status} review={review} />
    </span>
    <span className={styles.columnFavorite}>{favoriteMarker}</span>
  </div>
);
