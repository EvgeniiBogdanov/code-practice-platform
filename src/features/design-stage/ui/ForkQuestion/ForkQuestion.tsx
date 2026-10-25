import React, { useId } from "react";
import { clsx } from "clsx";
import { Callout } from "@/shared/ui";
import type { DesignFork } from "@/entities/design-case";
import styles from "./ForkQuestion.module.css";

export interface ForkQuestionProps {
  fork: DesignFork;
  chosenOptionId: string | undefined;
  onChoose: (optionId: string) => void;
}

/** A design decision: pick an option, then see the trade-offs of every option. */
export const ForkQuestion = ({
  fork,
  chosenOptionId,
  onChoose,
}: ForkQuestionProps): React.JSX.Element => {
  const labelId = useId();
  const isAnswered = chosenOptionId !== undefined;

  return (
    <div className={styles.fork}>
      <p id={labelId} className={styles.question}>
        {fork.question}
      </p>
      <div className={styles.options} role="radiogroup" aria-labelledby={labelId}>
        {fork.options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.id === chosenOptionId}
            className={clsx(styles.option, option.id === chosenOptionId && styles.chosen)}
            onClick={() => onChoose(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className={styles.explanations}>
          {fork.options.map((option) => (
            <Callout
              key={option.id}
              size="sm"
              color={option.recommended ? "green" : "gray"}
              title={option.recommended ? `${option.label} — рекомендуемый вариант` : option.label}
              content={option.explanation}
            />
          ))}
        </div>
      )}
    </div>
  );
};
