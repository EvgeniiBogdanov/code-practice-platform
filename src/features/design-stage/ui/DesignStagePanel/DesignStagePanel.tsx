import React from "react";
import { Badge, Callout, MarkdownView } from "@/shared/ui";
import {
  isStageComplete,
  selectStageProgress,
  useDesignCaseStore,
  type DesignStage,
} from "@/entities/design-case";
import { ForkQuestion } from "../ForkQuestion/ForkQuestion";
import { StageLinks, type StageDrillLink, type StageTopicLink } from "../StageLinks/StageLinks";
import { StageRubric } from "../StageRubric/StageRubric";
import styles from "./DesignStagePanel.module.css";

export interface DesignStagePanelProps {
  caseId: string;
  stage: DesignStage;
  topics: readonly StageTopicLink[];
  drills: readonly StageDrillLink[];
  /** The reference scheme is open on the board: its notes are shown next to the self-check. */
  showReference: boolean;
}

/**
 * One RADIO stage next to the board: the prompt, design decisions, the notes of the reference scheme
 * while it is open, and the self-check of the learner's scheme.
 */
export const DesignStagePanel = ({
  caseId,
  stage,
  topics,
  drills,
  showReference,
}: DesignStagePanelProps): React.JSX.Element => {
  const progress = useDesignCaseStore(selectStageProgress(caseId, stage.id));
  const chooseOption = useDesignCaseStore((state) => state.chooseOption);
  const toggleRubricItem = useDesignCaseStore((state) => state.toggleRubricItem);
  const isComplete = isStageComplete(stage, progress);

  return (
    <div className={styles.panel}>
      <section className={styles.section} aria-label="Задание этапа">
        <MarkdownView content={stage.prompt} />
        <StageLinks topics={topics} drills={drills} />
      </section>

      {stage.forks.map((fork) => (
        <ForkQuestion
          key={fork.id}
          fork={fork}
          chosenOptionId={progress.choices[fork.id]}
          onChoose={(optionId) => chooseOption(caseId, stage.id, fork.id, optionId)}
        />
      ))}

      {showReference && (
        <Callout color="purple" size="sm" title="Пояснения к эталону">
          <MarkdownView content={stage.notes} />
        </Callout>
      )}

      <section className={styles.section} aria-label="Самопроверка">
        <div className={styles.rubricHeader}>
          <h3 className={styles.rubricTitle}>Самопроверка</h3>
          {isComplete && <Badge variant="green">Этап пройден</Badge>}
        </div>
        <p className={styles.rubricHint}>
          Сверьте свою схему с эталоном и отметьте, что на ней есть.
        </p>
        <StageRubric
          items={stage.rubric}
          checkedIndexes={progress.rubric}
          onToggle={(index) => toggleRubricItem(caseId, stage.id, index)}
        />
      </section>
    </div>
  );
};
