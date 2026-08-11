import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Minimize2,
  Share2,
  Check,
  Eye,
  Code2,
  FileQuestion,
  Home,
  Lock,
} from "lucide-react";
import CodeEditor from "../common/CodeEditor";
import JsConsole from "../common/JsConsole";
import ErrorBoundary from "../common/ErrorBoundary";
import { runNodeJsCode, clearRunningTimers } from "../../utils/nodeRunner";
import { getTaskFiles } from "../../utils/taskFiles";

export const OpenEditorView = ({ task, section = "javascript" }) => {
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className="open-not-found-container">
        <div className="coming-soon-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
          <FileQuestion size={36} />
        </div>
        <h2 className="coming-soon-title" style={{ fontSize: "22px", marginBottom: "8px" }}>
          Задача не найдена
        </h2>
        <p className="coming-soon-desc" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
          Запрашиваемая задача не найдена в каталоге или ссылка некорректна.
        </p>
        <button
          onClick={() => navigate({ to: "/home" })}
          className="home-section-btn"
          style={{ cursor: "pointer" }}
        >
          <Home size={16} /> На Главную
        </button>
      </div>
    );
  }

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [viewMode, setViewMode] = useState("code"); // 'code' | 'preview'
  const [linkCopied, setLinkCopied] = useState(false);

  // Состояние консоли Node.js
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);

  const CandidateComponent = task.candidate;
  const hasCandidateComponent =
    Boolean(CandidateComponent) &&
    typeof CandidateComponent !== "string" &&
    !task.isRaw;

  const files = getTaskFiles(task, "candidate");
  const activeFile = files[activeFileIdx] || files[0] || { name: "main.js", code: "" };

  const currentCodeRef = useRef(activeFile.code);
  const consoleWrapperRef = useRef(null);

  const isJsTask =
    !hasCandidateComponent ||
    task.isRaw ||
    section === "javascript" ||
    task.section === "javascript" ||
    String(task.id).startsWith("js") ||
    Boolean(task.filepath && task.filepath.includes("javascript"));

  // Сброс при смене задачи
  useEffect(() => {
    setActiveFileIdx(0);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [task.id]);

  useEffect(() => {
    currentCodeRef.current = activeFile.code;
  }, [activeFileIdx, task.id, activeFile.code]);

  // Выход из развернутого режима
  const handleExit = () => {
    const targetSection =
      section === "algorithms" || task.section === "algorithms" || String(task.id).startsWith("algo")
        ? "algorithms"
        : section === "javascript" || task.section === "javascript" || String(task.id).startsWith("js")
        ? "javascript"
        : "react";

    navigate({
      to:
        targetSection === "algorithms"
          ? "/algorithms/$taskId"
          : targetSection === "javascript"
          ? "/javascript/$taskId"
          : "/react/$taskId",
      params: { taskId: String(task.id) },
    });
  };

  // Горячая клавиша Escape для выхода
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "F11") {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [task.id, section]);

  // Скопировать прямую ссылку на открытый редактор
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleRunCode = async (codeToExecute) => {
    if (isRunning) return;
    const code = codeToExecute !== undefined ? codeToExecute : currentCodeRef.current;
    currentCodeRef.current = code;

    setIsRunning(true);
    setConsoleLogs([]);

    const result = await runNodeJsCode(code, {
      onLog: (newLog, allLogs) => {
        setConsoleLogs(allLogs);
      },
    });

    setConsoleLogs(result.logs);
    setLastExecution({
      durationMs: result.durationMs,
      exitCode: result.exitCode,
      error: result.error,
    });
    setIsRunning(false);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    setLastExecution(null);
    clearRunningTimers();
  };

  return (
    <div className="open-editor-container">
      {/* Шапка полноэкранного режима /open с кнопками "Поделиться" и "Свернуть" */}
      <div className="open-editor-top-bar">
        {hasCandidateComponent ? (
          <div className="view-mode-toggle-bar" style={{ margin: 0 }}>
            <button
              className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
              onClick={() => setViewMode("code")}
              title="Просмотр исходного кода задачи"
            >
              <Code2 size={12} />
              <span>Код</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
              onClick={() => setViewMode("preview")}
              title="Просмотр UI песочницы"
            >
              <Eye size={12} />
              <span>Интерфейс</span>
            </button>
          </div>
        ) : (
          <div className="open-editor-title-badge">
            <Code2 size={14} style={{ color: "var(--notion-blue, #3b82f6)" }} />
            <span className="open-editor-title-text">{task.title || "Редактор задачи"}</span>
          </div>
        )}

        <div className="open-editor-top-actions">
          <button
            className="open-share-btn"
            onClick={handleCopyLink}
            title="Скопировать ссылку для шеринга задачи (/open)"
          >
            {linkCopied ? <Check size={13} style={{ color: "#10b981" }} /> : <Share2 size={13} />}
            <span>{linkCopied ? "Ссылка скопирована" : "Поделиться"}</span>
          </button>
          <button
            className="open-exit-btn"
            onClick={handleExit}
            title="Выйти из полноэкранного режима (Esc)"
          >
            <Minimize2 size={14} />
            <span>Свернуть</span>
          </button>
        </div>
      </div>

      {hasCandidateComponent && viewMode === "preview" ? (
        <div className="open-preview-wrapper">
          <div className="browser-mockup" style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", margin: 0 }}>
            <div className="browser-mockup-header">
              <div className="browser-mockup-dots">
                <span className="browser-dot close" />
                <span className="browser-dot minimize" />
                <span className="browser-dot maximize" />
              </div>
              <div className="browser-mockup-address">
                <Lock
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline-block",
                    verticalAlign: "middle",
                    color: "#10b981",
                  }}
                />{" "}
                localhost:5173/{activeFile.name}
              </div>
              <div style={{ width: "52px" }} />
            </div>
            <div className="browser-mockup-body" style={{ flex: 1, overflow: "auto" }}>
              <ErrorBoundary taskKey={`open_${task.id}`}>
                {CandidateComponent ? (
                  <CandidateComponent />
                ) : (
                  <p className="no-component">Компонент не найден</p>
                )}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      ) : (
        <div className="open-code-wrapper">
          <CodeEditor
            key={`open_${task.id}`}
            initialCode={activeFile.code}
            taskId={`cand_${task.id}_file_${activeFileIdx}`}
            filepath={activeFile.filepath || activeFile.name}
            title={activeFile.name}
            files={files}
            activeFileIdx={activeFileIdx}
            onFileSelect={setActiveFileIdx}
            onRun={handleRunCode}
            onChange={(val) => {
              currentCodeRef.current = val;
            }}
            readOnly={false}
            isFullscreen={true}
            onToggleFullscreen={handleExit}
            extraHeaderActions={
              <button
                className="vscode-icon-btn"
                onClick={handleCopyLink}
                data-tooltip={linkCopied ? "Ссылка скопирована в буфер обмена" : "Скопировать ссылку задачи (open)"}
              >
                {linkCopied ? <Check size={14} style={{ color: "#10b981" }} /> : <Share2 size={14} />}
              </button>
            }
            bottomConsole={
              isJsTask ? (
                <div ref={consoleWrapperRef} className="task-console-wrapper">
                  <JsConsole
                    logs={consoleLogs}
                    isRunning={isRunning}
                    lastExecution={lastExecution}
                    filename={activeFile.filepath || activeFile.name}
                    onRun={() => handleRunCode()}
                    onClear={handleClearConsole}
                  />
                </div>
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
};

export default OpenEditorView;
