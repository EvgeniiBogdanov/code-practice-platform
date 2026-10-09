import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  Button,
  Callout,
  InlineCodeText,
  LintIcon,
  SegmentedProgress,
  TestStatusItem,
  type ProgressSegmentTone,
  type TestStatus,
} from "@/shared/ui";
import type { EditorDiagnostic, TestOutlineItem, TypeTestReport } from "@/shared/lib/code-editor";
import { pluralizeRu } from "@/shared/lib/plural";
import type { TypeTestsController } from "../../model/useTypeTests";
import { COMPILE_CASE_ID, formatDuration, isFullPass } from "../../model/typeTestsPresentation";
import { buildCaseGroups, type CaseRow } from "../../model/typeTestsRows";
import { buildIssueUrl } from "../../model/typeTestsIssues";
import { CaseDetails, CompileDetails } from "./CaseDetails";
import { SuccessBanner } from "./SuccessBanner";
import styles from "./TestsTabContent.module.css";

const TEST_FORMS = ["тест", "теста", "тестов"] as const;

const SEGMENT_TONE: Record<TestStatus, ProgressSegmentTone> = {
  passed: "success",
  failed: "danger",
  idle: "neutral",
  running: "neutral",
  skipped: "neutral",
};

export interface TestsTabContentProps {
  taskId: string;
  controller: TypeTestsController;
  outline: readonly TestOutlineItem[];
  testsHash: string;
  /** Shows loaders in the rows while a slow check is under way. */
  showRunning: boolean;
  isSolved?: boolean;
  /** The reference solution is checked on its own: no "press Run" hint. */
  hideIdleNote?: boolean;
  showHintNudge: boolean;
  onDismissHintNudge: () => void;
  onRequestHint?: () => void;
  onMarkSolved?: () => void;
  onShowReference?: () => void;
  onNextTask?: () => void;
  onBackToTask?: () => void;
  onShowCompileProblem: (problem: EditorDiagnostic) => void;
}

const getCompileStatus = (report: TypeTestReport | null): TestStatus => {
  if (!report) return "idle";
  return report.compile.passed ? "passed" : "failed";
};

export const TestsTabContent = ({
  taskId,
  controller,
  outline,
  testsHash,
  showRunning,
  isSolved,
  hideIdleNote = false,
  showHintNudge,
  onDismissHintNudge,
  onRequestHint,
  onMarkSolved,
  onShowReference,
  onNextTask,
  onBackToTask,
  onShowCompileProblem,
}: TestsTabContentProps): React.JSX.Element => {
  const { report, isStale, phase, expandedIds } = controller;
  const groups = useMemo(() => buildCaseGroups(outline, report), [outline, report]);
  const showSuccess = report !== null && !isStale && isFullPass(report);
  // The banner fades in only when a run produces it. Remounting an already passed panel
  // (switching tabs, expanding the panel) shows it at once.
  const [hasSeenNoSuccess, setHasSeenNoSuccess] = useState(!showSuccess);
  if (!showSuccess && !hasSeenNoSuccess) setHasSeenNoSuccess(true);
  const rowStatus = (status: TestStatus): TestStatus => (showRunning ? "running" : status);

  const segments: ProgressSegmentTone[] = [
    getCompileStatus(report),
    ...groups.flatMap((group) => group.rows.map((row) => row.status)),
  ].map((status) => SEGMENT_TONE[rowStatus(status)]);

  const renderRow = (row: CaseRow): React.JSX.Element => (
    <TestStatusItem
      key={row.id}
      status={rowStatus(row.status)}
      isStale={isStale}
      title={<InlineCodeText>{row.name}</InlineCodeText>}
      isExpanded={expandedIds.has(row.id)}
      onToggle={() => controller.toggleCase(row.id)}
    >
      {report && row.result && row.status !== "passed" ? (
        <CaseDetails result={row.result} compile={report.compile} />
      ) : null}
    </TestStatusItem>
  );

  return (
    <>
      <div className={styles.pin}>
        <SegmentedProgress segments={segments} label="Пройдено тестов" />
      </div>
      <div className={styles.items}>
        {(phase === "unavailable" || phase === "timeout") && (
          <Callout
            color="amber"
            size="sm"
            title={
              phase === "timeout"
                ? "Проверка заняла слишком много времени"
                : "Не удалось проверить решение"
            }
          >
            <p className={styles.note}>
              {phase === "timeout"
                ? "Возможно, рекурсивный тип не завершается. Упростите его и запустите снова."
                : "Проверка типов недоступна. Попробуйте ещё раз."}
            </p>
            <Button variant="outline" size="sm" onClick={controller.run}>
              Повторить
            </Button>
          </Callout>
        )}

        {report?.fileError && (
          <Callout color="red" size="sm" title="Ошибка в тестах задачи">
            <p className={styles.note}>Это ошибка в самих тестах, а не в вашем решении.</p>
            <a
              className={styles.link}
              href={buildIssueUrl(
                { taskId, testsHash, details: report.fileError },
                "Ошибка в тестах задачи"
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Сообщить
            </a>
          </Callout>
        )}

        {showSuccess && report && (
          <SuccessBanner
            animated={hasSeenNoSuccess}
            duration={formatDuration(report.durationMs)}
            isSolved={isSolved}
            onMarkSolved={onMarkSolved}
            onShowReference={onShowReference}
            onNextTask={onNextTask}
            onBackToTask={onBackToTask}
          />
        )}

        {showHintNudge && onRequestHint && (
          <Callout color="blue" size="sm" title="Застряли? Откройте подсказку">
            <div className={styles.actions}>
              <Button variant="outline" size="sm" onClick={onRequestHint}>
                Показать подсказку
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Закрыть совет"
                onClick={onDismissHintNudge}
              >
                <X size={14} />
              </Button>
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

        {!report && phase === "idle" && !hideIdleNote && (
          <p className={styles.note}>
            В задаче {outline.length + 1} {pluralizeRu(outline.length + 1, TEST_FORMS)}. Нажмите
            «Запустить», чтобы проверить решение.
          </p>
        )}

        <ul className={styles.list} role="list">
          <TestStatusItem
            status={rowStatus(getCompileStatus(report))}
            icon={<LintIcon size={14} />}
            isStale={isStale}
            isExpanded={expandedIds.has(COMPILE_CASE_ID)}
            onToggle={() => controller.toggleCase(COMPILE_CASE_ID)}
            title="Решение компилируется без ошибок"
          >
            {report && !report.compile.passed ? (
              <CompileDetails compile={report.compile} onShowProblem={onShowCompileProblem} />
            ) : null}
          </TestStatusItem>
          {groups.map((group) =>
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
    </>
  );
};
