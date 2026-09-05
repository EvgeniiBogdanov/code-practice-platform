import React, { memo } from "react";
import { clsx } from "clsx";
import { Task, TaskQuestion } from "@/entities/task";
import { Accordion, UiSkeleton } from "@/shared/ui";
import questionsStyles from "../QuestionsTab/QuestionsTab.module.css";
import styles from "./TaskTabSkeleton.module.css";

export interface QuestionsTabSkeletonProps {
  task?: Task;
  className?: string;
}

export const QuestionsTabSkeleton = memo(
  ({ task, className }: QuestionsTabSkeletonProps): React.JSX.Element => {
    const questions: TaskQuestion[] = task?.questions || task?.interviewerQuestions || [];

    return (
      <div className={clsx(questionsStyles.container, className)}>
        {/* Header with real synchronous heading text matching QuestionsTab 1:1 */}
        <div className={questionsStyles.header}>
          <h3 className={questionsStyles.title}>Частые вопросы на собеседовании</h3>
        </div>

        {/* List of question accordions */}
        <div className={questionsStyles.list}>
          {questions.length > 0 ? (
            questions.map((q, idx) => (
              <Accordion
                key={`${q.question || idx}-${idx}`}
                size="md"
                color="purple"
                icon={<span className={questionsStyles.questionIcon}>❓</span>}
                title={
                  <span>
                    <strong>Вопрос {idx + 1}:</strong> {q.question || q.title}
                  </span>
                }
                isOpen={false}
                onToggle={() => {}}
              />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.questionAccordionCard}>
                <div className={styles.questionAccordionHeader}>
                  <div className={styles.questionAccordionHeaderLeft}>
                    <span className={questionsStyles.questionIcon}>❓</span>
                    <UiSkeleton width={`${50 + (idx % 4) * 12}%`} height={15} radius={3} />
                  </div>
                  <UiSkeleton width={14} height={14} radius={3} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

QuestionsTabSkeleton.displayName = "QuestionsTabSkeleton";

