import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useUIStore } from "../../stores/useUIStore";
import { Tooltip } from "./Tooltip";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STORAGE_KEY = "playground_editor_font_size";
const CONSOLE_COLLAPSED_STORAGE_KEY = "playground_console_collapsed";

const getTerminalTheme = (themeName) => {
  const isLight = themeName === "light";
  return isLight
    ? {
        background: "#ffffff",
        foreground: "#37352f",
        cursor: "#0066cc",
        selectionBackground: "rgba(0, 102, 204, 0.18)",
        black: "#37352f",
        red: "#d32f2f",
        green: "#2d6a4f",
        yellow: "#c75d18",
        blue: "#0066cc",
        magenta: "#7d449e",
        cyan: "#0066cc",
        white: "#787774",
        brightBlack: "#787774",
        brightRed: "#ef4444",
        brightGreen: "#10b981",
        brightYellow: "#b8860b",
        brightBlue: "#0284c7",
        brightMagenta: "#7d449e",
        brightCyan: "#0284c7",
        brightWhite: "#37352f",
      }
    : {
        background: "#141414",
        foreground: "#cccccc",
        cursor: "#38bdf8",
        selectionBackground: "rgba(56, 189, 248, 0.3)",
        black: "#1e1e1e",
        red: "#f87171",
        green: "#34d399",
        yellow: "#fbbf24",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#38bdf8",
        white: "#f8fafc",
        brightBlack: "#64748b",
        brightRed: "#fca5a5",
        brightGreen: "#6ee7b7",
        brightYellow: "#fde047",
        brightBlue: "#93c5fd",
        brightMagenta: "#d8b4fe",
        brightCyan: "#67e8f9",
        brightWhite: "#ffffff",
      };
};

