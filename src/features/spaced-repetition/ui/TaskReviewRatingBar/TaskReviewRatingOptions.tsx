import { memo } from "react";
import { CheckCircle2, Clock, AlertCircle, Check } from "lucide-react";
import { clsx } from "clsx";
import { ReviewRating, RATINGS, ReviewItem } from "@/entities/review";
import styles from "./TaskReviewRatingBar.module.css";

interface TaskReviewRatingOptionsProps {
  taskReview: ReviewItem | null;
  canRate: boolean;
  onRate: (rating: ReviewRating) => void;
}

const RATING_CONFIG = [
  {
    rating: RATINGS.EASY,
    label: "Легко",
    interval: "+7 дней",
    modifier: styles.rateEasy,
    icon: <CheckCircle2 size={13} className={styles.rateIconEasy} />,
    titleActive: "Решил уверенно и быстро — повторить через 7 дней",
  },
  {
    rating: RATINGS.MEDIUM,
    label: "Средне",
    interval: "+3 дня",
    modifier: styles.rateMedium,
    icon: <Clock size={13} className={styles.rateIconMedium} />,
    titleActive: "Решил сам, но с заминкой — повторить через 3 дня",
  },
  {
    rating: RATINGS.HARD,
    label: "Сложно",
    interval: "+1 день",
    modifier: styles.rateHard,
    icon: <AlertCircle size={13} className={styles.rateIconHard} />,
    titleActive: "Трудно / смотрел подсказки — повторить завтра (+1 день)",
  },
];

export const TaskReviewRatingOptions = memo(
  ({ taskReview, canRate, onRate }: TaskReviewRatingOptionsProps) => {
    if (!canRate) {
      return null;
    }

    return (
      <div className={styles.taskReviewRatings}>
        {RATING_CONFIG.map((item) => {
          const isActive = taskReview?.rating === item.rating;

          return (
            <button
              key={item.rating}
              type="button"
              className={clsx(
                styles.reviewRateBtn,
                item.modifier,
                isActive && styles.active
              )}
              onClick={() => onRate(item.rating)}
              title={item.titleActive}
            >
              <div className={styles.rateBtnContent}>
                <div className={styles.rateBtnTitleRow}>
                  {item.icon}
                  <span className={styles.rateLabel}>{item.label}</span>
                </div>
                <span className={styles.rateInterval}>{item.interval}</span>
              </div>
              {isActive && (
                <span className={styles.rateCurrentCheck} title="Текущая оценка">
                  <Check size={11} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

TaskReviewRatingOptions.displayName = "TaskReviewRatingOptions";
