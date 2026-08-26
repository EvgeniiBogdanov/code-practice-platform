import React, { useState, useEffect, useRef, memo } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Square,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { Tooltip, CodeButton } from "@/shared/ui";
import { useCopy } from "@/shared/lib/hooks";
import styles from "./JsConsole.module.css";

export interface JsConsoleHeaderProps {
  filename?: string;
  customTitle?: string;
  isRunning?: boolean;
  isCollapsed?: boolean;
  lastExecution?: { durationMs?: number; exitCode?: number } | null;
  logCount?: number;
  onRun?: () => void;
  onStop?: () => void;
  onClear?: () => void;
  onToggleCollapse?: () => void;
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  fontSize?: number;
  textToCopy?: string;
}

const useLongRunningIndicator = (isRunning: boolean) => {
  const [showLongRunning, setShowLongRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      if (!showLongRunning) {
        timerRef.current = setTimeout(() => {
          setShowLongRunning(true);
          shownAtRef.current = Date.now();
        }, 180);
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (showLongRunning) {
        const elapsed = Date.now() - shownAtRef.current;
        const holdTime = Math.max(0, 250 - elapsed);
        const hideTimer = setTimeout(() => setShowLongRunning(false), holdTime);
        return () => clearTimeout(hideTimer);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, showLongRunning]);

  return showLongRunning;
};

export const JsConsoleHeader = memo(
  ({
    customTitle,
    isRunning = false,
    isCollapsed = false,
    lastExecution,
    logCount = 0,
    onRun,
    onStop,
    onClear,
    onToggleCollapse,
    onIncreaseFontSize,
    onDecreaseFontSize,
    fontSize = 14,
    textToCopy = "",
  }: JsConsoleHeaderProps) => {
    const { copied, copy } = useCopy(textToCopy);
    const showLongRunning = useLongRunningIndicator(isRunning);

    return (
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>
            <TerminalIcon size={13} className={styles.consoleIcon} />
            <span>{customTitle || "Консоль"}</span>
            {logCount > 0 && <span className={styles.counter}>{logCount}</span>}
          </span>
          {lastExecution?.durationMs !== undefined && (
            <span className={styles.executionBadge}>({lastExecution.durationMs}ms)</span>
          )}
        </div>

        <div className={styles.headerRight}>
          {showLongRunning && (
            <span className={styles.badgeRunning}>
              <Loader2 size={12} className={styles.spinIcon} />
              <span>Выполнение...</span>
            </span>
          )}

          {showLongRunning && onStop ? (
            <Tooltip content="Остановить выполнение (Stop)" side="top">
              <CodeButton
                variant="danger"
                icon={<Square size={13} fill="currentColor" />}
                onClick={onStop}
                aria-label="Остановить"
              />
            </Tooltip>
          ) : (
            onRun && (
              <Tooltip content="Запустить код (Ctrl+Enter)" side="top">
                <CodeButton
                  variant="success"
                  icon={<Play size={14} fill="currentColor" />}
                  onClick={onRun}
                  disabled={isRunning}
                  aria-label="Запустить код"
                />
              </Tooltip>
            )
          )}

          {onClear && (
            <Tooltip content="Очистить вывод консоли" side="top">
              <CodeButton
                icon={<Trash2 size={14} />}
                onClick={onClear}
                disabled={logCount === 0 && !lastExecution}
                aria-label="Очистить"
              />
            </Tooltip>
          )}

          <Tooltip content={copied ? "Скопировано!" : "Скопировать вывод консоли"} side="top">
            <CodeButton
              icon={
                copied ? <Check size={14} className={styles.copiedCheck} /> : <Copy size={14} />
              }
              onClick={() => copy()}
              disabled={!textToCopy}
              aria-label="Копировать"
            />
          </Tooltip>

          {onDecreaseFontSize && (
            <Tooltip content={`Уменьшить шрифт (${fontSize}px)`} side="top">
              <CodeButton
                icon={<ZoomOut size={14} />}
                onClick={onDecreaseFontSize}
                disabled={fontSize <= 12}
                aria-label="Уменьшить шрифт"
              />
            </Tooltip>
          )}

          {onIncreaseFontSize && (
            <Tooltip content={`Увеличить шрифт (${fontSize}px)`} side="top">
              <CodeButton
                icon={<ZoomIn size={14} />}
                onClick={onIncreaseFontSize}
                disabled={fontSize >= 24}
                aria-label="Увеличить шрифт"
              />
            </Tooltip>
          )}

          {onToggleCollapse && (
            <Tooltip content={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"} side="top">
              <CodeButton
                icon={isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
);

JsConsoleHeader.displayName = "JsConsoleHeader";
