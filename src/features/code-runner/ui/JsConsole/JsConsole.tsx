import React, { useState, useEffect, useCallback } from "react";
import "@xterm/xterm/css/xterm.css";
import { clsx } from "clsx";
import { NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import { useUIStore } from "@/entities/ui-state";
import { useXtermConsole } from "../../model/useXtermConsole";
import { JsConsoleHeader } from "./JsConsoleHeader";
import styles from "./JsConsole.module.css";

export interface JsConsoleProps {
  logs?: NodeRunnerLogEntry[];
  isRunning?: boolean;
  lastExecution?: { durationMs?: number; exitCode?: number } | null;
  filename?: string;
  customTitle?: string;
  onRun?: () => void;
  onStop?: () => void;
  onClear?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  embedded?: boolean;
  className?: string;
}

export function JsConsole({
  logs = [],
  isRunning = false,
  lastExecution = null,
  filename = "main.js",
  customTitle,
  onRun,
  onStop,
  onClear,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
  embedded = true,
  className,
}: JsConsoleProps) {
  const theme = useUIStore((state) => state.theme);
  const consoleFontSize = useUIStore((state) => state.consoleFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseConsoleFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseConsoleFontSize);
  const storeConsoleCollapsed = useUIStore((state) => state.consoleCollapsed);
  const setConsoleCollapsed = useUIStore((state) => state.setConsoleCollapsed);

  // Local temporary reveal state when user runs code while console is collapsed
  const [temporarilyRevealed, setTemporarilyRevealed] = useState(false);

  // Reset temporary reveal when switching tasks or files
  useEffect(() => {
    setTemporarilyRevealed(false);
  }, [filename]);

  // When execution starts, temporarily reveal the console without altering the global persistent setting
  useEffect(() => {
    if (isRunning) {
      setTemporarilyRevealed(true);
    }
  }, [isRunning]);

  // If propIsCollapsed is controlled, respect it; otherwise respect global setting adjusted by temporary reveal
  const isCollapsed =
    propIsCollapsed !== undefined ? propIsCollapsed : storeConsoleCollapsed && !temporarilyRevealed;

  // Toggle button in header explicitly changes the persistent global setting
  const handleToggle = useCallback(() => {
    if (propOnToggleCollapse) {
      propOnToggleCollapse();
      setTemporarilyRevealed(false);
      return;
    }

    if (!isCollapsed) {
      setTemporarilyRevealed(false);
      setConsoleCollapsed(true);
    } else {
      setTemporarilyRevealed(false);
      setConsoleCollapsed(false);
    }
  }, [isCollapsed, propOnToggleCollapse, setConsoleCollapsed]);

  const { terminalRef, clearTerminal } = useXtermConsole({
    logs,
    theme,
    fontSize: consoleFontSize,
    isCollapsed,
    filename,
    isRunning,
    lastExecution,
  });

  const handleClear = () => {
    clearTerminal();
    if (onClear) onClear();
  };

  const fullTextToCopy = logs
    .map((log) => {
      const prefix =
        log.type === "error"
          ? "[Error] "
          : log.type === "warn"
            ? "[Warn] "
            : log.type === "info"
              ? "[Info] "
              : log.type === "time"
                ? "[Timer] "
                : "";
      return `${prefix}${log.text}`;
    })
    .join("\n");

  return (
    <div className={clsx(styles.consoleCard, embedded && styles.embedded, className)}>
      <JsConsoleHeader
        filename={filename}
        customTitle={customTitle}
        isRunning={isRunning}
        isCollapsed={isCollapsed}
        lastExecution={lastExecution}
        onRun={onRun}
        onStop={onStop}
        onClear={handleClear}
        onToggleCollapse={handleToggle}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        fontSize={consoleFontSize}
        logCount={logs.length}
        textToCopy={fullTextToCopy}
      />

      {!isCollapsed && <div ref={terminalRef} className={styles.terminalBody} />}
    </div>
  );
}
