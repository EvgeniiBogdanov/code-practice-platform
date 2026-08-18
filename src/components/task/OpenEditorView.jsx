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
} from "lucide-react";
import CodeEditor from "../common/CodeEditor";
import JsConsole from "../common/JsConsole";
import ReactLivePreview from "../common/ReactLivePreview";
import { Tooltip } from "../common/Tooltip";
import { runNodeJsCode, clearRunningTimers } from "../../utils/nodeRunner";
import { getTaskFiles } from "../../utils/taskFiles";
import { getTaskById, resolveTaskSection } from "../../data/tasksRegistry";
import { parseSolutionCodeAndExplanation } from "../../utils/solutionParser";

export const OpenEditorView = ({ task, section, tab = "candidate" }) => {
  const navigate = useNavigate();

  const currentTask = getTaskById(task?.id) || task;
  const currentSection = section || resolveTaskSection(currentTask);

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [viewMode, setViewMode] = useState("code"); // 'code' | 'preview'
  const [linkCopied, setLinkCopied] = useState(false);

  // Состояние консоли Node.js
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);

  const isSolutionMode = tab === "solution";
  const CandidateComponent = isSolutionMode ? currentTask?.solution : currentTask?.candidate;

  const files = currentTask
    ? isSolutionMode
      ? getTaskFiles(currentTask, "solution")
      : getTaskFiles(currentTask, "candidate")
    : [];
  const activeFile = files[activeFileIdx] || files[0] || { name: "main.js", code: "" };

  const hasVisualComponent =
    !currentTask?.isRaw &&
    (currentSection === "react" ||
      (Boolean(CandidateComponent) && typeof CandidateComponent !== "string") ||
      (files.length > 0 && files.some((f) => /\.(jsx|tsx)$/.test(f.name || f.filepath || ""))));

  const currentCodeRef = useRef(activeFile.code);
  const consoleWrapperRef = useRef(null);

  const isJsTask =
    !hasVisualComponent ||
    currentTask?.isRaw ||
    currentSection === "javascript" ||
    currentSection === "algorithms" ||
    Boolean(currentTask?.filepath && currentTask.filepath.includes("javascript"));

  // Сброс при смене задачи
  useEffect(() => {
    if (!currentTask) return;
    setActiveFileIdx(0);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [currentTask?.id]);

  useEffect(() => {
    currentCodeRef.current = activeFile.code;
  }, [activeFileIdx, currentTask?.id, activeFile.code]);

  // Выход из развернутого режима
  const handleExit = () => {
    if (!currentTask) return;
    const targetSection = resolveTaskSection(currentTask);

    navigate({
      to:
        targetSection === "algorithms"
          ? "/algorithms/$taskId"
          : targetSection === "javascript"
          ? "/javascript/$taskId"
          : "/react/$taskId",
      params: { taskId: String(currentTask.id) },
      search: isSolutionMode ? { tab: "solution" } : undefined,
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
  }, [currentTask?.id, currentSection]);

  if (!currentTask) {
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

  const handleStopCode = () => {
    clearRunningTimers();
    setIsRunning(false);
    setLastExecution({
      durationMs: 0,
      exitCode: 130,
      error: { message: "Выполнение остановлено пользователем" },
    });
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    setLastExecution(null);
    clearRunningTimers();
    setIsRunning(false);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, []);

  return (
    <div className="open-editor-container">
      {/* Шапка полноэкранного режима /open с кнопками "Поделиться" и "Свернуть" */}
      <div className="open-editor-top-bar">
        {hasVisualComponent ? (
          <div className="view-mode-toggle-bar" style={{ margin: 0 }}>
            <Tooltip content="Просмотр исходного кода задачи" side="bottom">
              <button
                className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
                onClick={() => setViewMode("code")}
                aria-label="Просмотр исходного кода"
              >
                <Code2 size={12} />
                <span>Код</span>
              </button>
            </Tooltip>
            <Tooltip content="Просмотр UI песочницы" side="bottom">
              <button
                className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
                onClick={() => setViewMode("preview")}
                aria-label="Просмотр UI песочницы"
              >
                <Eye size={12} />
                <span>Интерфейс</span>
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="open-editor-title-badge">
            <Code2 size={14} style={{ color: "var(--accent-blue, #3b82f6)" }} />
            <span className="open-editor-title-text">{task.title || "Редактор задачи"}</span>
          </div>
        )}

        <div className="open-editor-top-actions">
          <Tooltip content={linkCopied ? "Ссылка скопирована!" : "Скопировать ссылку для шеринга задачи (/open)"} side="bottom">
            <button
              className="open-share-btn"
              onClick={handleCopyLink}
              aria-label="Поделиться"
            >
              {linkCopied ? <Check size={13} style={{ color: "#10b981" }} /> : <Share2 size={13} />}
              <span>{linkCopied ? "Ссылка скопирована" : "Поделиться"}</span>
            </button>
          </Tooltip>
          <Tooltip content="Выйти из полноэкранного режима (Esc)" side="bottom">
            <button
              className="open-exit-btn"
              onClick={handleExit}
              aria-label="Свернуть"
            >
              <Minimize2 size={14} />
              <span>Свернуть</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {hasVisualComponent && viewMode === "preview" ? (
        <div className="open-preview-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 58px)", padding: "16px" }}>
          <ReactLivePreview
            task={currentTask}
            files={files}
            activeFileIdx={activeFileIdx}
            currentCode={currentCodeRef.current}
            storagePrefix={isSolutionMode ? "sol" : "cand"}
            variantIdx={0}
            fallbackComponent={CandidateComponent}
            containerStyle={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", margin: 0 }}
          />
        </div>
      ) : (
        <div className="open-code-wrapper">
          <CodeEditor
            key={`open_${task.id}_${tab}`}
            initialCode={activeFile.code}
            taskId={
              isSolutionMode
                ? `sol_${task.id}_0_file_${activeFileIdx}`
                : `cand_${task.id}_file_${activeFileIdx}`
            }
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
              <Tooltip content={linkCopied ? "Ссылка скопирована!" : "Скопировать ссылку задачи"} side="bottom">
                <button
                  className="vscode-icon-btn"
                  onClick={handleCopyLink}
                  aria-label="Скопировать ссылку"
                >
                  {linkCopied ? <Check size={14} style={{ color: "#10b981" }} /> : <Share2 size={14} />}
                </button>
              </Tooltip>
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
                    onStop={handleStopCode}
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
