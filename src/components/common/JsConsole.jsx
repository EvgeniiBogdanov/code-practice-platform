import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STORAGE_KEY = "playground_editor_font_size";
const CONSOLE_COLLAPSED_STORAGE_KEY = "playground_console_collapsed";

const getTerminalTheme = (themeName) => {
  const isLight = themeName === "light";
  return isLight
    ? {
        background: "#fbfbfa",
        foreground: "#37352f",
        cursor: "#0066cc",
        selectionBackground: "rgba(0, 102, 204, 0.18)",
        black: "#f7f6f3",
        red: "#d32f2f",
        green: "#2d6a4f",
        yellow: "#c75d18",
        blue: "#0066cc",
        magenta: "#7d449e",
        cyan: "#0066cc",
        white: "#37352f",
      }
    : {
        background: "#141414",
        foreground: "#cccccc",
        cursor: "#38bdf8",
        selectionBackground: "rgba(56, 189, 248, 0.3)",
        black: "#141414",
        red: "#f87171",
        green: "#34d399",
        yellow: "#fbbf24",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#38bdf8",
        white: "#f8fafc",
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

  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to load font size from localStorage", err);
    }
    return 13;
  });

  useEffect(() => {
    const handleFontSizeSync = (e) => {
      const newSize = e.detail || (e.key === FONT_SIZE_STORAGE_KEY && parseInt(e.newValue, 10));
      if (newSize && !isNaN(newSize) && newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
        setFontSize((current) => (current !== newSize ? newSize : current));
      }
    };
    window.addEventListener("editor-font-size-change", handleFontSizeSync);
    window.addEventListener("storage", handleFontSizeSync);
    return () => {
      window.removeEventListener("editor-font-size-change", handleFontSizeSync);
      window.removeEventListener("storage", handleFontSizeSync);
    };
  }, []);

  const handleIncreaseFontSize = () => {
    const next = Math.min(MAX_FONT_SIZE, fontSize + 1);
    if (next === fontSize) return;
    setFontSize(next);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      window.dispatchEvent(new CustomEvent("editor-font-size-change", { detail: next }));
    } catch (err) {
      console.error("Failed to save font size to localStorage", err);
    }
  };

  const handleDecreaseFontSize = () => {
    const next = Math.max(MIN_FONT_SIZE, fontSize - 1);
    if (next === fontSize) return;
    setFontSize(next);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      window.dispatchEvent(new CustomEvent("editor-font-size-change", { detail: next }));
    } catch (err) {
      console.error("Failed to save font size to localStorage", err);
    }
  };

  // Отслеживание светлой/тёмной темы оформления
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute("data-theme") || "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme") || "dark";
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const termContainerRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const lastRenderedLogCountRef = useRef(0);

  const cleanFilename = filename ? filename.split("/").pop() : "main.js";

  // Инициализация xterm.js терминала
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

    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch {
        // ignore
      }
    }, 30);

    return () => {
      try {
        term.dispose();
      } catch {
        // ignore
      }
    };
  }, []);

  // Синхронизация темы xterm при переключении светлой/тёмной темы
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.theme = getTerminalTheme(currentTheme);
    }
  }, [currentTheme]);

  // Синхронизация размера и ресайза при смене fontSize или сворачивании
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.fontSize = fontSize;
      if (fitAddonRef.current && !isCollapsed) {
        setTimeout(() => {
          try {
            fitAddonRef.current.fit();
          } catch {
            // ignore
          }
        }, 50);
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
        ? 3
        : Math.max(3, totalPhysicalLines + (lastExecution ? 2 : 1) + 1);
    const contentRows = Math.min(Math.max(3, lineCount), 18);

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
      term.writeln(`\x1b[90m// Нажмите «Запустить» (Ctrl+Enter) для выполнения кода...\x1b[0m`);
      lastRenderedLogCountRef.current = 0;
      return;
    }

    if (logs.length < lastRenderedLogCountRef.current) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
      lastRenderedLogCountRef.current = 0;
    }

    if (lastRenderedLogCountRef.current === 0 && logs.length > 0) {
      term.clear();
      term.writeln(`\x1b[36m$ node ${cleanFilename}\x1b[0m`);
    }

    for (let i = lastRenderedLogCountRef.current; i < logs.length; i++) {
      const log = logs[i];
      let prefix = "";
      let color = currentTheme === "light" ? "\x1b[30m" : "\x1b[37m";

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

      term.writeln(`${prefix}${color}${contentStr}\x1b[0m \x1b[90m${log.timestamp || ""}\x1b[0m`);
    }

    lastRenderedLogCountRef.current = logs.length;

    if (lastExecution) {
      if (lastExecution.exitCode === 0) {
        term.writeln(`\x1b[32m✔ Process exited with code 0 (${lastExecution.durationMs || 0}ms)\x1b[0m`);
      } else {
        term.writeln(`\x1b[31m✖ Process exited with error code ${lastExecution.exitCode} (${lastExecution.durationMs || 0}ms)\x1b[0m`);
      }
    }
  }, [logs, isRunning, lastExecution, cleanFilename, currentTheme]);

  const handleCopyLogs = () => {
    if (!logs || logs.length === 0) return;
    const textToCopy = logs
      .map((log) => {
        const text = log.text || (log.args ? log.args.map((a) => a.text).join(" ") : "");
        return `[${log.timestamp}] ${text}`;
      })
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
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
      style={{ "--editor-font-size": `${fontSize}px` }}
    >
      {/* Шапка консоли в едином дизайне с редактором кода */}
      <div className="vscode-editor-header">
        <div className="vscode-editor-single-file">
          <TerminalIcon size={13} style={{ color: "var(--color-info, #38bdf8)", flexShrink: 0 }} />
          <span className="file-tab-name">{customTitle || "Терминал"}</span>
          {logs.length > 0 && <span className="console-counter">{logs.length}</span>}
        </div>

        <div className="vscode-editor-actions">
          {isRunning && (
            <span className="js-console-badge badge-running">
              <Loader2 size={12} className="spin-icon" /> Выполнение...
            </span>
          )}

          {onRun && (
            <button
              className="vscode-icon-btn"
              onClick={onRun}
              disabled={isRunning}
              data-tooltip="Запустить код в Node.js (Ctrl + Enter)"
              aria-label="Запустить код"
            >
              <Play size={14} style={{ color: "#10b981" }} fill="currentColor" />
            </button>
          )}

          <button
            className="vscode-icon-btn"
            onClick={handleClearTerminal}
            disabled={logs.length === 0 && !lastExecution}
            data-tooltip="Очистить вывод терминала"
            aria-label="Очистить"
          >
            <Trash2 size={14} />
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            data-tooltip={copied ? "Вывод скопирован!" : "Скопировать вывод терминала"}
            aria-label="Копировать"
          >
            {copied ? (
              <Check size={14} style={{ color: "#10b981" }} />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleDecreaseFontSize}
            disabled={fontSize <= MIN_FONT_SIZE}
            data-tooltip={`Уменьшить шрифт терминала (${fontSize}px)`}
          >
            <ZoomOut size={14} />
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleIncreaseFontSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            data-tooltip={`Увеличить шрифт терминала (${fontSize}px)`}
          >
            <ZoomIn size={14} />
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleToggleCollapse}
            data-tooltip={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"}
            aria-label={isCollapsed ? "Развернуть консоль" : "Свернуть консоль"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Холст интерактивного Web Terminal */}
      <div className="js-console-body vscode-terminal-body">
        <div ref={termContainerRef} className="xterm-view-container" style={{ width: "100%", height: "100%", padding: "4px 8px" }} />
      </div>

      {/* Статус-бар консоли в едином дизайне с редактором кода */}
      <div className="vscode-status-bar">
        <div className="status-left">
          {isRunning ? (
            <span className="status-item status-typo-warning">
              <Loader2 size={11} className="spin-icon" style={{ color: "#38bdf8" }} />
              <span>Выполнение процесса Node.js...</span>
            </span>
          ) : lastExecution ? (
            lastExecution.exitCode === 0 ? (
              <span className="status-item status-typo-ok">
                <CheckCircle2 size={11} style={{ color: "#34d399" }} />
                <span>Завершено (код 0)</span>
              </span>
            ) : (
              <span className="status-item status-typo-warning">
                <AlertCircle size={11} style={{ color: "#f87171" }} />
                <span>Ошибка (код {lastExecution.exitCode})</span>
              </span>
            )
          ) : (
            <span className="status-item status-typo-ok">
              <CheckCircle2 size={11} style={{ color: "#34d399" }} />
              <span>Готов к работе</span>
            </span>
          )}

          <span className="status-sep">|</span>

          {lastExecution?.durationMs !== undefined && (
            <>
              <span className="status-item">
                <Zap size={11} style={{ color: "#f59e0b" }} />
                {lastExecution.durationMs}ms
              </span>
              <span className="status-sep">|</span>
            </>
          )}

          <span className="status-item">
            {logs.length} {logs.length === 1 ? "лог" : logs.length < 5 ? "лога" : "логов"}
          </span>
        </div>

        <div className="status-right">
          <span className="status-item">Node.js v20</span>
          <span className="status-sep">|</span>
          <span className="status-item">UTF-8</span>
          <span className="status-sep">|</span>
          <span className="status-item lang-tag" title="Язык синтаксиса: Terminal">
            <TerminalIcon size={11} style={{ color: "#38bdf8" }} /> Terminal
          </span>
        </div>
      </div>
    </div>
  );
};

export default JsConsole;
