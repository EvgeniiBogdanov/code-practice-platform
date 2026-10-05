import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import {
  CaseSensitive,
  ChevronDown,
  ChevronUp,
  Regex,
  Replace,
  ReplaceAll,
  WholeWord,
  X,
} from "lucide-react";
import { CodeButton, Tooltip } from "@/shared/ui";
import type { FindReplaceState } from "../../model/use-find-replace";
import { matchesKey } from "../../lib/editor-key-helpers";
import styles from "./FindReplaceBar.module.css";

export interface FindReplaceBarProps {
  find: FindReplaceState;
  readOnly?: boolean;
}

type InputKeyEvent = React.KeyboardEvent<HTMLInputElement>;

const getStatus = (find: FindReplaceState): string => {
  if (find.error) return "Неверное выражение";
  if (find.replacedCount !== null) return `Заменено: ${find.replacedCount}`;
  if (!find.query) return "";
  if (find.matchCount === 0) return "Нет результатов";
  return find.activeIndex >= 0
    ? `${find.activeIndex + 1} из ${find.matchCount}`
    : `Найдено: ${find.matchCount}`;
};

/** Find / replace / go-to-line panel in the top-right corner of the editor, as in VS Code. */
export const FindReplaceBar = ({
  find,
  readOnly = false,
}: FindReplaceBarProps): React.JSX.Element | null => {
  const queryRef = useRef<HTMLInputElement>(null);
  const lineRef = useRef<HTMLInputElement>(null);
  const { mode } = find;

  // Opening, or switching between find and go-to-line, moves focus into the panel.
  const focusTarget = mode === "goto" ? "line" : mode ? "query" : null;
  useEffect(() => {
    const input = focusTarget === "line" ? lineRef.current : queryRef.current;
    input?.focus();
    input?.select();
  }, [focusTarget]);

  if (!mode) return null;

  const handleKeyDown = (e: InputKeyEvent, onEnter: (shift: boolean) => void): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter(e.shiftKey);
    } else if (e.key === "Escape") {
      e.preventDefault();
      find.close();
    } else if (e.altKey && !e.metaKey && !e.ctrlKey) {
      // Alt+C / Alt+W / Alt+R toggle the search options, as in VS Code.
      const option = matchesKey(e, "KeyC")
        ? "caseSensitive"
        : matchesKey(e, "KeyW")
          ? "wholeWord"
          : matchesKey(e, "KeyR")
            ? "regex"
            : null;
      if (option) {
        e.preventDefault();
        find.toggleOption(option);
      }
    }
  };

  if (mode === "goto") {
    return (
      <div className={styles.bar} role="search" aria-label="Переход к строке">
        <div className={styles.row}>
          <input
            ref={lineRef}
            name="go-to-line"
            className={styles.input}
            type="text"
            inputMode="numeric"
            placeholder="Номер строки"
            aria-label="Номер строки"
            value={find.lineNumber}
            onChange={(e) => find.setLineNumber(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => handleKeyDown(e, find.goToLine)}
          />
          <CodeButton
            icon={<X size={14} />}
            onClick={find.close}
            aria-label="Закрыть"
            title="Закрыть (Esc)"
          />
        </div>
      </div>
    );
  }

  const status = getStatus(find);
  const canReplace = !readOnly && !find.error && find.matchCount > 0;

  return (
    <div className={styles.bar} role="search" aria-label="Поиск в коде">
      <div className={styles.row}>
        <input
          ref={queryRef}
          name="find-query"
          className={clsx(styles.input, find.error && styles.invalid)}
          type="text"
          placeholder="Найти"
          aria-label="Найти"
          aria-invalid={Boolean(find.error)}
          value={find.query}
          onChange={(e) => find.setQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, (shift) => find.step(shift ? -1 : 1))}
        />
        <span
          className={clsx(
            styles.status,
            (find.error || find.matchCount === 0) && find.query && styles.statusError
          )}
          aria-live="polite"
        >
          {status}
        </span>
        <Tooltip content="Предыдущее (Shift+Enter)" side="bottom">
          <CodeButton
            icon={<ChevronUp size={14} />}
            onClick={() => find.step(-1)}
            disabled={find.matchCount === 0}
            aria-label="Предыдущее совпадение"
          />
        </Tooltip>
        <Tooltip content="Следующее (Enter)" side="bottom">
          <CodeButton
            icon={<ChevronDown size={14} />}
            onClick={() => find.step(1)}
            disabled={find.matchCount === 0}
            aria-label="Следующее совпадение"
          />
        </Tooltip>
        <Tooltip content="Учитывать регистр (Alt+C)" side="bottom">
          <CodeButton
            icon={<CaseSensitive size={14} />}
            isActive={find.options.caseSensitive}
            onClick={() => find.toggleOption("caseSensitive")}
            aria-label="Учитывать регистр"
            aria-pressed={find.options.caseSensitive}
          />
        </Tooltip>
        <Tooltip content="Слово целиком (Alt+W)" side="bottom">
          <CodeButton
            icon={<WholeWord size={14} />}
            isActive={find.options.wholeWord}
            onClick={() => find.toggleOption("wholeWord")}
            aria-label="Слово целиком"
            aria-pressed={find.options.wholeWord}
          />
        </Tooltip>
        <Tooltip content="Регулярное выражение (Alt+R)" side="bottom">
          <CodeButton
            icon={<Regex size={14} />}
            isActive={find.options.regex}
            onClick={() => find.toggleOption("regex")}
            aria-label="Регулярное выражение"
            aria-pressed={find.options.regex}
          />
        </Tooltip>
        <CodeButton
          icon={<X size={14} />}
          onClick={find.close}
          aria-label="Закрыть"
          title="Закрыть (Esc)"
        />
      </div>
      {mode === "replace" && !readOnly && (
        <div className={styles.row}>
          <input
            name="find-replacement"
            className={styles.input}
            type="text"
            placeholder="Заменить"
            aria-label="Заменить на"
            value={find.replacement}
            onChange={(e) => find.setReplacement(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, find.replaceCurrent)}
          />
          <Tooltip content="Заменить (Enter)" side="bottom">
            <CodeButton
              icon={<Replace size={14} />}
              onClick={find.replaceCurrent}
              disabled={!canReplace}
              aria-label="Заменить"
            />
          </Tooltip>
          <Tooltip content="Заменить все" side="bottom">
            <CodeButton
              icon={<ReplaceAll size={14} />}
              onClick={find.replaceEverything}
              disabled={!canReplace}
              aria-label="Заменить все"
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};
