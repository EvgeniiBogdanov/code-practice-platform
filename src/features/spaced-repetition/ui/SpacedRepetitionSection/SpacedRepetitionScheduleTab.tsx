import { memo } from "react";
import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";
import { RetentionScheduleBar } from "../RetentionScheduleBar";
import { SpacedRepetitionActivityChart } from "../SpacedRepetitionActivityChart";
import sectionStyles from "./SpacedRepetitionSection.module.css";
import styles from "./SpacedRepetitionScheduleTab.module.css";

interface SpacedRepetitionScheduleTabProps {
  reviews: Record<string, ReviewItem>;
  targetTasks: Task[];
  activityByDate: Readonly<Record<string, number>>;
}

export const SpacedRepetitionScheduleTab = memo(
  ({
    reviews,
    targetTasks,
    activityByDate,
  }: Readonly<SpacedRepetitionScheduleTabProps>): React.JSX.Element => {
    return (
      <div className={styles.charts}>
        <SpacedRepetitionActivityChart activityByDate={activityByDate} />
        <hr className={sectionStyles.sectionDivider} />
        <section className={styles.chartSection} aria-labelledby="retention-schedule-title">
          <h3 id="retention-schedule-title" className={styles.title}>
            Ближайшие повторения
          </h3>
          <RetentionScheduleBar reviews={reviews} allTasks={targetTasks} height={220} />
        </section>
      </div>
    );
  }
);

SpacedRepetitionScheduleTab.displayName = "SpacedRepetitionScheduleTab";