export const JsConsole = ({
  logs = [],
  isRunning = false,
  lastExecution = null,
  filename = "main.js",
  onRun,
  onClear,
  customTitle,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}) => {
  const [copied, setCopied] = useState(false);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(CONSOLE_COLLAPSED_STORAGE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
    } catch (err) {
      console.error("Failed to load console collapsed state from localStorage", err);
    }
    return true;
  });

  const isCollapsed =
    controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    if (onToggleCollapse) {
      onToggleCollapse(nextState);
    } else {
      setInternalIsCollapsed(nextState);
    }
    try {
      localStorage.setItem(CONSOLE_COLLAPSED_STORAGE_KEY, String(nextState));
    } catch (err) {
      console.error("Failed to save console collapsed state to localStorage", err);
    }
  };

  useEffect(() => {
    if (isRunning && isCollapsed) {
      if (onToggleCollapse) {
        onToggleCollapse(false);
      } else {
        setInternalIsCollapsed(false);
      }
    }
  }, [isRunning, isCollapsed, onToggleCollapse]);

  const fontSize = useUIStore((state) => state.consoleFontSize ?? 13);
  const handleIncreaseFontSize = useUIStore((state) => state.increaseConsoleFontSize);
  const handleDecreaseFontSize = useUIStore((state) => state.decreaseConsoleFontSize);
  const currentTheme = useUIStore((state) => state.theme);

  const termContainerRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const lastRenderedLogCountRef = useRef(0);

  const cleanFilename = filename ? filename.split("/").pop() : "main.js";

  // Инициализация xterm.js терминала и адаптивного ResizeObserver
  useEffect(() => {
    if (!termContainerRef.current) return;

    const term = new Terminal({
      cursorBlink: false,
      fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
      fontSize: fontSize,
      lineHeight: 1.25,
      theme: getTerminalTheme(currentTheme),
      convertEol: true,
      disableStdin: true,
      scrollback: 2000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termContainerRef.current);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    let rafId = null;
    const handleFit = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try {
          if (termContainerRef.current && termContainerRef.current.clientWidth > 0) {
            fitAddon.fit();
          }
        } catch {
          // ignore
        }
      });
    };

    handleFit();

    const resizeObserver = new ResizeObserver(() => {
      handleFit();
    });

    resizeObserver.observe(termContainerRef.current);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      try {
        term.dispose();
      } catch {
        // ignore
      }
    };
  }, []);

  // Синхронизация темы xterm при переключении светлой/тёмной темы
  const prevThemeRef = useRef(currentTheme);
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.theme = getTerminalTheme(currentTheme);
      if (prevThemeRef.current !== currentTheme) {
        prevThemeRef.current = currentTheme;
        lastRenderedLogCountRef.current = 0;
        xtermRef.current.clear();
      }
    }
  }, [currentTheme]);

  // Синхронизация размера и ресайза при смене fontSize или сворачивании
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.fontSize = fontSize;
      if (fitAddonRef.current && !isCollapsed) {
        requestAnimationFrame(() => {
          try {
            fitAddonRef.current.fit();
          } catch {
            // ignore
          }
        });
      }
    }
  }, [fontSize, isCollapsed]);

  // Отрисовка вывода логов в xterm.js с динамической авто-высотой
  useEffect(() => {
    const term = xtermRef.current;
    if (!term) return;

    // Расчет физических строк текста с учетом многострочных объектов/выводов
    const totalPhysicalLines = logs.reduce((sum, log) => {
      let text = log.text || "";
      if (log.args && log.args.length > 0) {
        text = log.args.map((a) => String(a.text || "")).join(" ");
      }
      return sum + (text ? text.split("\n").length : 1);
    }, 0);

    const lineCount =
      logs.length === 0 && !isRunning && !lastExecution
        ? 2
        : 1 + totalPhysicalLines + (lastExecution ? 1 : 0);
    const contentRows = Math.min(Math.max(1, lineCount), 20);

    try {
      term.resize(term.cols || 80, contentRows);
      if (fitAddonRef.current && !isCollapsed) {
        fitAddonRef.current.fit();
        term.resize(term.cols || 80, contentRows);
      }
    } catch {
      // ignore
    }

    if (logs.length === 0 && !isRunning && !lastExecution) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      term.write(`\x1b[90m// Нажмите «Запустить» (Ctrl+Enter) для выполнения кода...\x1b[0m`);
      lastRenderedLogCountRef.current = 0;
      return;
    }

    if (logs.length < lastRenderedLogCountRef.current || (logs.length === 0 && isRunning)) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      lastRenderedLogCountRef.current = 0;
    }

    if (lastRenderedLogCountRef.current === 0 && (logs.length > 0 || lastExecution)) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
    }

    for (let i = lastRenderedLogCountRef.current; i < logs.length; i++) {
      const log = logs[i];
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
    }

    lastRenderedLogCountRef.current = logs.length;

    if (lastExecution) {
      if (lastExecution.exitCode === 0) {
        term.write(`\x1b[32m✔ Process exited with code 0 (${lastExecution.durationMs || 0}ms)\x1b[0m`);
      } else {
        term.write(`\x1b[31m✖ Process exited with error code ${lastExecution.exitCode} (${lastExecution.durationMs || 0}ms)\x1b[0m`);
      }
    }
  }, [logs, isRunning, lastExecution, cleanFilename, currentTheme]);

  const handleCopyLogs = () => {
    if (!logs || logs.length === 0) return;
    const textToCopy = logs
      .map((log) => {
        const text = log.text || (log.args ? log.args.map((a) => a.text).join(" ") : "");
        const prefix = log.type === "error" ? "[Error] " : log.type === "warn" ? "[Warn] " : "";
        return `${prefix}${text}`;
      })
      .join("\n");

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      lastRenderedLogCountRef.current = 0;
    }
    if (onClear) onClear();
  };

  return (
    <div
      className={`js-console-container vscode-terminal-panel ${isCollapsed ? "console-collapsed" : ""}`}
      style={{
        "--console-font-size": `${fontSize}px`,
        "--editor-font-size": `${fontSize}px`,
      }}
    >
      {/* Шапка консоли в едином дизайне с редактором кода */}
      <div className="vscode-editor-header">
        <div className="vscode-editor-single-file">
          <TerminalIcon size={13} style={{ color: "var(--color-info, #38bdf8)", flexShrink: 0 }} />
          <span className="file-tab-name">{customTitle || "Консоль"}</span>
          {logs.length > 0 && <span className="console-counter">{logs.length}</span>}
        </div>

        <div className="vscode-editor-actions">
          <Tooltip.Provider delayDuration={500} skipDelayDuration={250}>
            {isRunning && (
              <span className="js-console-badge badge-running">
                <Loader2 size={12} className="spin-icon" /> Выполнение...
              </span>
            )}

            {onRun && (
              <Tooltip content="Запустить код (Ctrl+Enter)" side="top">
                <button
                  className="vscode-icon-btn"
                  onClick={onRun}
                  disabled={isRunning}
                  aria-label="Запустить код"
                >
                  <Play size={14} style={{ color: "#10b981" }} fill="currentColor" />
                </button>
              </Tooltip>
            )}

            <Tooltip content="Очистить вывод консоли" side="top">
              <button
                className="vscode-icon-btn"
                onClick={handleClearTerminal}
                disabled={logs.length === 0 && !lastExecution}
                aria-label="Очистить"
              >
                <Trash2 size={14} />
              </button>
            </Tooltip>
            
            <Tooltip
              content={copied ? "Скопировано!" : "Скопировать вывод консоли"}
              side="top"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleCopyLogs}
                disabled={logs.length === 0}
                aria-label="Копировать"
              >
                {copied ? (
                  <Check size={14} style={{ color: "#10b981" }} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </Tooltip>

            <Tooltip
              content={
                fontSize <= MIN_FONT_SIZE
                  ? `Минимальный размер (${MIN_FONT_SIZE}px)`
                  : `Уменьшить шрифт (${fontSize}px)`
              }
              side="top"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleDecreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                aria-label="Уменьшить шрифт"
              >
                <ZoomOut size={14} />
              </button>
            </Tooltip>

            <Tooltip
              content={
                fontSize >= MAX_FONT_SIZE
                  ? `Максимальный размер (${MAX_FONT_SIZE}px)`
                  : `Увеличить шрифт (${fontSize}px)`
              }
              side="top"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleIncreaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                aria-label="Увеличить шрифт"
              >
                <ZoomIn size={14} />
              </button>
            </Tooltip>

            <Tooltip
              content={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"}
              side="top"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleToggleCollapse}
                aria-label={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"}
              >
                {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </Tooltip>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Холст интерактивного Web Terminal */}
      <div className="js-console-body vscode-terminal-body">
        <div ref={termContainerRef} className="xterm-view-container" style={{ width: "100%", height: "100%", padding: 0 }} />
      </div>
    </div>
  );
};

export default JsConsole;
