import React, { useState, useEffect, memo, useCallback } from "react";
import { clsx } from "clsx";
import { Task, TaskQuestion } from "@/entities/task";
import { QuestionItem } from "./QuestionItem";
import styles from "./QuestionsTab.module.css";

export interface QuestionsTabProps {
  task: Task;
  className?: string;
}

export const QuestionsTab = memo(({ task, className }: QuestionsTabProps) => {
  const questions: TaskQuestion[] = task.questions || task.interviewerQuestions || [];
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  useEffect(() => {
    setOpenIndexes([]);
  }, [task?.id]);

  const toggleQuestion = useCallback((idx: number) => {
    setOpenIndexes((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  }, []);

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>Частые вопросы на собеседовании</h3>
      </div>

      {questions.length > 0 ? (
        <div className={styles.list}>
          {questions.map((q, idx) => (
            <QuestionItem
              key={`${q.question || idx}-${idx}`}
              question={q}
              index={idx}
              isOpen={openIndexes.includes(idx)}
              onToggle={() => toggleQuestion(idx)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>Список частых вопросов для данной задачи формируется.</div>
      )}
    </div>
  );
});

QuestionsTab.displayName = "QuestionsTab";
