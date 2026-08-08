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
} from "lucide-react";

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
    <div className="js-console-container vscode-terminal-panel">
      {/* Шапка терминала в стиле VS Code */}
      <div className="js-console-header vscode-terminal-header">
        <div className="js-console-header-left">
          <Terminal size={14} style={{ color: "#38bdf8" }} />
          <span className="vscode-terminal-title">КОНСОЛЬ</span>
          {logs.length > 0 && <span className="console-counter">{logs.length}</span>}
        </div>

        <div className="js-console-header-right">
          {/* Индикатор статуса выполнения */}
          {isRunning && (
            <span className="js-console-badge badge-running">
              <Loader2 size={13} className="spin-icon" /> Выполнение...
            </span>
          )}

          {/* Действия: компактные кнопки VS Code с подсказками */}
          <div className="js-console-actions">
            {onRun && (
              <button
                className="js-console-btn-icon btn-run-mini"
                onClick={onRun}
                disabled={isRunning}
                title="Запустить код в Node.js (Ctrl + Enter)"
                data-tooltip="Запустить код в Node.js (Ctrl + Enter)"
                aria-label="Запустить код"
              >
                <Play size={13} fill="currentColor" />
              </button>
            )}

            <button
              className="js-console-btn-icon btn-clear-mini"
              onClick={onClear}
              disabled={logs.length === 0 && !lastExecution}
              title="Очистить вывод терминала"
              data-tooltip="Очистить вывод терминала"
              aria-label="Очистить"
            >
              <Trash2 size={13} />
            </button>

            <button
              className="js-console-btn-icon btn-copy-mini"
              onClick={handleCopyLogs}
              disabled={logs.length === 0}
              title={copied ? "Вывод скопирован!" : "Скопировать вывод терминала"}
              data-tooltip={copied ? "Вывод скопирован!" : "Скопировать вывод терминала"}
              aria-label="Копировать"
            >
              {copied ? (
                <Check size={13} style={{ color: "#10b981" }} />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Холст вывода терминала */}
      <div className="js-console-body vscode-terminal-body">
        {logs.length === 0 && !isRunning && !lastExecution ? (
          <div className="js-console-empty-state">
            <div className="empty-state-prompt">
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

            {/* Отдельный отчерченный раздел информации выполнения в самом окне консоли */}
            {lastExecution && !isRunning && (
              <div className="console-info-section">
                <div className="console-info-divider" />
                <div className="console-info-bar">
                  <div className="console-info-item item-time">
                    <Zap size={12} style={{ color: "#f59e0b" }} />
                    <span>
                      Время выполнения:{" "}
                      <strong>
                        {lastExecution.durationMs !== undefined
                          ? `${lastExecution.durationMs}ms`
                          : "0ms"}
                      </strong>
                    </span>
                  </div>

                  <div className="console-info-item item-status">
                    {lastExecution.exitCode === 0 ? (
                      <span className="console-status-pill status-success">
                        <CheckCircle2 size={12} /> Завершено (код 0)
                      </span>
                    ) : (
                      <span className="console-status-pill status-error">
                        <AlertCircle size={12} /> Ошибка (код {lastExecution.exitCode})
                      </span>
                    )}
                  </div>

                  <div className="console-info-item item-count">
                    <span>Записей логов: {logs.length}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={outputEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JsConsole;
