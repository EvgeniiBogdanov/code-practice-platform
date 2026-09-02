import { memo } from "react";
import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";
import { RetentionScheduleBar } from "../RetentionScheduleBar";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionScheduleTabProps {
  reviews: Record<string, ReviewItem>;
  targetTasks: Task[];
  scopeLabel: string;
}

export const SpacedRepetitionScheduleTab = memo(
  ({ reviews, targetTasks, scopeLabel }: SpacedRepetitionScheduleTabProps) => {
    return (
      <div className={styles.scheduleView}>
        <div className={styles.scheduleDesc}>
          Прогноз нагрузки и даты следующих повторений задач {scopeLabel} по интервалам SM-2:
        </div>
        <RetentionScheduleBar reviews={reviews} allTasks={targetTasks} height={220} />
      </div>
    );
  }
);

SpacedRepetitionScheduleTab.displayName = "SpacedRepetitionScheduleTab";
