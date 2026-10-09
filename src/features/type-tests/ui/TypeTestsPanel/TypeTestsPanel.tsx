import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ListChecks,
  LoaderCircle,
  Play,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { clsx } from "clsx";
import { CodeButton, PanelToolbar, Tooltip, UiKbd } from "@/shared/ui";
import { parseTestOutline, type EditorDiagnostic } from "@/shared/lib/code-editor";
import { MAX_TESTS_FONT_SIZE, MIN_TESTS_FONT_SIZE, useUIStore } from "@/entities/ui-state";
import { HINT_AFTER_FAILED_RUNS, type TypeTestsController } from "../../model/useTypeTests";
import { TestsTabContent } from "./TestsTabContent";
import styles from "./TypeTestsPanel.module.css";

/** A fast check should not flash loaders: they appear only if the check takes this long. */
const RUNNING_INDICATOR_DELAY_MS = 150;

export interface TypeTestsPanelProps {
  taskId: string;
  controller: TypeTestsController;
  tests: string;
  testsHash: string;
  /** The reference solution: tests can be run, but no next steps are offered. */
  mode?: "practice" | "reference";
  isSolved?: boolean;
  onMarkSolved?: () => void;
  onShowReference?: () => void;
  onNextTask?: () => void;
  onBackToTask?: () => void;
  onRequestHint?: () => void;
  onShowCompileProblem: (problem: EditorDiagnostic) => void;
  className?: string;
}

const useDelayedFlag = (isActive: boolean, delayMs: number): boolean => {
  const [isShown, setIsShown] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setIsShown(true), delayMs);
    return (): void => {
      clearTimeout(timer);
      setIsShown(false);
    };
  }, [isActive, delayMs]);
  return isActive && isShown;
};

export const TypeTestsPanel = ({
  taskId,
  controller,
  tests,
  testsHash,
  mode = "practice",
  isSolved,
  onMarkSolved,
  onShowReference,
  onNextTask,
  onBackToTask,
  onRequestHint,
  onShowCompileProblem,
  className,
}: TypeTestsPanelProps): React.JSX.Element => {
  const { report, phase } = controller;
  const isRunning = phase === "running";
  const isPractice = mode === "practice";
  const outline = useMemo(() => parseTestOutline(tests), [tests]);
  const showRunning = useDelayedFlag(isRunning, RUNNING_INDICATOR_DELAY_MS);

  const storeCollapsed = useUIStore((state) => state.consoleCollapsed);
  const setConsoleCollapsed = useUIStore((state) => state.setConsoleCollapsed);
  const fontSize = useUIStore((state) => state.testsFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseTestsFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseTestsFontSize);
  // A run started by the user reveals a collapsed panel without changing the persistent setting;
  // the automatic first check never does. The reveal is bound to the task, like in the console.
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const [seenManualRuns, setSeenManualRuns] = useState(controller.manualRuns);
  if (controller.manualRuns !== seenManualRuns) {
    setSeenManualRuns(controller.manualRuns);
    setRevealedFor(taskId);
  }
  const isCollapsed = storeCollapsed && revealedFor !== taskId;
  const handleToggleCollapse = (): void => {
    setRevealedFor(null);
    setConsoleCollapsed(!isCollapsed);
  };

  const [nudgeUsed, setNudgeUsed] = useState(false);
  const showHintNudge = isPractice && !nudgeUsed && controller.failedRuns >= HINT_AFTER_FAILED_RUNS;

  const summary =
    report && !controller.isStale ? `Пройдено ${report.passed} из ${report.total}` : "";

  return (
    <section className={clsx(styles.panel, className)} aria-label="Проверка решения">
      <PanelToolbar
        className={styles.toolbar}
        left={
          <span className={styles.title}>
            <ListChecks size={13} className={styles.titleIcon} aria-hidden="true" />
            <span>Тесты</span>
            {report ? (
              <span
                className={styles.counter}
                aria-label={`Пройдено ${report.passed}, не пройдено ${report.total - report.passed}`}
              >
                <span aria-hidden="true">(</span>
                <span className={styles.counterPassed}>{report.passed}</span>
                {report.passed < report.total && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span className={styles.counterFailed}>{report.total - report.passed}</span>
                  </>
                )}
                <span aria-hidden="true">)</span>
              </span>
            ) : (
              <span className={styles.counter}>({outline.length + 1})</span>
            )}
          </span>
        }
        right={
          <>
            <Tooltip
              content={
                <>
                  Запустить тесты <UiKbd keys={["Ctrl", "Enter"]} size="sm" />
                </>
              }
              side="top"
            >
              <CodeButton
                variant="success"
                icon={
                  isRunning ? (
                    <LoaderCircle size={14} className={styles.spinner} />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )
                }
                disabled={isRunning}
                aria-label="Запустить тесты"
                onClick={controller.run}
              />
            </Tooltip>
            <Tooltip content={`Уменьшить шрифт (${fontSize}px)`} side="top">
              <CodeButton
                icon={<ZoomOut size={14} />}
                onClick={decreaseFontSize}
                disabled={fontSize <= MIN_TESTS_FONT_SIZE}
                aria-label="Уменьшить шрифт"
              />
            </Tooltip>
            <Tooltip content={`Увеличить шрифт (${fontSize}px)`} side="top">
              <CodeButton
                icon={<ZoomIn size={14} />}
                onClick={increaseFontSize}
                disabled={fontSize >= MAX_TESTS_FONT_SIZE}
                aria-label="Увеличить шрифт"
              />
            </Tooltip>
            <CodeButton
              icon={isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              aria-label={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
              aria-expanded={!isCollapsed}
              onClick={handleToggleCollapse}
            />
          </>
        }
      />

      <p className={styles.srOnly} role="status" aria-live="polite">
        {summary}
      </p>

      {!isCollapsed && (
        <div
          className={clsx(styles.body, styles[`font${fontSize}`])}
          role="region"
          aria-label="Результаты тестов"
        >
          <TestsTabContent
            taskId={taskId}
            controller={controller}
            outline={outline}
            testsHash={testsHash}
            showRunning={showRunning}
            isSolved={isSolved}
            hideIdleNote={!isPractice}
            showHintNudge={showHintNudge}
            onDismissHintNudge={() => setNudgeUsed(true)}
            onRequestHint={
              onRequestHint
                ? () => {
                    setNudgeUsed(true);
                    onRequestHint();
                  }
                : undefined
            }
            onMarkSolved={onMarkSolved}
            onShowReference={onShowReference}
            onNextTask={onNextTask}
            onBackToTask={onBackToTask}
            onShowCompileProblem={onShowCompileProblem}
          />
        </div>
      )}
    </section>
  );
};
