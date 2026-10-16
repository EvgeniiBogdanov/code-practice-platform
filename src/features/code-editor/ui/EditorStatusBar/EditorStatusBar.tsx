import React, { memo, useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import type { LanguageId } from "@/shared/lib/code-editor";
import { TAB_SIZE, getLanguageInfo, pluralize, type PluralForms } from "../../lib/editorUtils";
import styles from "./EditorStatusBar.module.css";

export interface EditorStatusBarProps {
  code: string;
  filepath: string;
  lineCount: number;
  cursorLine: number;
  cursorCol: number;
  errorCount: number;
  /** Message of the problem at the caret, shown with the error count. */
  problemMessage?: string;
  onGoToProblem: () => void;
  /** Number of selections of a multi-cursor edit; 0 with a single cursor. */
  multiCursorCount: number;
  formatNotice: string | null;
}

const LANGUAGE_ICON_CLASSES: Record<LanguageId, string> = {
  javascript: styles.langIconJs,
  javascriptreact: styles.langIconJsx,
  typescript: styles.langIconTs,
  typescriptreact: styles.langIconTsx,
  css: styles.langIconCss,
  scss: styles.langIconCss,
  less: styles.langIconCss,
  html: styles.langIconHtml,
  json: styles.langIconJson,
  sql: styles.langIconSql,
  shellscript: styles.langIconOther,
  markdown: styles.langIconOther,
  plaintext: styles.langIconOther,
};
const ERROR_FORMS: PluralForms = { one: "ошибка", few: "ошибки", many: "ошибок" };
const LINE_FORMS: PluralForms = { one: "строка", few: "строки", many: "строк" };
/** How long "Сохранение..." stays after the last edit. */
const SAVE_PULSE_MS = 450;

/**
 * The editor footer. The save pulse lives here: it changes twice per typing burst,
 * and only the footer has to re-render for it.
 */
export const EditorStatusBar = memo(
  ({
    code,
    filepath,
    lineCount,
    cursorLine,
    cursorCol,
    errorCount,
    problemMessage = "",
    onGoToProblem,
    multiCursorCount,
    formatNotice,
  }: EditorStatusBarProps): React.JSX.Element => {
    const langInfo = useMemo(() => getLanguageInfo(filepath), [filepath]);
    const [pulsedCode, setPulsedCode] = useState(code);
    const [isSaving, setIsSaving] = useState(false);
    if (code !== pulsedCode) {
      setPulsedCode(code);
      setIsSaving(true);
    }
    useEffect(() => {
      if (!isSaving) return;
      const timer = setTimeout(() => setIsSaving(false), SAVE_PULSE_MS);
      return (): void => clearTimeout(timer);
    }, [isSaving, pulsedCode]);

    return (
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          {formatNotice && (
            <>
              <span className={clsx(styles.statusItem, styles.diagErr)} role="status">
                {formatNotice}
              </span>
              <span className={styles.statusSep}>|</span>
            </>
          )}
          <Tooltip
            content={
              isSaving
                ? "Сохранение вашего прогресса..."
                : "Решение автоматически сохранено в браузере"
            }
            side="top"
          >
            <span
              className={clsx(
                styles.statusItem,
                styles.saveIndicator,
                isSaving && styles.saveIndicatorSaving
              )}
            >
              {isSaving ? (
                <>
                  <span className={styles.savePulseDot} />
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Check size={11} />
                  <span>Сохранено</span>
                </>
              )}
            </span>
          </Tooltip>

          <span className={styles.statusSep}>|</span>

          {/* Announced politely: screen readers hear the error count after each check. */}
          <span className={styles.liveRegion} role="status">
            {errorCount > 0 ? (
              <Tooltip
                content={`${problemMessage}\nF8 — следующая проблема`}
                contentClassName={styles.statusTooltip}
                side="top"
              >
                <button
                  type="button"
                  className={clsx(styles.statusItem, styles.statusButton, styles.diagErr)}
                  onClick={onGoToProblem}
                >
                  <AlertCircle size={11} />
                  <span>{pluralize(errorCount, ERROR_FORMS)}</span>
                </button>
              </Tooltip>
            ) : (
              <Tooltip content="Синтаксис и типы корректны" side="top">
                <span className={clsx(styles.statusItem, styles.diagOk)}>
                  <CheckCircle2 size={11} />
                  <span>Синтаксис корректен</span>
                </span>
              </Tooltip>
            )}
          </span>

          <span className={styles.statusSep}>|</span>

          {multiCursorCount > 1 && (
            <>
              <Tooltip
                content="Активно мульти-выделение (Cmd+D / Ctrl+D). Нажмите Esc для сброса."
                side="top"
              >
                <span className={clsx(styles.statusItem, styles.multiCursorIndicator)}>
                  <span className={styles.savePulseDot} />
                  <span>{multiCursorCount} выделений</span>
                </span>
              </Tooltip>
              <span className={styles.statusSep}>|</span>
            </>
          )}

          <span className={styles.statusItem}>
            Стр {cursorLine}, Кол {cursorCol}
          </span>
          <span className={styles.statusSep}>|</span>
          <span className={styles.statusItem}>
            {pluralize(lineCount, LINE_FORMS)} ({code.length} симв)
          </span>
        </div>

        <div className={styles.statusRight}>
          <span className={styles.statusItem}>Пробелы: {TAB_SIZE}</span>
          <span className={styles.statusSep}>|</span>
          <span className={styles.statusItem}>UTF-8</span>
          <span className={styles.statusSep}>|</span>
          <Tooltip content={`Язык синтаксиса: ${langInfo.name}`} side="top">
            <span className={styles.statusItem}>
              <Code2 size={11} className={LANGUAGE_ICON_CLASSES[langInfo.id]} />
              <span>{langInfo.name}</span>
            </span>
          </Tooltip>
        </div>
      </div>
    );
  }
);

EditorStatusBar.displayName = "EditorStatusBar";
