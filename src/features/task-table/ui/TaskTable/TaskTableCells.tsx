import React from "react";
import { Calendar, Check, Minus, RotateCcw, X } from "lucide-react";
import { formatLastSolved, formatNextReviewDate, isTaskDue } from "@/entities/review";
import type { ReviewItem } from "@/entities/review";
import { Badge } from "@/shared/ui";
import type { TaskRowStatus } from "../../model/task-row-tone";
import styles from "./TaskTable.module.css";

interface TaskTableCellProps {
  review?: ReviewItem;
}

const TaskSolutionCell = ({ review }: Readonly<TaskTableCellProps>): React.JSX.Element => (
  <div className={styles.columnSolution}>
    {review?.lastReviewedAt ? (
      <Badge
        variant="gray"
        size="sm"
        uppercase={false}
        icon={<Calendar size={11} />}
        title={`Дата последнего решения: ${new Date(review.lastReviewedAt).toLocaleDateString(
          "ru-RU",
          { day: "numeric", month: "long", year: "numeric" }
        )}`}
      >
        {formatLastSolved(review.lastReviewedAt)}
      </Badge>
    ) : (
      <span className={styles.statusUnstarted} title="Ещё не решалась">
        <Minus size={8} />
      </span>
    )}
  </div>
);

const TaskReviewCell = ({ review }: Readonly<TaskTableCellProps>): React.JSX.Element => {
  const due = isTaskDue(review);
  return (
    <div className={styles.columnReview}>
      {due ? (
        <Badge variant="yellow" size="sm" uppercase={false} title="Пора повторить сегодня">
          Пора повторить
        </Badge>
      ) : review?.nextReviewAt ? (
        <Badge
          variant="blue"
          size="sm"
          uppercase={false}
          title={`Следующее повторение: ${formatNextReviewDate(review)}`}
        >
          {formatNextReviewDate(review)}
        </Badge>
      ) : (
        <span className={styles.statusUnstarted} title="Повторение не запланировано">
          <Minus size={8} />
        </span>
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
