import React from "react";
import { Badge, Accordion, MarkdownView, Textarea } from "@/shared/ui";
import { UiDiagramScene } from "@/shared/ui/UiDiagramScene";
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
}

/** One RADIO stage: the prompt, design decisions, the learner's own answer, the reference and a rubric. */
export const DesignStagePanel = ({
  caseId,
  stage,
  topics,
  drills,
}: DesignStagePanelProps): React.JSX.Element => {
  const progress = useDesignCaseStore(selectStageProgress(caseId, stage.id));
  const chooseOption = useDesignCaseStore((state) => state.chooseOption);
  const setAnswer = useDesignCaseStore((state) => state.setAnswer);
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

      <section className={styles.section}>
        <Textarea
          label="Ваш ответ"
          placeholder="Опишите решение своими словами: что выбираете и почему"
          rows={8}
          value={progress.answer}
          onChange={(event) => setAnswer(caseId, stage.id, event.target.value)}
        />
      </section>

      <Accordion title="Эталонный ответ" color="purple" size="sm">
        <div className={styles.reference}>
          <MarkdownView content={stage.reference} />
          {stage.diagram && (
            <div className={styles.diagram}>
              <UiDiagramScene
                label={stage.diagram.label}
                nodes={stage.diagram.nodes}
                edges={stage.diagram.edges}
              />
            </div>
          )}
        </div>
      </Accordion>

      <section className={styles.section} aria-label="Самопроверка">
        <div className={styles.rubricHeader}>
          <h3 className={styles.rubricTitle}>Самопроверка</h3>
          {isComplete && <Badge variant="green">Этап пройден</Badge>}
        </div>
        <StageRubric
          items={stage.rubric}
          checkedIndexes={progress.rubric}
          onToggle={(index) => toggleRubricItem(caseId, stage.id, index)}
        />
      </section>
    </div>
  );
};
