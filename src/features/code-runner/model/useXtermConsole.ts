import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import { getTerminalTheme } from "./xtermTheme";

export interface UseXtermConsoleProps {
  logs: NodeRunnerLogEntry[];
  theme: "light" | "dark";
  fontSize: number;
  isCollapsed: boolean;
  filename?: string;
  isRunning?: boolean;
  lastExecution?: { durationMs?: number; exitCode?: number } | null;
}

const calculateContentRows = (
  logs: NodeRunnerLogEntry[],
  isRunning: boolean,
  hasExecution: boolean
): number => {
  if (logs.length === 0 && !isRunning && !hasExecution) {
    return 2;
  }
  const totalLines = logs.reduce((sum, log) => {
    let text = log.text || "";
    if (log.args && log.args.length > 0) {
      text = log.args.map((a) => String(a.text || "")).join(" ");
    }
    return sum + (text ? text.split("\n").length : 1);
  }, 0);

  const lineCount = 1 + totalLines + (hasExecution ? 1 : 0);
  return Math.min(Math.max(2, lineCount), 20);
};

const renderLogLine = (term: Terminal, log: NodeRunnerLogEntry) => {
  let prefix = "";
  let color = "";

  if (log.type === "error") {
    prefix = "\x1b[31m[Error] ";
    color = "\x1b[31m";
  } else if (log.type === "warn") {
    prefix = "\x1b[33m[Warn] ";
    color = "\x1b[33m";
  } else if (log.type === "info") {
    prefix = "\x1b[36m[Info] ";
    color = "\x1b[36m";
  } else if (log.type === "time") {
    prefix = "\x1b[35m[Timer] ";
    color = "\x1b[35m";
  }

  let contentStr = log.text || "";
  if (log.args && log.args.length > 0) {
    contentStr = log.args.map((a) => String(a.text || "")).join(" ");
  }

  term.writeln(`${prefix}${color}${contentStr}\x1b[0m`);
};

export function useXtermConsole({
  logs,
  theme,
  fontSize,
  isCollapsed,
  filename = "main.js",
  isRunning = false,
  lastExecution = null,
}: UseXtermConsoleProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermInstance = useRef<Terminal | null>(null);
  const fitAddonInstance = useRef<FitAddon | null>(null);
  const lastRenderedCount = useRef(0);
  const cleanFilename = (filename || "main.js").replace(/^.*[\\/]/, "");

  // Initialize terminal instance
  useEffect(() => {
    if (isCollapsed || !terminalRef.current) return;

    const term = new Terminal({
      theme: getTerminalTheme(theme),
      fontSize,
      fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
      lineHeight: 1.25,
      cursorBlink: false,
      cursorStyle: "bar",
      disableStdin: true,
      convertEol: true,
      scrollback: 2000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    xtermInstance.current = term;
    fitAddonInstance.current = fitAddon;
    lastRenderedCount.current = 0;

    let rafId: number | null = null;
    const handleFit = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try {
          if (terminalRef.current && terminalRef.current.clientWidth > 0) {
            fitAddon.fit();
          }
        } catch {
          // ignore
        }
      });
    };

    handleFit();
    const resizeObserver = new ResizeObserver(handleFit);
    resizeObserver.observe(terminalRef.current);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      term.dispose();
      xtermInstance.current = null;
      fitAddonInstance.current = null;
      lastRenderedCount.current = 0;
    };
  }, [isCollapsed, cleanFilename, theme]);

  // Update theme and fontSize
  useEffect(() => {
    if (xtermInstance.current) {
      xtermInstance.current.options.theme = getTerminalTheme(theme);
      xtermInstance.current.options.fontSize = fontSize;
      try {
        fitAddonInstance.current?.fit();
      } catch {
        // ignore
      }
    }
  }, [theme, fontSize]);

  // Stream logs with dynamic height resize
  useEffect(() => {
    const term = xtermInstance.current;
    if (!term || isCollapsed) return;

    const contentRows = calculateContentRows(logs, isRunning, Boolean(lastExecution));
    try {
      term.resize(term.cols || 80, contentRows);
      if (fitAddonInstance.current) {
        fitAddonInstance.current.fit();
        term.resize(term.cols || 80, contentRows);
      }
    } catch {
      // ignore
    }

    if (logs.length === 0 && !isRunning && !lastExecution) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      term.write(`\x1b[90m// Нажмите «Запустить» (Ctrl+Enter) для выполнения кода...\x1b[0m`);
      lastRenderedCount.current = 0;
      return;
    }

    if (logs.length < lastRenderedCount.current || (logs.length === 0 && isRunning)) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      lastRenderedCount.current = 0;
    }

    if (lastRenderedCount.current === 0 && (logs.length > 0 || lastExecution)) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
    }

    for (let i = lastRenderedCount.current; i < logs.length; i++) {
      if (logs[i]) renderLogLine(term, logs[i]);
    }
    lastRenderedCount.current = logs.length;

    if (lastExecution) {
      if (lastExecution.exitCode === 0) {
        term.write(
          `\x1b[32m✔ Process exited with code 0 (${lastExecution.durationMs || 0}ms)\x1b[0m`
        );
      } else {
        term.write(
          `\x1b[31m✖ Process exited with error code ${lastExecution.exitCode} (${lastExecution.durationMs || 0}ms)\x1b[0m`
        );
      }
    }
  }, [logs, isRunning, lastExecution, cleanFilename, isCollapsed]);

  const clearTerminal = () => {
    if (xtermInstance.current) {
      xtermInstance.current.clear();
      xtermInstance.current.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      xtermInstance.current.write(
        `\x1b[90m// Нажмите «Запустить» (Ctrl+Enter) для выполнения кода...\x1b[0m`
      );
      lastRenderedCount.current = 0;
    }
  };

  return { terminalRef, clearTerminal };
}
