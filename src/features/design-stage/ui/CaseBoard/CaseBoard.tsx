import React from "react";
import { PenTool } from "lucide-react";
import { UiSegmentedControl } from "@/shared/ui";
import { UiBoardEditor, UiBoardViewer, type BoardValue } from "@/shared/ui/UiBoardEditor";
import {
  selectCaseBoard,
  selectCaseRevision,
  useDesignCaseStore,
  type ReferenceBoard,
} from "@/entities/design-case";
import styles from "./CaseBoard.module.css";

export type CaseBoardView = "mine" | "reference";

const VIEW_OPTIONS: readonly { value: CaseBoardView; label: string }[] = [
  { value: "mine", label: "Моя схема" },
  { value: "reference", label: "Эталон" },
];

export interface CaseBoardProps {
  caseId: string;
  view: CaseBoardView;
  onViewChange: (view: CaseBoardView) => void;
  /** The reference scheme as it looks at the open stage. */
  reference: ReferenceBoard;
  /** One line under the title while the reference is open, e.g. which stage it shows. */
  referenceHint: string;
}

const TITLE_ICON_SIZE = 14;

/**
 * The learner's scheme of the whole case, and the reference to compare it with. It is one board for
 * every stage, as on a real interview: it stays on the page (and keeps its undo history) while the
 * stage tabs change, and the reference only covers it while it is open.
 */
export const CaseBoard = ({
  caseId,
  view,
  onViewChange,
  reference,
  referenceHint,
}: CaseBoardProps): React.JSX.Element => {
  const board = useDesignCaseStore(selectCaseBoard(caseId));
  const revision = useDesignCaseStore(selectCaseRevision(caseId));
  const setBoard = useDesignCaseStore((state) => state.setBoard);
  const titleId = `${caseId}-board-title`;
  const isReference = view === "reference";

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
        <div className={styles.switch}>
          <UiSegmentedControl
            label="Что показать на доске"
            value={view}
            options={VIEW_OPTIONS}
            onChange={onViewChange}
          />
        </div>
      </header>
      <div className={styles.body}>
        <p className={styles.hint}>
          {isReference
            ? referenceHint
            : "Одна схема на весь кейс: дополняйте её на каждом этапе. Сохраняется автоматически."}
        </p>
        <div className={styles.view} hidden={isReference}>
          <UiBoardEditor
            key={`${caseId}:${revision}`}
            label="Моя схема"
            value={board}
            onChange={handleChange}
          />
        </div>
        {isReference && (
          <UiBoardViewer
            label="Эталонная схема"
            value={reference.board}
            highlightedIds={reference.highlightedIds}
          />
        )}
      </div>
    </section>
  );
};
