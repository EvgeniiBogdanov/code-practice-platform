import React from "react";
import { CheckCircle2, ChevronDown, ChevronUp, ListChecks, Play } from "lucide-react";
import { clsx } from "clsx";
import {
  Button,
  Callout,
  CodeButton,
  InlineCodeText,
  PanelToolbar,
  SegmentedProgress,
  TestStatusItem,
  Tooltip,
  UiKbd,
  UiSpinner,
  type ProgressSegmentTone,
  type TestStatus,
} from "@/shared/ui";
import { useUIStore } from "@/entities/ui-state";
import { isDrillReportPassed, type DrillTestCaseResult } from "@/shared/lib/code-runners";
import type { DrillTestsController } from "../../model/useDrillTests";
import {
  formatDuration,
  getLoadErrorTitle,
  groupBySuite,
  type DrillTestRow,
} from "../../model/drillTestsPresentation";
import styles from "./DrillTestsPanel.module.css";

export interface DrillTestsPanelProps {
  controller: DrillTestsController;
  /** The task is already marked as solved (by this panel or by hand). */
  isSolved?: boolean;
  onShowReference?: () => void;
  onNextTask?: () => void;
  className?: string;
}

const SEGMENT_TONE: Record<TestStatus, ProgressSegmentTone> = {
  passed: "success",
  failed: "danger",
  idle: "neutral",
  running: "neutral",
  skipped: "neutral",
};

const toStatus = (test: DrillTestCaseResult, isRunning: boolean): TestStatus => {
  if (isRunning) return "running";
  return test.passed ? "passed" : "failed";
};

/** Result of running the solution against the task's tests (system-design drills and alike). */
export const DrillTestsPanel = ({
  controller,
  isSolved,
  onShowReference,
  onNextTask,
  className,
}: DrillTestsPanelProps): React.JSX.Element => {
  const { report, phase, isStale, expandedRows } = controller;
  const isRunning = phase === "running";
  const storeCollapsed = useUIStore((state) => state.consoleCollapsed);
  const setConsoleCollapsed = useUIStore((state) => state.setConsoleCollapsed);

  // A run started by the user reveals a collapsed panel without changing the persistent setting,
  // like the console does. Only local state is updated during render: a store update here would
  // re-render other components mid-render.
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [seenRuns, setSeenRuns] = React.useState(controller.manualRuns);
  if (controller.manualRuns !== seenRuns) {
    setSeenRuns(controller.manualRuns);
    setIsRevealed(true);
  }
  const isCollapsed = storeCollapsed && !isRevealed;
  const toggleCollapsed = (): void => {
    setIsRevealed(false);
    setConsoleCollapsed(!isCollapsed);
  };

  const passed = report?.tests.filter((t) => t.passed).length ?? 0;
  const total = report?.tests.length ?? 0;
  const tests = report?.tests ?? [];
  const showSuccess = report !== null && !isStale && isDrillReportPassed(report);
  const summary = report && !isStale ? `Пройдено ${passed} из ${total}` : "";
  const segments = tests.map((test) => SEGMENT_TONE[toStatus(test, isRunning)]);

  const renderRow = ({ index, test }: DrillTestRow): React.JSX.Element => (
    <TestStatusItem
      key={index}
      status={toStatus(test, isRunning)}
      isStale={isStale}
      title={<InlineCodeText>{test.name}</InlineCodeText>}
      isExpanded={expandedRows.has(index)}
      onToggle={() => controller.toggleRow(index)}
    >
      {test.error ? <pre className={styles.error}>{test.error}</pre> : null}
    </TestStatusItem>
  );

  return (
    <section className={clsx(styles.panel, className)} aria-label="Проверка решения">
      <PanelToolbar
        className={styles.toolbar}
        left={
          <span className={styles.title}>
            <ListChecks size={13} className={styles.titleIcon} aria-hidden="true" />
            <span>Тесты</span>
            {report && report.loadError === null && (
              <span
                className={styles.counter}
                aria-label={`Пройдено ${passed}, не пройдено ${total - passed}`}
              >
                <span aria-hidden="true">(</span>
                <span className={styles.counterPassed}>{passed}</span>
                {passed < total && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span className={styles.counterFailed}>{total - passed}</span>
                  </>
                )}
                <span aria-hidden="true">)</span>
              </span>
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
                icon={isRunning ? <UiSpinner size={14} /> : <Play size={14} fill="currentColor" />}
                disabled={isRunning}
                aria-label="Запустить тесты"
                onClick={controller.run}
              />
            </Tooltip>
            <CodeButton
              icon={isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              aria-label={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
              aria-expanded={!isCollapsed}
              onClick={toggleCollapsed}
            />
          </>
        }
      />

      <p className={styles.srOnly} role="status" aria-live="polite">
        {summary}
      </p>

      {!isCollapsed && (
        <div className={styles.body} role="region" aria-label="Результаты тестов">
          {segments.length > 0 && (
            <div className={styles.pin}>
              <SegmentedProgress segments={segments} label="Пройдено тестов" />
            </div>
          )}
          <div className={styles.items}>
            {report?.loadError && (
              <Callout color="red" size="sm" title={getLoadErrorTitle(report.loadError.source)}>
                <pre className={styles.error}>{report.loadError.message}</pre>
              </Callout>
            )}

            {showSuccess && report && (
              <Callout
                color="green"
                size="sm"
                icon={<CheckCircle2 size={18} />}
                title={`Все тесты пройдены · ${formatDuration(report.durationMs)}`}
              >
                <p className={styles.note}>
                  {isSolved ? "Задача отмечена решённой." : "Задача решена."}
                </p>
                <div className={styles.actions}>
                  {onShowReference && (
                    <Button variant="outline" size="sm" onClick={onShowReference}>
                      Посмотреть эталон
                    </Button>
                  )}
                  {onNextTask && (
                    <Button variant="outline" size="sm" onClick={onNextTask}>
                      Следующая задача →
                    </Button>
                  )}
                </div>
              </Callout>
            )}

            {isStale && (
              <div className={styles.stale} role="status">
                <span>Код изменён — результаты устарели.</span>
                <Button variant="outline" size="sm" onClick={controller.run}>
                  Запустить
                </Button>
              </div>
            )}

            {!report && (
              <p className={styles.note}>
                Нажмите «Запустить», чтобы проверить решение автотестами. Решение должно
                экспортировать нужные функции (<InlineCodeText>export</InlineCodeText>).
              </p>
            )}

            <ul className={styles.list} role="list">
              {groupBySuite(tests).map((group) =>
                group.name === null ? (
                  group.rows.map(renderRow)
                ) : (
                  <li key={`group-${group.name}`} className={styles.group}>
                    <span className={styles.groupName}>
                      <InlineCodeText>{group.name}</InlineCodeText>
                    </span>
                    <ul className={styles.list} role="list">
                      {group.rows.map(renderRow)}
                    </ul>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
