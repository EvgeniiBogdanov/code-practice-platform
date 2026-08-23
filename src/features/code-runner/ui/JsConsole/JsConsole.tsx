import React, { useEffect } from "react";
import "@xterm/xterm/css/xterm.css";
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
  const toggleConsoleCollapsed = useUIStore((state) => state.toggleConsoleCollapsed);

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : storeConsoleCollapsed;
  const onToggle =
    propOnToggleCollapse !== undefined ? propOnToggleCollapse : toggleConsoleCollapsed;

  // Auto-expand console when execution starts
  useEffect(() => {
    if (isRunning && isCollapsed) {
      onToggle();
    }
  }, [isRunning, isCollapsed, onToggle]);

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
    <div
      className={[styles.consoleCard, embedded && styles.embedded, className]
        .filter(Boolean)
        .join(" ")}
    >
      <JsConsoleHeader
        filename={filename}
        customTitle={customTitle}
        isRunning={isRunning}
        isCollapsed={isCollapsed}
        lastExecution={lastExecution}
        onRun={onRun}
        onStop={onStop}
        onClear={handleClear}
        onToggleCollapse={onToggle}
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
