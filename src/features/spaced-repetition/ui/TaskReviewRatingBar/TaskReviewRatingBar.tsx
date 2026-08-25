import { memo } from "react";
import { clsx } from "clsx";
import { useReviewStore, ReviewRating, getReviewBadgeMeta } from "@/entities/review";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { TaskReviewHeader } from "./TaskReviewHeader";
import { TaskReviewRatingOptions } from "./TaskReviewRatingOptions";
import styles from "./TaskReviewRatingBar.module.css";

export interface TaskReviewRatingBarProps {
  taskId: string | number;
  className?: string;
}

export const TaskReviewRatingBar = memo(({ taskId, className }: TaskReviewRatingBarProps) => {
  const stringId = String(taskId);
  const reviews = useReviewStore((state) => state.reviews);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);
  const submitReview = useReviewStore((state) => state.submitReview);

  const progressState = useProgressStore();
  const setTaskStatus = useProgressStore((state) => state.setTaskStatus);

  const isCurrentlySolved = selectIsTaskCompleted(progressState, taskId);
  const taskReview = reviews[stringId] || null;

  if (!isReviewStoreReady || (!isCurrentlySolved && !taskReview)) {
    return null;
  }

  const badgeMeta = getReviewBadgeMeta(taskReview);
  const isNeverReviewed = !taskReview || !taskReview.stage || taskReview.stage === 0;
  const canRate = isNeverReviewed || badgeMeta.isDue;

  const handleRate = async (rating: ReviewRating) => {
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
        !canRate && styles.reviewBannerLocked,
        className
      )}
    >
      <TaskReviewHeader taskReview={taskReview} badgeMeta={badgeMeta} canRate={canRate} />
      {canRate && (
        <TaskReviewRatingOptions taskReview={taskReview} canRate={canRate} onRate={handleRate} />
      )}
    </div>
  );
});

TaskReviewRatingBar.displayName = "TaskReviewRatingBar";
