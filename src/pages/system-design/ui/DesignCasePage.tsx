import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Badge, MarkdownView, Tabs, type TabItem } from "@/shared/ui";
import {
  EMPTY_STAGE_PROGRESS,
  RADIO_STAGES,
  countCompletedStages,
  isStageComplete,
  useDesignCaseStore,
  type DesignCase,
} from "@/entities/design-case";
import { getDesignTopic } from "@/entities/design-topic";
import { isTaskCompleted, useProgressStore } from "@/entities/progress";
import { useTaskSection } from "@/entities/task/catalog";
import {
  DesignStagePanel,
  type StageDrillLink,
  type StageTopicLink,
} from "@/features/design-stage";
import { DIFFICULTY_BADGE } from "../lib/difficultyBadge";
import styles from "./DesignCasePage.module.css";

const PRODUCTION_TAB_ID = "production";

export interface DesignCasePageProps {
  designCase: DesignCase;
}

export const DesignCasePage = ({ designCase }: DesignCasePageProps): React.JSX.Element => {
  const [activeId, setActiveId] = useState<string>(designCase.stages[0]?.id ?? PRODUCTION_TAB_ID);
  const stagesProgress = useDesignCaseStore((state) => state.stages);
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const { tasks } = useTaskSection("system-design");

  const completedCount = countCompletedStages(designCase, stagesProgress);
  const difficulty = DIFFICULTY_BADGE[designCase.difficulty];

  const tabs = useMemo<TabItem[]>(
    () => [
      ...designCase.stages.map((stage) => {
        const meta = RADIO_STAGES.find(({ id }) => id === stage.id);
        const progress = stagesProgress[`${designCase.id}:${stage.id}`] ?? EMPTY_STAGE_PROGRESS;
        return {
          id: stage.id,
          label: meta?.title ?? stage.id,
          icon: isStageComplete(stage, progress) ? <Check size={14} aria-label="Пройден" /> : null,
        };
      }),
      { id: PRODUCTION_TAB_ID, label: "В продакшене" },
    ],
    [designCase, stagesProgress]
  );

  const activeStage = designCase.stages.find((stage) => stage.id === activeId);

  const resolveLinks = (
    topicIds: readonly string[],
    drillIds: readonly string[]
  ): { topics: StageTopicLink[]; drills: StageDrillLink[] } => ({
    topics: topicIds.flatMap((id) => {
      const topic = getDesignTopic(id);
      return topic ? [{ id, title: topic.title }] : [];
    }),
    drills: drillIds.flatMap((id) => {
      const task = tasks.find((candidate) => String(candidate.id) === id);
      return task ? [{ id, title: task.title, solved: isTaskCompleted(completedTasks[id]) }] : [];
    }),
  });

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{designCase.title}</h1>
          <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
        </div>
        <p className={styles.summary}>{designCase.summary}</p>
        <p className={styles.progress}>
          Пройдено этапов: {completedCount} из {designCase.stages.length}
        </p>
      </header>

      <Tabs items={tabs} activeId={activeId} onChange={setActiveId} ariaLabel="Этапы кейса" />

      <div role="tabpanel" className={styles.content}>
        {activeStage ? (
          <DesignStagePanel
            key={activeStage.id}
            caseId={designCase.id}
            stage={activeStage}
            {...resolveLinks(activeStage.topicIds, activeStage.drillIds)}
          />
        ) : (
          <MarkdownView content={designCase.production} />
        )}
      </div>
    </article>
  );
};
