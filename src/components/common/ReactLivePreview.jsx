import React, { useState, useMemo, useEffect, Component } from "react";
import { Lock, RotateCcw, AlertCircle, RefreshCw, Maximize2, Code2 } from "lucide-react";
import { buildFilesMap, compileReactProject, clearLiveSandboxTimers } from "../../utils/reactLiveRunner";

/**
 * Изолированный ErrorBoundary для перехвата рантайм-ошибок внутри песочницы
 */
class SandboxErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("[ReactLivePreview] Runtime error caught in sandbox:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.resetKey !== this.props.resetKey ||
      prevProps.taskKey !== this.props.taskKey
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-card" style={{ margin: "16px 0", width: "100%" }}>
          <div className="error-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertCircle size={16} style={{ color: "#ef4444" }} />
            <span>Ошибка выполнения React компонента</span>
          </div>
          <div className="error-message" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "13px" }}>
            {this.state.error?.message || String(this.state.error)}
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="view-mode-btn active"
              style={{ height: "28px", padding: "0 10px", fontSize: "12px" }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <RotateCcw size={12} />
              <span>Попробовать снова</span>
            </button>
            <span style={{ fontSize: "12px", color: "var(--text-secondary, #94a3b8)" }}>
              Или исправьте логику во вкладке «Код»
            </span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * ReactLivePreview
 * Компонент динамической песочницы для предпросмотра React-задач
 */
export const ReactLivePreview = ({
  task,
  files = [],
  activeFileIdx = 0,
  currentCode = undefined,
  storagePrefix = "cand",
  variantIdx = 0,
  fallbackComponent = null,
  onToggleFullscreen = null,
  containerStyle = {},
}) => {
  const [reloadKey, setReloadKey] = useState(0);

  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx" };

  // Собираем актуальные файлы с учетом кэша и редактора
  const filesMap = useMemo(() => {
    return buildFilesMap(
      files,
      storagePrefix,
      task?.id,
      activeFileIdx,
      currentCode,
      variantIdx
    );
  }, [files, storagePrefix, task?.id, activeFileIdx, currentCode, variantIdx, reloadKey]);

  // Выполняем компиляцию
  const { Component: LiveComponent, error: compileError } = useMemo(() => {
    return compileReactProject(filesMap, activeFile?.name);
  }, [filesMap, activeFile?.name]);

  // Очищаем активные интервалы/таймауты песочницы при перемонтировании или смене задачи
  useEffect(() => {
    return () => {
      clearLiveSandboxTimers();
    };
  }, [task?.id, reloadKey]);

  const handleManualReload = (e) => {
    e?.stopPropagation();
    clearLiveSandboxTimers();
    setReloadKey((k) => k + 1);
  };

  const Fallback = fallbackComponent;
  const isFallbackValid =
    Boolean(Fallback) && typeof Fallback !== "string";

  return (
    <div className="browser-mockup" style={{ ...containerStyle }}>
      <div className="browser-mockup-header">
        <div className="browser-mockup-dots">
          <span className="browser-dot close" />
          <span className="browser-dot minimize" />
          <span
            className="browser-dot maximize"
            onClick={onToggleFullscreen}
            style={onToggleFullscreen ? { cursor: "pointer" } : {}}
            title={onToggleFullscreen ? "Развернуть во весь экран (/open)" : undefined}
          />
        </div>

        <div className="browser-mockup-address" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <Lock
            size={12}
            style={{
              display: "inline-block",
              color: "#10b981",
              flexShrink: 0,
            }}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            localhost:5173/{activeFile.name}
          </span>
          <button
            type="button"
            onClick={handleManualReload}
            className="browser-reload-btn"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              display: "inline-flex",
              alignItems: "center",
              color: "var(--text-secondary, #94a3b8)",
              borderRadius: "4px",
            }}
            title="Перезапустить React компонент"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        <div style={{ width: "52px", display: "flex", justifyContent: "flex-end" }}>
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary, #94a3b8)",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
              title="Развернуть во весь экран"
            >
              <Maximize2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="browser-mockup-body" style={{ flex: 1, overflow: "auto" }}>
        {compileError ? (
          <div className="error-card" style={{ margin: "16px 0", width: "100%" }}>
            <div className="error-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertCircle size={16} style={{ color: "#ef4444" }} />
              <span>Ошибка синтаксиса в коде задачи</span>
            </div>
            <div className="error-message" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "13px" }}>
              {compileError.message || String(compileError)}
            </div>
            <p className="error-hint" style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary, #94a3b8)" }}>
              Переключитесь на вкладку «Код», чтобы исправить синтаксическую ошибку.
            </p>
          </div>
        ) : LiveComponent ? (
          <SandboxErrorBoundary
            taskKey={`${task?.id}_${storagePrefix}_${variantIdx}`}
            resetKey={reloadKey}
          >
            <LiveComponent />
          </SandboxErrorBoundary>
        ) : isFallbackValid ? (
          <SandboxErrorBoundary
            taskKey={`${task?.id}_${storagePrefix}_${variantIdx}`}
            resetKey={reloadKey}
          >
            <Fallback />
          </SandboxErrorBoundary>
        ) : (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary, #94a3b8)", width: "100%" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Напишите код React-компонента во вкладке «Код», чтобы увидеть его интерфейс.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactLivePreview;
