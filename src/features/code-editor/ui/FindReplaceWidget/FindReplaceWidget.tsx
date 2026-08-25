import React, { memo } from "react";
import {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  CaseSensitive,
  WholeWord,
  Regex,
  Replace,
  ReplaceAll,
} from "lucide-react";
import { clsx } from "clsx";
import { Tooltip, CodeButton } from "@/shared/ui";
import { FindState, FindMatch } from "../../model/useFindReplace";
import styles from "./FindReplaceWidget.module.css";

export interface FindReplaceWidgetProps {
  findState: FindState;
  findMatches: FindMatch[];
  findInputRef: React.RefObject<HTMLInputElement | null>;
  replaceInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onFindNext: () => void;
  onFindPrev: () => void;
  onReplaceCurrent: () => void;
  onReplaceAll: () => void;
  onSetQuery: (query: string) => void;
  onSetReplaceText: (text: string) => void;
  onToggleShowReplace: () => void;
  onToggleMatchCase: () => void;
  onToggleMatchWholeWord: () => void;
  onToggleUseRegex: () => void;
}

export const FindReplaceWidget = memo(
  ({
    findState,
    findMatches,
    findInputRef,
    replaceInputRef,
    onClose,
    onFindNext,
    onFindPrev,
    onReplaceCurrent,
    onReplaceAll,
    onSetQuery,
    onSetReplaceText,
    onToggleShowReplace,
    onToggleMatchCase,
    onToggleMatchWholeWord,
    onToggleUseRegex,
  }: FindReplaceWidgetProps) => {
    if (!findState.isOpen) return null;

    return (
      <div className={styles.findWidget} role="search" aria-label="Поиск и замена">
        {/* Верхняя строка: Поиск */}
        <div className={styles.findRow}>
          <Tooltip
            content={findState.showReplace ? "Скрыть замену" : "Показать замену (Ctrl+H)"}
            side="bottom"
          >
            <CodeButton
              icon={
                <ChevronRight
                  size={14}
                  className={clsx(styles.chevronIcon, findState.showReplace && styles.chevronRotated)}
                />
              }
              onClick={onToggleShowReplace}
              aria-label="Показать/скрыть замену"
            />
          </Tooltip>

          <div className={styles.findInputWrap}>
            <input
              ref={findInputRef}
              type="text"
              className={styles.findInput}
              placeholder="Поиск..."
              value={findState.query}
              onChange={(e) => onSetQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (e.shiftKey) onFindPrev();
                  else onFindNext();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  onClose();
                } else if (e.altKey && e.key.toLowerCase() === "c") {
                  e.preventDefault();
                  onToggleMatchCase();
                } else if (e.altKey && e.key.toLowerCase() === "w") {
                  e.preventDefault();
                  onToggleMatchWholeWord();
                } else if (e.altKey && e.key.toLowerCase() === "r") {
                  e.preventDefault();
                  onToggleUseRegex();
                }
              }}
            />

            <Tooltip content="С учетом регистра (Alt+C)" side="bottom">
              <CodeButton
                icon={<CaseSensitive size={14} />}
                isActive={findState.matchCase}
                onClick={onToggleMatchCase}
                aria-label="С учетом регистра"
              />
            </Tooltip>

            <Tooltip content="Слово целиком (Alt+W)" side="bottom">
              <CodeButton
                icon={<WholeWord size={14} />}
                isActive={findState.matchWholeWord}
                onClick={onToggleMatchWholeWord}
                aria-label="Слово целиком"
              />
            </Tooltip>

            <Tooltip content="Использовать регулярное выражение (Alt+R)" side="bottom">
              <CodeButton
                icon={<Regex size={14} />}
                isActive={findState.useRegex}
                onClick={onToggleUseRegex}
                aria-label="Регулярное выражение"
              />
            </Tooltip>
          </div>

          <div className={styles.findCount}>
            {!findState.query
              ? "0 совп."
              : findMatches.length > 0
                ? `${findState.currentIndex + 1} из ${findMatches.length}`
                : "Нет совп."}
          </div>

          <Tooltip content="Предыдущее совпадение (Shift+Enter)" side="bottom">
            <CodeButton
              icon={<ChevronUp size={14} />}
              onClick={onFindPrev}
              disabled={findMatches.length === 0}
              aria-label="Предыдущее совпадение"
            />
          </Tooltip>

          <Tooltip content="Следующее совпадение (Enter)" side="bottom">
            <CodeButton
              icon={<ChevronDown size={14} />}
              onClick={onFindNext}
              disabled={findMatches.length === 0}
              aria-label="Следующее совпадение"
            />
          </Tooltip>

          <Tooltip content="Закрыть (Escape)" side="bottom">
            <CodeButton icon={<X size={14} />} onClick={onClose} aria-label="Закрыть поиск" />
          </Tooltip>
        </div>

        {/* Нижняя строка: Замена */}
        {findState.showReplace && (
          <div className={styles.findRowWithIndent}>
            <div className={styles.findInputWrap}>
              <input
                ref={replaceInputRef}
                type="text"
                className={styles.findInput}
                placeholder="Заменить на..."
                value={findState.replaceText}
                onChange={(e) => onSetReplaceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if ((e.ctrlKey || e.metaKey) && e.altKey) {
                      onReplaceAll();
                    } else {
                      onReplaceCurrent();
                    }
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    onClose();
                  }
                }}
              />
            </div>

            <Tooltip content="Заменить текущее (Enter)" side="bottom">
              <CodeButton
                icon={<Replace size={13} />}
                onClick={onReplaceCurrent}
                disabled={findMatches.length === 0}
                aria-label="Заменить текущее"
              >
                <span>Заменить</span>
              </CodeButton>
            </Tooltip>

            <Tooltip content="Заменить все совпадения (Ctrl+Alt+Enter)" side="bottom">
              <CodeButton
                icon={<ReplaceAll size={13} />}
                onClick={onReplaceAll}
                disabled={findMatches.length === 0}
                aria-label="Заменить все совпадения"
              >
                <span>Все</span>
              </CodeButton>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

FindReplaceWidget.displayName = "FindReplaceWidget";
