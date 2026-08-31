import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./TaskTabSkeleton.module.css";

export interface QuestionsTabSkeletonProps {
  className?: string;
}

export const QuestionsTabSkeleton = memo(
  ({ className }: QuestionsTabSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.questionsContainer, className)}>
        {/* Header matching QuestionsTab header */}
        <div className={styles.questionHeader}>
          <UiSkeleton width={260} height={18} radius={4} />
        </div>

        {/* List of question accordions matching Accordion size="md" color="purple" */}
        <div className={styles.questionsList}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className={styles.questionAccordionCard}>
              <div className={styles.questionAccordionHeader}>
                <div className={styles.questionAccordionHeaderLeft}>
                  <UiSkeleton width={15} height={15} radius={3} />
                  <UiSkeleton width={`${45 + (idx % 4) * 15}%`} height={14} radius={3} />
                </div>
                <UiSkeleton width={14} height={14} radius={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

QuestionsTabSkeleton.displayName = "QuestionsTabSkeleton";
