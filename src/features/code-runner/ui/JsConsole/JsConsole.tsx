import React, { lazy, Suspense, useState, useCallback } from "react";
import { LoaderCircle } from "lucide-react";
import { clsx } from "clsx";
import { NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import { useUIStore } from "@/entities/ui-state";
import { JsConsoleHeader } from "./JsConsoleHeader";
import styles from "./JsConsole.module.css";

const XtermTerminal = lazy(() =>
  import("./XtermTerminal").then((module) => ({ default: module.XtermTerminal }))
);

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

  // Temporary reveal when user runs code while console is collapsed; bound to a file, so switching files resets it
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const temporarilyRevealed = revealedFor === filename;

  // When execution starts, temporarily reveal the console without altering the global persistent setting
  const [wasRunning, setWasRunning] = useState(false);
  if (isRunning !== wasRunning) {
    setWasRunning(isRunning);
    if (isRunning) setRevealedFor(filename);
  }

  // If propIsCollapsed is controlled, respect it; otherwise respect global setting adjusted by temporary reveal
  const isCollapsed =
    propIsCollapsed !== undefined ? propIsCollapsed : storeConsoleCollapsed && !temporarilyRevealed;

  // Toggle button in header explicitly changes the persistent global setting
  const handleToggle = useCallback(() => {
    if (propOnToggleCollapse) {
      propOnToggleCollapse();
      setRevealedFor(null);
      return;
    }

    if (!isCollapsed) {
      setRevealedFor(null);
      setConsoleCollapsed(true);
    } else {
      setRevealedFor(null);
      setConsoleCollapsed(false);
    }
  }, [isCollapsed, propOnToggleCollapse, setConsoleCollapsed]);

  const handleClear = () => {
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

      {!isCollapsed && (
        <Suspense
          fallback={
            <div className={styles.fallback} role="status" aria-label="Загрузка консоли">
              <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />
            </div>
          }
        >
          <XtermTerminal
            logs={logs}
            theme={theme}
            fontSize={consoleFontSize}
            filename={filename}
            isRunning={isRunning}
            lastExecution={lastExecution}
          />
        </Suspense>
      )}
    </div>
  );
}
