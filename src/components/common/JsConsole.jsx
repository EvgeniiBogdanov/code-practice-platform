import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Play,
  Trash2,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const MIN_FONT_SIZE = 13;
const MAX_FONT_SIZE = 20;
const FONT_SIZE_STORAGE_KEY = "playground_editor_font_size";

export const JsConsole = ({
  logs = [],
  isRunning = false,
  lastExecution = null,
  filename = "main.js",
  onRun,
  onClear,
  customTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const outputEndRef = useRef(null);

  // Синхронизация размера шрифта с редактором кода через localStorage
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
    return MIN_FONT_SIZE;
  });

  const handleIncreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.min(MAX_FONT_SIZE, prev + 1);
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      } catch (err) {
        console.error("Failed to save font size to localStorage", err);
      }
      return next;
    });
  };

  const handleDecreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.max(MIN_FONT_SIZE, prev - 1);
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      } catch (err) {
        console.error("Failed to save font size to localStorage", err);
      }
      return next;
    });
  };

  // Автоскролл к концу при выводе логов
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isRunning, lastExecution]);

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

  const renderLogArg = (arg, argIdx) => {
    if (!arg) return null;
    const text = arg.text !== undefined ? String(arg.text) : "";

    switch (arg.type) {
      case "string":
        return (
          <span key={argIdx} className="console-token token-string">
            {text}
          </span>
        );
      case "number":
        return (
          <span key={argIdx} className="console-token token-number">
            {text}
          </span>
        );
      case "boolean":
        return (
          <span key={argIdx} className="console-token token-boolean">
            {text}
          </span>
        );
      case "null":
        return (
          <span key={argIdx} className="console-token token-null">
            null
          </span>
        );
      case "undefined":
        return (
          <span key={argIdx} className="console-token token-undefined">
            undefined
          </span>
        );
      case "function":
        return (
          <span key={argIdx} className="console-token token-function">
            {text}
          </span>
        );
      case "object":
      case "array":
      case "set":
      case "map":
        return (
          <span key={argIdx} className="console-token token-collection">
            {text}
          </span>
        );
      case "error":
        return (
          <span key={argIdx} className="console-token token-error-val">
            {text}
          </span>
        );
      default:
        return (
          <span key={argIdx} className="console-token token-generic">
            {text}
          </span>
        );
    }
  };

  const renderTable = (tableData) => {
    if (!tableData || !tableData.columns) return null;
    return (
      <div className="console-table-wrapper">
        <table className="console-table">
          <thead>
            <tr>
              {tableData.columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {tableData.columns.map((col, colIdx) => (
                  <td key={colIdx} className={col === "(index)" ? "td-index" : ""}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const cleanFilename = filename ? filename.split("/").pop() : "main.js";

  return (
    <div
      className="js-console-container vscode-terminal-panel"
      style={{ "--editor-font-size": `${fontSize}px` }}
    >
      {/* Шапка консоли в едином дизайне с редактором кода */}
      <div className="vscode-editor-header">
        <div className="vscode-editor-single-file">
          <Terminal size={13} style={{ color: "#38bdf8", flexShrink: 0 }} />
          <span className="file-tab-name">{customTitle || "Консоль"}</span>
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
            onClick={onClear}
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
            data-tooltip={
              fontSize <= MIN_FONT_SIZE
                ? `Минимальный размер шрифта (${MIN_FONT_SIZE}px)`
                : `Уменьшить шрифт (${fontSize}px, Ctrl -)`
            }
          >
            <ZoomOut size={14} />
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleIncreaseFontSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            data-tooltip={
              fontSize >= MAX_FONT_SIZE
                ? `Максимальный размер шрифта (${MAX_FONT_SIZE}px)`
                : `Увеличить шрифт (${fontSize}px, Ctrl +)`
            }
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Холст вывода терминала */}
      <div className="js-console-body vscode-terminal-body">
        {logs.length === 0 && !isRunning && !lastExecution ? (
          <div className="js-console-empty-state">
            <div className="console-command-line">
              <span className="prompt-sign">$</span> node {cleanFilename}
            </div>
            <p className="empty-state-hint">
              Нажмите <strong>«Запустить»</strong> (<kbd>Ctrl+Enter</kbd>) для выполнения кода.
            </p>
          </div>
        ) : (
          <div className="js-console-output">
            <div className="console-command-line">
              <span className="prompt-sign">$</span> node {cleanFilename}
            </div>

            {logs.map((log) => (
              <div key={log.id} className={`console-line line-${log.type}`}>
                {log.type !== "log" && (
                  <span className="line-prefix">
                    {log.type === "error" && <span className="tag-error">[Error]</span>}
                    {log.type === "warn" && <span className="tag-warn">[Warn]</span>}
                    {log.type === "info" && <span className="tag-info">[Info]</span>}
                    {log.type === "time" && <span className="tag-time">[Timer]</span>}
                    {log.type === "count" && <span className="tag-count">[Count]</span>}
                    {log.type === "trace" && <span className="tag-trace">[Trace]</span>}
                  </span>
                )}

                <div className="line-content">
                  {log.tableData ? (
                    renderTable(log.tableData)
                  ) : (
                    <div className="line-args">
                      {log.args && log.args.length > 0 ? (
                        log.args.map((arg, idx) => renderLogArg(arg, idx))
                      ) : (
                        <span className="console-token token-generic">{log.text}</span>
                      )}
                    </div>
                  )}
                </div>

                <span className="line-time">{log.timestamp}</span>
              </div>
            ))}

            {isRunning && (
              <div className="console-line line-running">
                <Loader2 size={12} className="spin-icon" />
                <span>Выполнение процесса Node.js...</span>
              </div>
            )}



            <div ref={outputEndRef} />
          </div>
        )}
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
            <Terminal size={11} style={{ color: "#38bdf8" }} /> Terminal
          </span>
        </div>
      </div>
    </div>
  );
};

export default JsConsole;
