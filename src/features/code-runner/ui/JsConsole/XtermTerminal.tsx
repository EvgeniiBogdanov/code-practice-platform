import React from "react";
import "@xterm/xterm/css/xterm.css";
import { NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import { useXtermConsole } from "../../model/useXtermConsole";
import styles from "./JsConsole.module.css";

export interface XtermTerminalProps {
  logs: NodeRunnerLogEntry[];
  theme: "light" | "dark";
  fontSize: number;
  filename: string;
  isRunning: boolean;
  lastExecution: { durationMs?: number; exitCode?: number } | null;
}

export const XtermTerminal = ({
  logs,
  theme,
  fontSize,
  filename,
  isRunning,
  lastExecution,
}: XtermTerminalProps): React.JSX.Element => {
  const { terminalRef } = useXtermConsole({
    logs,
    theme,
    fontSize,
    isCollapsed: false,
    filename,
    isRunning,
    lastExecution,
  });

  return <div ref={terminalRef} className={styles.terminalBody} />;
};
