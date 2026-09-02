import { memo } from "react";
import { Calendar, Lock, Bot, RotateCcw } from "lucide-react";
import { clsx, Tooltip } from "@/shared/ui";
import { ReviewItem, ReviewBadgeMeta, formatLastSolved, useReviewStore, DEFAULT_ASSISTANT_NAME } from "@/entities/review";
import { Task } from "@/entities/task";
import { getRobotMessage } from "../../lib/get-robot-message";
import { getOverdueDays } from "../../lib/robot-messages";
import styles from "./TaskReviewRatingBar.module.css";

interface TaskReviewHeaderProps {
  taskReview: ReviewItem | null;
  badgeMeta?: ReviewBadgeMeta;
  canRate: boolean;
  task?: Task;
  isUnsolved?: boolean;
  isExcluded?: boolean;
  statusUpdatedAt?: number;
}

export const TaskReviewHeader = memo(
  ({
    taskReview,
    canRate,
    task,
    isUnsolved,
    isExcluded,
    statusUpdatedAt,
  }: TaskReviewHeaderProps) => {
    const assistantName = useReviewStore((state) => state.assistantName) || DEFAULT_ASSISTANT_NAME;
    const isDue = Boolean(taskReview && canRate);
    const message = getRobotMessage({
      taskReview,
      canRate,
      task,
      isUnsolved,
      statusUpdatedAt,
    });

    let dueBadgeLabel = "Пора повторить";
    if (taskReview && isDue) {
      const overdueDays = getOverdueDays(taskReview.dueDate, taskReview.nextReviewAt);
      if (overdueDays >= 30) {
        dueBadgeLabel = "Просрочено: месяц";
      } else if (overdueDays >= 8) {
        dueBadgeLabel = "Просрочено: 2 нед.";
      } else if (overdueDays >= 1) {
        dueBadgeLabel = "Просрочено: 1 нед.";
      }
    }

    return (
      <div className={styles.taskReviewHeaderRow}>
        <div className={styles.taskReviewInfo}>
          <div
            className={clsx(
              styles.avatar,
              isExcluded
                ? styles.avatarExcluded
                : isUnsolved
                  ? styles.avatarUnsolved
                  : isDue && styles.avatarDue
            )}
            aria-hidden="true"
          >
            <Bot size={18} />
          </div>

          <div className={styles.taskReviewTexts}>
            <div className={styles.taskReviewTitle}>
              <span
                className={clsx(
                  styles.authorName,
                  isExcluded
                    ? styles.authorNameExcluded
                    : isUnsolved
                      ? styles.authorNameUnsolved
                      : isDue && styles.authorNameDue
                )}
              >
                {assistantName}
              </span>

              {!isExcluded && !isUnsolved && (
                <>
                  {isDue ? (
                    <span className={clsx(styles.lastSolvedBadge, styles.badgeDue)}>
                      <RotateCcw size={12} />
                      <span>{dueBadgeLabel}</span>
                    </span>
                  ) : (
                    <>
                      {taskReview?.lastReviewedAt && (
                        <Tooltip
                          content={`Дата последнего решения: ${new Date(
                            taskReview.lastReviewedAt
                          ).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`}
                          side="top"
                        >
                          <span className={styles.lastSolvedBadge}>
                            <Calendar size={12} />
                            <span>Решено: {formatLastSolved(taskReview.lastReviewedAt)}</span>
                          </span>
                        </Tooltip>
                      )}

                      {!canRate && (
                        <Tooltip
                          content="Повторение запланировано. Блок оценки станет доступен, когда наступит срок повторения задачи"
                          side="top"
                        >
                          <span className={styles.lockedBadge}>
                            <Lock size={12} />
                            <span>Запланировано</span>
                          </span>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div className={styles.taskReviewDesc}>
              {isExcluded ? (
                <span className={styles.messageTextExcluded}>
                  Задача исключена из цикла повторений
                </span>
              ) : (
                <span>
                  {message.text}
                  {message.highlight && (
                    <>
                      {" "}
                      <strong>{message.highlight}</strong>
                      {"."}
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskReviewHeader.displayName = "TaskReviewHeader";
