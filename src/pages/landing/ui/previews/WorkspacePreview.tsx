import React from "react";
import { CheckCircle2, FileCode, Maximize2, Play, Terminal, Timer } from "lucide-react";
import { clsx } from "clsx";
import { UiKbd } from "@/shared/ui";
import { CodeLines } from "./CodeLines";
import { PreviewWindow } from "./PreviewCard";
import { TaskTabsBar } from "./TaskTabsBar";
import styles from "./SectionPreviews.module.css";
import local from "./PracticePreviews.module.css";

const CANDIDATE_CODE = `const debounce = (fn, ms) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

const log = debounce((msg) => console.log(msg), 300);
log("a"); log("b"); log("c"); // выведет "c"`;

export interface PracticePreviewProps {
  isActive: boolean;
}

/** Task workspace: tabs, editor with the candidate's solution, console and status bar. */
export const WorkspacePreview = ({ isActive }: PracticePreviewProps): React.JSX.Element => (
  <div className={clsx(styles.stage, isActive && styles.active)}>
    <PreviewWindow
      className={clsx(styles.absolute, styles.stg, local.workspaceWindow)}
      icon={<FileCode size={13} />}
      title="Практическая задача - debounce"
      actions={
        <>
          <span className={local.timer}>
            <Timer size={12} />
            24:13
          </span>
          <Maximize2 size={13} />
        </>
      }
    >
      <TaskTabsBar activeId="candidate" />
      <div className={styles.fileBar}>
        <FileCode size={13} />
        2_Debounce.js
      </div>
      <CodeLines code={CANDIDATE_CODE} activeLine={5} className={local.workspaceCode} />
      <div className={styles.consolePanel}>
        <div className={styles.consoleHeader}>
          <Terminal size={13} />
          Консоль
          <span className={local.runGroup}>
            <UiKbd keys={["⌘", "↵"]} size="sm" />
            <span className={styles.runButton}>
              <Play size={12} />
            </span>
          </span>
        </div>
        <div className={clsx(styles.consoleOutput, styles.stg, styles.i4)}>
          <span className={styles.consoleString}>&quot;c&quot;</span>
          <span className={styles.consoleOk}>
            <CheckCircle2 size={12} />
            Выполнено за 0.42 мс
          </span>
        </div>
      </div>
      <div className={styles.statusBar}>
        <span className={styles.statusOk}>
          <CheckCircle2 size={11} />
          Сохранено
        </span>
        <span className={styles.statusOk}>
          <CheckCircle2 size={11} />
          Синтаксис корректен
        </span>
        <span className={styles.statusSpacer}>Стр 5, Кол 51</span>
        <span>JavaScript</span>
      </div>
    </PreviewWindow>
  </div>
);
