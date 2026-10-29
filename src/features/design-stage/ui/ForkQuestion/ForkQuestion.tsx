import React, { useId } from "react";
import { CircleCheck, Lightbulb } from "lucide-react";
import { Badge, Callout, UiChoiceList, type UiChoiceOption } from "@/shared/ui";
import type { DesignFork } from "@/entities/design-case";
import styles from "./ForkQuestion.module.css";

export interface ForkQuestionProps {
  fork: DesignFork;
  /** Position of the fork among the forks of the stage, from 1. */
  position: number;
  total: number;
  chosenOptionId: string | undefined;
  onChoose: (optionId: string) => void;
}

/**
 * A design decision as a test question: pick an option, then every option shows its trade-offs in
 * place, the recommended one marked, so the answer can be compared and changed.
 */
export const ForkQuestion = ({
  fork,
  position,
  total,
  chosenOptionId,
  onChoose,
}: ForkQuestionProps): React.JSX.Element => {
  const questionId = useId();
  const isAnswered = chosenOptionId !== undefined;
  const recommended = fork.options.find((option) => option.recommended);
  const isRecommendedChosen = isAnswered && recommended?.id === chosenOptionId;

  const options = fork.options.map((option): UiChoiceOption => ({
    id: option.id,
    label: option.label,
    description: isAnswered ? option.explanation : undefined,
    tone: isAnswered && option.recommended ? "success" : undefined,
    tags:
      isAnswered && (option.recommended || option.id === chosenOptionId) ? (
        <>
          {option.recommended && (
            <Badge variant="green" size="sm">
              Рекомендуем
            </Badge>
          )}
          {option.id === chosenOptionId && (
            <Badge variant="gray" size="sm">
              Ваш выбор
            </Badge>
          )}
        </>
      ) : undefined,
  }));

  return (
    <section className={styles.fork} aria-labelledby={questionId}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          Развилка {position} из {total}
        </span>
        <h3 id={questionId} className={styles.question}>
          {fork.question}
        </h3>
      </header>

      {isAnswered &&
        (isRecommendedChosen ? (
          <Callout
            size="sm"
            color="green"
            icon={<CircleCheck size={16} aria-hidden="true" />}
            content="Совпадает с рекомендацией. Ниже — компромиссы каждого варианта."
          />
        ) : (
          <Callout
            size="sm"
            color="amber"
            icon={<Lightbulb size={16} aria-hidden="true" />}
            content="Рекомендуем другой вариант. Сравните компромиссы: на интервью важно обосновать выбор."
          />
        ))}

      <UiChoiceList
        className={styles.choices}
        options={options}
        value={chosenOptionId}
        onChange={onChoose}
        labelledBy={questionId}
        showKeys
      />
    </section>
  );
};
