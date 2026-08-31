import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Folder, FileText, Calendar, RotateCcw, Check, X } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { TaskFavoriteMarker } from "@/features/task-favorite";
import { Card } from "@/shared/ui";
import styles from "./GroupOverviewPage.module.css";

import { ReviewItem } from "@/entities/review";

export interface GroupTaskCardsProps {
  tasks: Task[];
  taskRoute: string;
  groupTitle?: string;
  folderColor?: string;
  getTaskStatus: (taskId: string | number) => "solved" | "unsolved" | "unstarted";
  getTaskGradientClass: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: ReviewItem | null | undefined
  ) => string;
  getTaskTooltipTitle: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: ReviewItem | null | undefined
  ) => string;
  formatLastSolved: (timestamp?: number | string | null) => string | null;
  formatNextReviewDate: (timestamp?: number | ReviewItem, dueDate?: string) => string | null;
  isTaskDue: (review: ReviewItem | null | undefined) => boolean;
  reviews: Record<string, ReviewItem>;
}

interface GroupTaskCardItemProps {
  task: Task;
  taskRoute: string;
  groupTitle?: string;
  folderColor?: string;
  getTaskStatus: (taskId: string | number) => "solved" | "unsolved" | "unstarted";
  getTaskGradientClass: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: ReviewItem | null | undefined
  ) => string;
  getTaskTooltipTitle: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: ReviewItem | null | undefined
  ) => string;
  formatLastSolved: (timestamp?: number | string | null) => string | null;
  formatNextReviewDate: (timestamp?: number | ReviewItem, dueDate?: string) => string | null;
  isTaskDue: (review: ReviewItem | null | undefined) => boolean;
  reviews: Record<string, ReviewItem>;
}

const GroupTaskCardItem = memo(
  ({
    task,
    taskRoute,
    groupTitle,
    folderColor,
    getTaskStatus,
    getTaskGradientClass,
    getTaskTooltipTitle,
    formatLastSolved,
    formatNextReviewDate,
    isTaskDue,
    reviews,
  }: GroupTaskCardItemProps) => {
    const s = getTaskStatus(task.id);
    const isDone = s === "solved";
    const isUnsolved = s === "unsolved";

    const taskReview = reviews[String(task.id)] || reviews[task.id];
    const lastReviewedAt = taskReview?.lastReviewedAt;
    const nextReviewAt = taskReview?.nextReviewAt;
    const isDue = isTaskDue(taskReview);
    const gradientClass = getTaskGradientClass(task, s, taskReview);
    const tooltipTitle = getTaskTooltipTitle(task, s, taskReview);

    return (
      <Link
        to={taskRoute}
        params={{ taskId: String(task.id) }}
        title={tooltipTitle}
        className={styles.galleryCardLink}
      >
        <Card className={clsx(styles.galleryCard, gradientClass)}>
          <div>
            <div className={styles.galleryCardHeaderRow}>
              <div className={styles.galleryCardFolderInfo}>
                <Folder size={14} color={folderColor || "var(--accent-blue)"} />
                <span className={styles.galleryCardSubgroup}>
                  {task.subgroup || groupTitle || "Раздел"}
                </span>
              </div>

              <div className={styles.galleryCardStatusRow}>
                <span
                  className={clsx(
                    styles.galleryCardStatusText,
                    isDone
                      ? styles.statusSolved
                      : isUnsolved
                        ? styles.statusUnsolved
                        : styles.statusUnstarted
                  )}
                >
                  {isDone ? "Решено" : isUnsolved ? "Не решено" : "Не начато"}
                </span>
                {isDue ? (
                  <span className={styles.statusIconDue} title="Пора повторить сегодня!">
                    <RotateCcw size={11} />
                  </span>
                ) : isDone ? (
                  <span className={styles.statusIconSolved} title="Решено">
                    <Check size={13} />
                  </span>
                ) : isUnsolved ? (
                  <span className={styles.statusIconUnsolved} title="Не решено">
                    <X size={13} />
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.galleryCardTitleRow}>
              <FileText size={16} className={styles.nodeFileIcon} />
              <span className={styles.galleryCardTitleText}>{task.title}</span>
              <TaskFavoriteMarker taskId={task.id} taskTitle={task.title} />
            </div>

            {task.desc && <div className={styles.galleryCardDesc}>{task.desc}</div>}
          </div>

          {(lastReviewedAt || nextReviewAt || isDue) && (
            <div className={styles.galleryCardBadgesRow}>
              {lastReviewedAt && (
                <span
                  className={clsx(styles.galleryCardBadge, styles.badgeLastSolved)}
                  title={`Дата последнего решения: ${new Date(lastReviewedAt).toLocaleDateString("ru-RU")}`}
                >
                  <Calendar size={11} />
                  <span>{formatLastSolved(lastReviewedAt)}</span>
                </span>
              )}
              {isDue ? (
                <span className={clsx(styles.galleryCardBadge, styles.badgeNextDue)}>
                  <span>Пора повторить</span>
                </span>
              ) : nextReviewAt ? (
                <span
                  className={clsx(styles.galleryCardBadge, styles.badgeNextScheduled)}
                  title={`Следующее повторение: ${formatNextReviewDate(nextReviewAt)}`}
                >
                  <RotateCcw size={11} />
                  <span>{formatNextReviewDate(nextReviewAt)}</span>
                </span>
              ) : null}
            </div>
          )}
        </Card>
      </Link>
    );
  }
);

GroupTaskCardItem.displayName = "GroupTaskCardItem";

export const GroupTaskCards = memo(
  ({
    tasks,
    taskRoute,
    groupTitle,
    folderColor,
    getTaskStatus,
    getTaskGradientClass,
    getTaskTooltipTitle,
    formatLastSolved,
    formatNextReviewDate,
    isTaskDue,
    reviews,
  }: GroupTaskCardsProps) => {
    if (tasks.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2>По выбранному фильтру задач нет</h2>
          <p>Измените фильтр, чтобы увидеть остальные задачи.</p>
        </div>
      );
    }

    return (
      <div className={styles.galleryGrid}>
        {tasks.map((task) => (
          <GroupTaskCardItem
            key={task.id}
            task={task}
            taskRoute={taskRoute}
            groupTitle={groupTitle}
            folderColor={folderColor}
            getTaskStatus={getTaskStatus}
            getTaskGradientClass={getTaskGradientClass}
            getTaskTooltipTitle={getTaskTooltipTitle}
            formatLastSolved={formatLastSolved}
            formatNextReviewDate={formatNextReviewDate}
            isTaskDue={isTaskDue}
            reviews={reviews}
          />
        ))}
      </div>
    );
  }
);

GroupTaskCards.displayName = "GroupTaskCards";
