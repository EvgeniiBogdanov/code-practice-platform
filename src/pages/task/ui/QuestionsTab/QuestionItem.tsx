import React, { memo } from "react";
import DOMPurify from "dompurify";
import { parseMarkdownBlocks } from "@/shared/lib/markdown";
import { Accordion, CodeViewer } from "@/shared/ui";
import { TaskQuestion } from "@/entities/task";
import styles from "./QuestionsTab.module.css";

export interface QuestionItemProps {
  question: TaskQuestion;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const QuestionItem = memo(({ question, index, isOpen, onToggle }: QuestionItemProps) => {
  const rawAnswer = question.answer || question.response || question.desc || "";
  const blocks = parseMarkdownBlocks(rawAnswer);

  return (
    <Accordion
      size="md"
      color="purple"
      icon={<span className={styles.questionIcon}>❓</span>}
      title={
        <span>
          <strong>Вопрос {index + 1}:</strong> {question.question || question.title}
        </span>
      }
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className={styles.answerContent}>
        {blocks.map((block, bIdx) => {
          if (block.type === "code") {
            return <CodeViewer key={bIdx} code={block.code || ""} language={block.language} />;
          }
          return (
            <div
              key={bIdx}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(block.html || ""),
              }}
            />
          );
        })}
      </div>
    </Accordion>
  );
});

QuestionItem.displayName = "QuestionItem";
