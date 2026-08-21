import React, { useState, useMemo, useEffect } from "react";
import { Lock, RotateCcw, AlertCircle } from "lucide-react";
import { buildFilesMap, buildSandboxIframeSrcDoc, clearLiveSandboxTimers } from "../../utils/reactLiveRunner";
import { useUIStore } from "../../stores/useUIStore";

/**
 * ReactLivePreview
 * Компонент динамической песочницы для предпросмотра React-задач.
 * Выполняется в изолированном iframe с полной изоляцией стилей,
 * глобального контекста window, перехватом ошибок и защитой от падений родительского интерфейса.
 */
export const ReactLivePreview = ({
  task,
  files = [],
  activeFileIdx = 0,
  currentCode = undefined,
  storagePrefix = "cand",
  variantIdx = 0,
  fallbackComponent = null,
  containerStyle = {},
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(260);
  const theme = useUIStore((state) => state.theme) || "dark";

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

  // Генерируем изолированный srcDoc для iframe песочницы
  const { srcDoc, error: compileError } = useMemo(() => {
    return buildSandboxIframeSrcDoc({
      filesMap,
      entryFileName: activeFile?.name,
      theme,
    });
  }, [filesMap, activeFile?.name, theme]);

  // Очищаем активные интервалы/таймауты песочницы при смене задачи
  useEffect(() => {
    return () => {
      clearLiveSandboxTimers();
    };
  }, [task?.id, reloadKey]);

  // Сбрасываем высоту при переключении задачи, вкладки, варианта или файла
  useEffect(() => {
    setIframeHeight(260);
  }, [task?.id, storagePrefix, variantIdx, activeFileIdx]);

  // Слушаем динамическое изменение высоты контента из песочницы
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === "SANDBOX_RESIZE" && typeof e.data.height === "number") {
        const targetH = Math.max(260, Math.ceil(e.data.height));
        setIframeHeight((prev) => (Math.abs(prev - targetH) > 2 ? targetH : prev));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleIframeLoad = (e) => {
    try {
      const doc = e.target.contentDocument || e.target.contentWindow?.document;
      if (doc) {
        const rootEl = doc.getElementById("root");
        if (rootEl) {
          const rootRect = rootEl.getBoundingClientRect?.()?.height || 0;
          const rootScroll = rootEl.scrollHeight || 0;
          const rootOffset = rootEl.offsetHeight || 0;
          const rootHeight = Math.max(rootRect, rootScroll, rootOffset);
          if (rootHeight > 0) {
            setIframeHeight(Math.max(260, Math.ceil(rootHeight + 48)));
          }
        }
      }
    } catch (err) {}
  };

  const handleManualReload = (e) => {
    e?.stopPropagation();
    clearLiveSandboxTimers();
    setReloadKey((k) => k + 1);
  };

  const hasFiles = Object.keys(filesMap).length > 0;

  return (
    <div className="browser-mockup" style={{ ...containerStyle }}>
      <div className="browser-mockup-header">
        <div className="browser-mockup-left">
          <div className="browser-mockup-dots">
            <span className="browser-dot close" />
            <span className="browser-dot minimize" />
            <span className="browser-dot maximize" />
          </div>
        </div>

        <div className="browser-mockup-address">
          <div className="browser-address-content">
            <Lock
              size={11}
              style={{
                color: "#10b981",
                flexShrink: 0,
              }}
            />
            <span className="browser-address-host">preview</span>
            <span className="browser-address-path">/ {activeFile.name}</span>
          </div>

          <button
            type="button"
            onClick={handleManualReload}
            className="browser-reload-btn"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        <div className="browser-mockup-right" />
      </div>

      <div
        className="browser-mockup-body"
        style={{
          padding: 0,
          minHeight: "260px",
          height: "auto",
          overflow: "visible",
          display: "block",
          width: "100%",
        }}
      >
        {compileError ? (
          <div style={{ padding: "24px" }}>
            <div className="error-card" style={{ margin: "0", width: "100%" }}>
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
          </div>
        ) : srcDoc ? (
          <iframe
            key={`${task?.id}_${storagePrefix}_${variantIdx}_${reloadKey}`}
            srcDoc={srcDoc}
            onLoad={handleIframeLoad}
            title={`Preview: ${activeFile.name}`}
            scrolling="no"
            frameBorder="0"
            style={{
              width: "100%",
              height: `${iframeHeight}px`,
              minHeight: "260px",
              border: "none",
              outline: "none",
              display: "block",
              overflow: "hidden",
              background: "transparent",
            }}
          />
        ) : hasFiles ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary, #94a3b8)", width: "100%" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Загрузка песочницы...
            </p>
          </div>
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
