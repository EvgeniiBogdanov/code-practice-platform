import React, { memo } from "react";
import { CircleQuestionMark } from "lucide-react";
import { Accordion, MarkdownView } from "@/shared/ui";
import { TaskQuestion } from "@/entities/task";
import styles from "./QuestionsTab.module.css";

export interface QuestionItemProps {
  question: TaskQuestion;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const QuestionItem = memo(
  ({ question, index, isOpen, onToggle }: QuestionItemProps): React.JSX.Element => {
    const rawAnswer = question.answer || question.response || question.desc || "";

    return (
      <Accordion
        size="md"
        color="purple"
        icon={<CircleQuestionMark size={16} className={styles.questionIcon} />}
        title={
          <span>
            <strong>Вопрос {index + 1}:</strong> {question.question || question.title}
          </span>
        }
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <MarkdownView content={rawAnswer} />
      </Accordion>
    );
  }
);

QuestionItem.displayName = "QuestionItem";
