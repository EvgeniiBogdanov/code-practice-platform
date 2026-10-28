import React, { useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Database,
  Gauge,
  Network,
  Plug,
  Rocket,
  RotateCcw,
} from "lucide-react";
import {
  Badge,
  Button,
  ConfirmModal,
  MarkdownView,
  UiCardTabs,
  getCardTabId,
  type CardTabAccent,
  type CardTabItem,
} from "@/shared/ui";
import {
  EMPTY_STAGE_PROGRESS,
  RADIO_STAGES,
  countCompletedStages,
  getReferenceBoard,
  isStageComplete,
  selectHasCaseProgress,
  useDesignCaseStore,
  type DesignCase,
  type RadioStageId,
} from "@/entities/design-case";
import { getDesignTopic } from "@/entities/design-topic";
import { isTaskCompleted, useProgressStore } from "@/entities/progress";
import { useTaskSection } from "@/entities/task/catalog";
import {
  CaseBoard,
  DesignStagePanel,
  type CaseBoardView,
  type StageDrillLink,
  type StageTopicLink,
} from "@/features/design-stage";
import { DIFFICULTY_BADGE } from "../lib/difficultyBadge";
import styles from "./DesignCasePage.module.css";

const PRODUCTION_TAB_ID = "production";
const PANEL_ID = "case-tab-panel";
const TAB_ICON_SIZE = 14;

/** Every tab has its own icon and colour, like the sections of a task. */
const TAB_LOOK: Record<
  RadioStageId | typeof PRODUCTION_TAB_ID,
  { icon: React.ReactNode; accent: CardTabAccent }
> = {
  requirements: { icon: <ClipboardList size={TAB_ICON_SIZE} />, accent: "green" },
  architecture: { icon: <Network size={TAB_ICON_SIZE} />, accent: "blue" },
  "data-model": { icon: <Database size={TAB_ICON_SIZE} />, accent: "yellow" },
  interface: { icon: <Plug size={TAB_ICON_SIZE} />, accent: "purple" },
  optimizations: { icon: <Gauge size={TAB_ICON_SIZE} />, accent: "cyan" },
  production: { icon: <Rocket size={TAB_ICON_SIZE} />, accent: "orange" },
};

export interface DesignCasePageProps {
  designCase: DesignCase;
}

export const DesignCasePage = ({ designCase }: DesignCasePageProps): React.JSX.Element => {
  const [activeId, setActiveId] = useState<string>(designCase.stages[0]?.id ?? PRODUCTION_TAB_ID);
  // Shared by both columns: the board shows the reference, the stage column shows its notes.
  const [boardView, setBoardView] = useState<CaseBoardView>("mine");
  const stagesProgress = useDesignCaseStore((state) => state.stages);
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const { tasks } = useTaskSection("system-design");

  const hasProgress = useDesignCaseStore(selectHasCaseProgress(designCase.id));
  const resetCase = useDesignCaseStore((state) => state.resetCase);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleReset = (): void => {
    resetCase(designCase.id);
    setActiveId(designCase.stages[0]?.id ?? PRODUCTION_TAB_ID);
    setBoardView("mine");
    setIsResetOpen(false);
  };

  const completedCount = countCompletedStages(designCase, stagesProgress);
  const difficulty = DIFFICULTY_BADGE[designCase.difficulty];

  const tabs = useMemo<CardTabItem[]>(
    () => [
      ...designCase.stages.map((stage) => {
        const meta = RADIO_STAGES.find(({ id }) => id === stage.id);
        const progress = stagesProgress[`${designCase.id}:${stage.id}`] ?? EMPTY_STAGE_PROGRESS;
        const look = TAB_LOOK[stage.id];
        return {
          id: stage.id,
          label: meta?.title ?? stage.id,
          // A passed stage shows a tick instead of its icon.
          icon: isStageComplete(stage, progress) ? (
            <Check size={TAB_ICON_SIZE} aria-label="Пройден" />
          ) : (
            look.icon
          ),
          accent: look.accent,
        };
      }),
      {
        id: PRODUCTION_TAB_ID,
        label: "В продакшене",
        ...TAB_LOOK[PRODUCTION_TAB_ID],
      },
    ],
    [designCase, stagesProgress]
  );

  const activeStage = designCase.stages.find((stage) => stage.id === activeId);
  const activeTitle = RADIO_STAGES.find(({ id }) => id === activeStage?.id)?.title;

  const reference = useMemo(
    () => getReferenceBoard(designCase.scheme, activeStage?.id ?? "all"),
    [designCase.scheme, activeStage?.id]
  );
  const referenceHint = activeTitle
    ? `Эталон к этапу «${activeTitle}»: выделено то, что добавляет этот этап.`
    : "Готовая эталонная схема целиком, со всеми этапами.";

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
    <div className={styles.pageContainer}>
      <article className={styles.caseCard}>
        <header className={styles.headerRow}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              <span>{designCase.title}</span>
              <span className={styles.titleBadge}>
                <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
              </span>
            </h1>
            <p className={styles.summary}>{designCase.summary}</p>
            <div className={styles.metaRow}>
              <Badge variant="gray">
                Пройдено этапов: {completedCount} из {designCase.stages.length}
              </Badge>
            </div>
          </div>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw size={TAB_ICON_SIZE} />}
              disabled={!hasProgress}
              onClick={() => setIsResetOpen(true)}
            >
              Сбросить кейс
            </Button>
          </div>
        </header>

        <div className={styles.tabsContainer}>
          <UiCardTabs
            items={tabs}
            activeId={activeId}
            onChange={setActiveId}
            ariaLabel="Этапы кейса"
            panelId={PANEL_ID}
          />
          <div className={styles.workspace}>
            <div
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={getCardTabId(PANEL_ID, activeId)}
              className={styles.stageColumn}
            >
              {activeStage ? (
                <DesignStagePanel
                  key={activeStage.id}
                  caseId={designCase.id}
                  stage={activeStage}
                  showReference={boardView === "reference"}
                  {...resolveLinks(activeStage.topicIds, activeStage.drillIds)}
                />
              ) : (
                <MarkdownView content={designCase.production} />
              )}
            </div>
            <div className={styles.boardColumn}>
              <CaseBoard
                caseId={designCase.id}
                view={boardView}
                onViewChange={setBoardView}
                reference={reference}
                referenceHint={referenceHint}
              />
            </div>
          </div>
        </div>
      </article>

      <ConfirmModal
        isOpen={isResetOpen}
        title="Сбросить кейс?"
        description={`Выбранные варианты, отметки самопроверки и схема кейса «${designCase.title}» будут удалены. Решённые дриллы останутся как есть.`}
        icon={<RotateCcw size={18} />}
        actions={[
          {
            label: "Сбросить",
            variant: "danger",
            icon: <RotateCcw size={TAB_ICON_SIZE} />,
            onClick: handleReset,
          },
        ]}
        onClose={() => setIsResetOpen(false)}
      />
    </div>
  );
};
