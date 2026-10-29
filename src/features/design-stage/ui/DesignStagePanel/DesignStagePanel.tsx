import React from "react";
import { Shapes } from "lucide-react";
import { Callout, MarkdownView } from "@/shared/ui";
import {
  RADIO_STAGES,
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
  const meta = RADIO_STAGES.find(({ id }) => id === stage.id);

  return (
    <div className={styles.panel}>
      <section className={styles.prompt} aria-label="Задание этапа">
        {meta && (
          <header className={styles.promptHeader}>
            <span className={styles.letter} aria-hidden="true">
              {meta.letter}
            </span>
            <span className={styles.promptTitle}>Задание</span>
            <span className={styles.promptHint}>{meta.hint}</span>
          </header>
        )}
        <MarkdownView className={styles.promptText} content={stage.prompt} />
      </section>

      <StageLinks topics={topics} drills={drills} />

      {stage.forks.map((fork, index) => (
        <ForkQuestion
          key={fork.id}
          fork={fork}
          position={index + 1}
          total={stage.forks.length}
          chosenOptionId={progress.choices[fork.id]}
          onChoose={(optionId) => chooseOption(caseId, stage.id, fork.id, optionId)}
        />
      ))}

      {showReference && (
        <Callout
          color="purple"
          size="sm"
          icon={<Shapes size={16} aria-hidden="true" />}
          title="Пояснения к эталону"
        >
          <MarkdownView className={styles.notes} content={stage.notes} />
        </Callout>
      )}

      <StageRubric
        items={stage.rubric}
        checkedIndexes={progress.rubric}
        onToggle={(index) => toggleRubricItem(caseId, stage.id, index)}
        isComplete={isComplete}
      />
    </div>
  );
};
