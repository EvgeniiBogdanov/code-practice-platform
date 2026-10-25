import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { clsx } from "clsx";
import { Badge } from "@/shared/ui";
import {
  EMPTY_STAGE_PROGRESS,
  RADIO_STAGES,
  isStageComplete,
  useDesignCaseStore,
  type DesignCase,
} from "@/entities/design-case";
import { DIFFICULTY_BADGE } from "../lib/difficultyBadge";
import styles from "./CaseCards.module.css";

export interface CaseCardsProps {
  cases: readonly DesignCase[];
}

/** The «Кейсы» folder: a case card shows its five RADIO stages and how far the reader got. */
export const CaseCards = ({ cases }: CaseCardsProps): React.JSX.Element => {
  const stagesProgress = useDesignCaseStore((state) => state.stages);

  return (
    <div className={styles.grid}>
      {cases.map((designCase, index) => {
        const difficulty = DIFFICULTY_BADGE[designCase.difficulty];
        const doneById = new Map(
          designCase.stages.map((stage) => [
            stage.id,
            isStageComplete(
              stage,
              stagesProgress[`${designCase.id}:${stage.id}`] ?? EMPTY_STAGE_PROGRESS
            ),
          ])
        );
        const done = [...doneById.values()].filter(Boolean).length;
        const total = designCase.stages.length;
        const action = done === 0 ? "Начать кейс" : done === total ? "Повторить" : "Продолжить";

        return (
          <Link
            key={designCase.id}
            to="/system-design/cases/$caseId"
            params={{ caseId: designCase.id }}
            className={styles.card}
          >
            <span className={styles.head}>
              <span className={styles.kicker}>Кейс {index + 1}</span>
              <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
            </span>
            <span className={styles.title}>{designCase.title}</span>
            <span className={styles.summary}>{designCase.summary}</span>

            <span className={styles.stages} aria-label={`Пройдено этапов: ${done} из ${total}`}>
              {RADIO_STAGES.map((stage) => (
                <span
                  key={stage.id}
                  className={clsx(styles.stage, doneById.get(stage.id) && styles.stageDone)}
                  title={stage.title}
                >
                  {doneById.get(stage.id) ? <Check size={12} aria-hidden="true" /> : stage.letter}
                </span>
              ))}
            </span>

            <span className={styles.footer}>
              <span className={styles.progress}>
                {done} из {total} этапов
              </span>
              <span className={styles.action}>
                {action}
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
};
