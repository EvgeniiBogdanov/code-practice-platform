import React from "react";
import { PenTool } from "lucide-react";
import { UiBoardEditor, type BoardValue } from "@/shared/ui/UiBoardEditor";
import { selectCaseBoard, selectCaseRevision, useDesignCaseStore } from "@/entities/design-case";
import styles from "./CaseBoard.module.css";

export interface CaseBoardProps {
  caseId: string;
}

const TITLE_ICON_SIZE = 14;

/**
 * The learner's scheme of the whole case. It is one board for every stage, as on a real interview:
 * the interviewer watches it grow from the requirements to the optimizations, so it stays on the page
 * (and keeps its undo history) while the stage tabs change above it.
 */
export const CaseBoard = ({ caseId }: CaseBoardProps): React.JSX.Element => {
  const board = useDesignCaseStore(selectCaseBoard(caseId));
  const revision = useDesignCaseStore(selectCaseRevision(caseId));
  const setBoard = useDesignCaseStore((state) => state.setBoard);
  const titleId = `${caseId}-board-title`;

  const handleChange = (next: BoardValue): void => {
    // After a reset the editor is rebuilt; the old one may still flush a pending save as it closes,
    // and that must not bring the erased scheme back.
    if (selectCaseRevision(caseId)(useDesignCaseStore.getState()) !== revision) return;
    setBoard(caseId, next);
  };

  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <PenTool size={TITLE_ICON_SIZE} className={styles.icon} aria-hidden="true" />
        <h2 id={titleId} className={styles.title}>
          Схема решения
        </h2>
        <span className={styles.note}>общая для всех этапов</span>
      </header>
      <div className={styles.body}>
        <p className={styles.hint}>
          Одна схема на весь кейс, как доска на собеседовании: дополняйте её на каждом этапе, от
          требований до оптимизаций. Добавляйте карточки, соединяйте стрелками и подписывайте.
          Сохраняется автоматически.
        </p>
        <UiBoardEditor
          key={`${caseId}:${revision}`}
          label="Схема решения"
          value={board}
          onChange={handleChange}
        />
      </div>
    </section>
  );
};
