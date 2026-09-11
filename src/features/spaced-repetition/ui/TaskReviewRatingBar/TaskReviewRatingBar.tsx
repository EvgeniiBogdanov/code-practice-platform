import { memo, type JSX } from "react";
import { clsx } from "clsx";
import { useReviewStore, ReviewRating, getReviewBadgeMeta } from "@/entities/review";
import { useProgressStore, isTaskCompleted, isTaskUnsolved } from "@/entities/progress";
import { Task } from "@/entities/task";
import { useUIStore } from "@/entities/ui-state";
import { TaskReviewHeader } from "./TaskReviewHeader";
import { TaskReviewRatingOptions } from "./TaskReviewRatingOptions";
import styles from "./TaskReviewRatingBar.module.css";

export interface TaskReviewRatingBarProps {
  taskId: string | number;
  task?: Task;
  className?: string;
}

const TaskReviewRatingBarComponent = ({
  taskId,
  task,
  className,
}: TaskReviewRatingBarProps): JSX.Element | null => {
  const stringId = String(taskId);
  const reviews = useReviewStore((state) => state.reviews);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);
  const submitReview = useReviewStore((state) => state.submitReview);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const hideInteractiveAssistant = useUIStore((state) => state.hideInteractiveAssistant);

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const taskStatusTimestamps = useProgressStore((state) => state.taskStatusTimestamps);
  const setTaskStatus = useProgressStore((state) => state.setTaskStatus);

  const isExcluded = excludedTaskIds.includes(stringId);
  const status = completedTasks[stringId];
  const isCurrentlySolved = isTaskCompleted(status);
  const isCurrentlyUnsolved = isTaskUnsolved(status);
  const statusUpdatedAt = taskStatusTimestamps[stringId];
  const taskReview = reviews[stringId] || null;

  if (
    !isReviewStoreReady ||
    (!isCurrentlySolved && !taskReview && !isCurrentlyUnsolved && !isExcluded)
  ) {
    return null;
  }

  const badgeMeta = getReviewBadgeMeta(taskReview);
  const isNeverReviewed = !taskReview || !taskReview.stage || taskReview.stage === 0;
  const canRate =
    !isExcluded &&
    !isCurrentlyUnsolved &&
    (isNeverReviewed || badgeMeta.isDue || Boolean(taskReview?.isUnsolved));

  if (hideInteractiveAssistant && !canRate) {
    return null;
  }

  const handleRate = async (rating: ReviewRating): Promise<void> => {
    if (!canRate) return;
    await submitReview(taskId, rating);
    if (!isCurrentlySolved) {
      await setTaskStatus(taskId, "solved");
    }
  };

  return (
    <div
      className={clsx(
        styles.taskReviewBanner,
        (!canRate || isCurrentlyUnsolved || isExcluded) && styles.reviewBannerLocked,
        isExcluded && styles.reviewBannerExcluded,
        className
      )}
    >
      {!hideInteractiveAssistant && (
        <TaskReviewHeader
          taskReview={taskReview}
          badgeMeta={badgeMeta}
          canRate={canRate}
          task={task}
          isUnsolved={isCurrentlyUnsolved}
          isExcluded={isExcluded}
          statusUpdatedAt={statusUpdatedAt}
        />
      )}
      {canRate && !isExcluded && (
        <TaskReviewRatingOptions taskReview={taskReview} canRate={canRate} onRate={handleRate} />
      )}
    </div>
  );
};

export const TaskReviewRatingBar = memo(TaskReviewRatingBarComponent);

TaskReviewRatingBar.displayName = "TaskReviewRatingBar";
