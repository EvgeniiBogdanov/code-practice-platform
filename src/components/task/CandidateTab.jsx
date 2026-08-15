import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, Code2, ArrowDown } from "lucide-react";
import { getTaskById, resolveTaskSection } from "../../data/tasksRegistry";
import CodeEditor from "../common/CodeEditor";
import JsConsole from "../common/JsConsole";
import ReactLivePreview from "../common/ReactLivePreview";
import { Tooltip } from "../common/Tooltip";
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

  const currentTask = getTaskById(selectedTask?.id) || selectedTask;
  const files = getTaskFiles(currentTask, "candidate");

  const hasCandidateComponent =
    !currentTask.isRaw &&
    (currentTask.section === "react" ||
      (Boolean(CandidateComponent) && typeof CandidateComponent !== "string") ||
      (files.length > 0 && files.some((f) => /\.(jsx|tsx)$/.test(f.name || f.filepath || ""))));

  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'code'
  const [activeFileIdx, setActiveFileIdx] = useState(0);

  // Состояние консоли Node.js
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

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
  }, [activeFileIdx, currentTask.id, activeFile.code]);

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
    currentTask.section === "algorithms" ||
    Boolean(currentTask.filepath && currentTask.filepath.includes("javascript"));

  const handleToggleFullscreen = () => {
    const targetSection = resolveTaskSection(currentTask);

    navigate({
      to:
        targetSection === "algorithms"
          ? "/open/algorithms/$taskId"
          : targetSection === "javascript"
          ? "/open/javascript/$taskId"
          : "/open/react/$taskId",
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
        <ReactLivePreview
          task={currentTask}
          files={files}
          activeFileIdx={activeFileIdx}
          currentCode={currentCodeRef.current}
          storagePrefix="cand"
          fallbackComponent={CandidateComponent}
          onToggleFullscreen={handleToggleFullscreen}
        />
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

          {/* Кнопка быстрой перемотки к консоли */}
          {isJsTask && !isConsoleVisible && (
            <Tooltip content="Перейти к консоли" side="left" sideOffset={10}>
              <button
                className="quick-scroll-console-btn"
                onClick={() => {
                  consoleWrapperRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }}
                aria-label="Перейти к консоли"
              >
                <ArrowDown size={17} />
              </button>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateTab;

