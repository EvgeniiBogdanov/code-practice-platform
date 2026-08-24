import { memo } from "react";
import { Calendar, Lock } from "lucide-react";
import {
  ReviewItem,
  ReviewBadgeMeta,
  formatNextReviewDate,
  formatLastSolved,
} from "@/entities/review";
import styles from "./TaskReviewRatingBar.module.css";

interface TaskReviewHeaderProps {
  taskReview: ReviewItem | null;
  badgeMeta: ReviewBadgeMeta;
  canRate: boolean;
}

export const TaskReviewHeader = memo(
  ({ taskReview, badgeMeta, canRate }: TaskReviewHeaderProps) => {
    const badgeClass =
      badgeMeta.badgeVariant === "due"
        ? styles.badgeDue
        : badgeMeta.badgeVariant === "master"
          ? styles.badgeMaster
          : styles.badgeLevel;

    return (
      <div className={styles.taskReviewHeaderRow}>
        <div className={styles.taskReviewInfo}>
          <div className={styles.taskReviewTexts}>
            <div className={styles.taskReviewTitle}>
              <span>Интервальное повторение</span>

              {badgeMeta.stage > 0 && (
                <span className={[styles.badge, badgeClass].join(" ")}>{badgeMeta.stageName}</span>
              )}

              {taskReview?.lastReviewedAt && (
                <span
                  className={styles.lastSolvedBadge}
                  title={`Дата последнего решения: ${new Date(
                    taskReview.lastReviewedAt
                  ).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`}
                >
                  <Calendar size={12} />
                  <span>Решено: {formatLastSolved(taskReview.lastReviewedAt)}</span>
                </span>
              )}

              {!canRate && (
                <span
                  className={styles.lockedBadge}
                  title="Повторение запланировано. Блок оценки станет доступен, когда наступит срок повторения задачи"
                >
                  <Lock size={12} />
                  <span>Запланировано</span>
                </span>
              )}
            </div>

            <div className={styles.taskReviewDesc}>
              {taskReview && !canRate ? (
                <span className={styles.descScheduled}>
                  Следующее повторение:{" "}
                  <strong>
                    {formatNextReviewDate(taskReview.nextReviewAt, taskReview.dueDate)}
                  </strong>
                  {". "}
                  <span className={styles.descHint}>
                    В день повторения решение автоматически сбросится до чистого шаблона
                  </span>
                </span>
              ) : canRate && taskReview ? (
                <span className={styles.descDue}>
                  Пора повторить задачу! Решите её заново с чистого листа и оцените результат:
                </span>
              ) : (
                <span className={styles.descNew}>
                  Оцените сложность решения для составления персонального графика повторений:
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
