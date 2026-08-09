import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Eye, Code2, Terminal, ArrowDown, FileCode } from "lucide-react";
import { ALL_TASKS } from "../../react/data/tasksData";
import ErrorBoundary from "../common/ErrorBoundary";
import CodeEditor from "../common/CodeEditor";
import JsConsole from "../common/JsConsole";
import { runNodeJsCode, clearRunningTimers } from "../../utils/nodeRunner";
import { getTaskFiles } from "../../utils/taskFiles";

export const CandidateTab = ({
  selectedTask,
  CandidateComponent,
  handleCopyCode,
  copiedCodeId,
  setTaskStatus,
  completedTasks,
}) => {
  const navigate = useNavigate();

  const currentTask =
    ALL_TASKS.find((t) => String(t.id) === String(selectedTask.id)) ||
    selectedTask;

  const hasCandidateComponent =
    Boolean(CandidateComponent) &&
    typeof CandidateComponent !== "string" &&
    !currentTask.isRaw;

  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'code'
  const [activeFileIdx, setActiveFileIdx] = useState(0);

  // Состояние консоли Node.js
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const files = getTaskFiles(currentTask, "candidate");
  const activeFile = files[activeFileIdx] || files[0];

  const currentCodeRef = useRef(activeFile.code);
  const consoleWrapperRef = useRef(null);

  // Сброс при смене задачи
  useEffect(() => {
    setActiveFileIdx(0);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [currentTask.id]);

  useEffect(() => {
    currentCodeRef.current = activeFile.code;
  }, [activeFileIdx, currentTask.id]);

  // IntersectionObserver для отслеживания видимости консоли Node.js
  useEffect(() => {
    const el = consoleWrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsConsoleVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCandidateComponent, viewMode, activeFileIdx, currentTask.id]);

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

  const isJsTask =
    !hasCandidateComponent ||
    currentTask.isRaw ||
    currentTask.section === "javascript" ||
    String(currentTask.id).startsWith("js") ||
    Boolean(currentTask.filepath && currentTask.filepath.includes("javascript"));

  const handleToggleFullscreen = () => {
    const section =
      currentTask.section === "javascript" || String(currentTask.id).startsWith("js")
        ? "javascript"
        : "react";

    navigate({
      to: section === "javascript" ? "/open/javascript/$taskId" : "/open/react/$taskId",
      params: { taskId: String(currentTask.id) },
    });
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Для React-задач с визуальным компонентом */}
      {hasCandidateComponent && (
        <div className="view-mode-toggle-bar">
          <button
            className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
            title="Просмотр UI песочницы"
          >
            <Eye size={12} />
            <span>Интерфейс</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => setViewMode("code")}
            title="Просмотр исходного кода кандидата"
          >
            <Code2 size={12} />
            <span>Код</span>
          </button>
        </div>
      )}

      {hasCandidateComponent && viewMode === "preview" ? (
        <div className="browser-mockup">
          <div className="browser-mockup-header">
            <div className="browser-mockup-dots">
              <span className="browser-dot close" />
              <span className="browser-dot minimize" />
              <span
                className="browser-dot maximize"
                onClick={handleToggleFullscreen}
                style={{ cursor: "pointer" }}
                title="Развернуть во весь экран (/open)"
              />
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
          <div className="browser-mockup-body">
            <ErrorBoundary taskKey={currentTask.id}>
              {CandidateComponent ? (
                <CandidateComponent />
              ) : (
                <p className="no-component">Компонент не найден</p>
              )}
            </ErrorBoundary>
          </div>
        </div>
      ) : (
        /* Минималистичный и чистый редактор кода, расширяющийся по высоте */
        <div className="task-code-section">
          <CodeEditor
            key={`cand_${currentTask.id}`}
            initialCode={activeFile.code}
            taskId={`cand_${currentTask.id}_file_${activeFileIdx}`}
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
            onToggleFullscreen={handleToggleFullscreen}
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

          {/* Кнопка быстрой перемотки к консоли по IntersectionObserver */}
          {isJsTask && !isConsoleVisible && (
            <button
              className="quick-scroll-console-btn"
              onClick={() => {
                consoleWrapperRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
              title="Перейти к консоли"
            >
              <ArrowDown size={13} />
              <span>Консоль</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateTab;
