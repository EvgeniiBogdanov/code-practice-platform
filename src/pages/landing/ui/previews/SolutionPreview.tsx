import React from "react";
import { FileCode, HelpCircle, Lightbulb, ListChecks } from "lucide-react";
import { clsx } from "clsx";
import { CheckMark } from "./CheckMark";
import { CodeLines } from "./CodeLines";
import { PreviewWindow } from "./PreviewCard";
import { TaskTabsBar } from "./TaskTabsBar";
import type { PracticePreviewProps } from "./WorkspacePreview";
import styles from "./SectionPreviews.module.css";
import local from "./PracticePreviews.module.css";

const SOLUTION_CODE = `const debounce = (fn, ms) => {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
};`;

/** Checklist and interviewer question of the debounce task, as in the curriculum. */
const CHECKLIST = [
  "Замыкание хранит timeoutId между вызовами",
  "Прошлый таймер очищается через clearTimeout",
  "Аргументы пробрасываются через ...args",
];

const CHECK_ORDER = [styles.i4, styles.i5, styles.i6];

/** Solution tab: recommended approach, interviewer question and the self-check list. */
export const SolutionPreview = ({ isActive }: PracticePreviewProps): React.JSX.Element => (
  <div className={clsx(styles.stage, isActive && styles.active)}>
    <PreviewWindow
      className={clsx(styles.absolute, styles.stg, local.solutionWindow)}
      icon={<FileCode size={13} />}
      title="Решение · 2_Debounce.js"
    >
      <TaskTabsBar activeId="solution" />
      <div className={local.recommendation}>
        <Lightbulb size={14} className={local.recommendationIcon} />
        <b>Рекомендуемое решение</b>
        <span className={clsx(styles.chip, styles.chipBlue)}>Асинхронный таймер</span>
      </div>
      <CodeLines code={SOLUTION_CODE} />
    </PreviewWindow>

    <div
      className={clsx(styles.absolute, styles.miniCard, styles.stg, styles.i2, local.questionCard)}
    >
      <p className={styles.miniTitle}>
        <HelpCircle size={15} className={local.questionIcon} />
        Вопрос интервьюера
      </p>
      <p className={local.question}>В чём фундаментальная разница между debounce и throttle?</p>
      <p className={styles.mutedText}>
        Debounce ждёт паузу и сбрасывает таймер на каждом вызове, throttle вызывает функцию не чаще
        раза в N мс.
      </p>
    </div>

    <div
      className={clsx(styles.absolute, styles.miniCard, styles.stg, styles.i3, local.checklistCard)}
    >
      <p className={styles.miniTitle}>
        <ListChecks size={15} className={local.checklistIcon} />
        Самопроверка
        <span className={clsx(styles.chip, styles.chipGreen)}>3 / 3</span>
      </p>
      <ul className={local.checklist}>
        {CHECKLIST.map((item, index) => (
          <li key={item} className={clsx(local.checkItem, CHECK_ORDER[index])}>
            <CheckMark />
            {item}
          </li>
        ))}
      </ul>
    </div>

    <span className={clsx(styles.absolute, styles.stg, styles.i6, local.complexity)}>
      O(1) памяти · O(1) на вызов
    </span>
  </div>
);
