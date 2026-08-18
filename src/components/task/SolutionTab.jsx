import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, Code2, FileCode, ArrowDown, ChevronDown, Check } from "lucide-react";
import { getTaskById, resolveTaskSection } from "../../data/tasksRegistry";
import CodeEditor from "../common/CodeEditor";
import JsConsole from "../common/JsConsole";
import ReactLivePreview from "../common/ReactLivePreview";
import { Tooltip } from "../common/Tooltip";
import { parseSolutionCodeAndExplanation } from "../../utils/solutionParser";
import { runNodeJsCode, clearRunningTimers } from "../../utils/nodeRunner";
import { getTaskFiles } from "../../utils/taskFiles";

export const SolutionTab = ({
  selectedTask,
  SolutionComponent,
  handleCopyCode,
  copiedCodeId,
  setTaskStatus,
  completedTasks,
}) => {
  const navigate = useNavigate();

  const currentTask = getTaskById(selectedTask?.id) || selectedTask;

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
      search: { tab: "solution" },
    });
  };

  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'code'
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [isHintExpanded, setIsHintExpanded] = useState(false); // По умолчанию подсказка свернута

  // Состояние консоли Node.js
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const consoleWrapperRef = useRef(null);

  const solutionVariants = currentTask.solutions || [
    {
      title: "Основное решение",
      rawSolution:
        currentTask.rawSolution ||
        (typeof currentTask.solution === "string" ? currentTask.solution : ""),
      filepath: currentTask.filepath,
      files: currentTask.files,
    },
  ];

  const currentVariant = solutionVariants[activeVariantIndex] || solutionVariants[0];
  const files = getTaskFiles(currentVariant, "solution");
  const activeFile = files[activeFileIdx] || files[0] || { name: "solution.jsx", code: "" };

  const currentCodeRef = useRef(activeFile.code);

  const hasSolutionComponent =
    !currentTask.isRaw &&
    (currentTask.section === "react" ||
      (Boolean(SolutionComponent) && typeof SolutionComponent !== "string") ||
      (files.length > 0 && files.some((f) => /\.(jsx|tsx)$/.test(f.name || f.filepath || ""))));

  const rawText = currentVariant.rawSolution || "";
  const { explanation } = parseSolutionCodeAndExplanation(rawText);

  // Сброс при смене задачи или варианта
  useEffect(() => {
    setActiveVariantIndex(0);
    setActiveFileIdx(0);
    setIsHintExpanded(false);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [currentTask.id]);

  useEffect(() => {
    setActiveFileIdx(0);
    setIsHintExpanded(false);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [activeVariantIndex]);

  useEffect(() => {
    currentCodeRef.current = activeFile.code;
  }, [activeFileIdx, activeVariantIndex, currentTask.id, activeFile.code]);

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
  }, [hasSolutionComponent, viewMode, activeVariantIndex, activeFileIdx, currentTask.id]);

  const handleRunCode = async (codeToExecute) => {
    if (isRunning) return;
    const codeToRun = codeToExecute !== undefined ? codeToExecute : currentCodeRef.current;
    currentCodeRef.current = codeToRun;

    setIsRunning(true);
    setConsoleLogs([]);

    const result = await runNodeJsCode(codeToRun, {
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

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, []);

  const isJsTask =
    !hasSolutionComponent ||
    currentTask.isRaw ||
    currentTask.section === "javascript" ||
    currentTask.section === "algorithms" ||
    Boolean(currentTask.filepath && currentTask.filepath.includes("javascript"));

  const variantFilepath = activeFile.filepath || activeFile.name || "solution.js";

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Переключатель вариантов решения (если их несколько) */}
      {solutionVariants.length > 1 && (
        <div className="solution-variants-bar">
          {solutionVariants.map((v, idx) => (
            <button
              key={idx}
              className={`solution-variant-btn ${
                activeVariantIndex === idx ? "active" : ""
              }`}
              onClick={() => setActiveVariantIndex(idx)}
            >
              <FileCode size={13} />
              <span>{v.title}</span>
              {v.isRecommended && (
                <Check
                  size={13}
                  style={{ color: "#10b981", strokeWidth: 2.5, flexShrink: 0 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Сворачиваемая пометка о предпочтительности варианта */}
      {currentVariant.recommendationNote && (
        <div
          className={`solution-recommendation-card ${
            currentVariant.isRecommended ? "is-recommended" : ""
          }`}
        >
          <button
            className="solution-recommendation-toggle"
            onClick={() => setIsHintExpanded((prev) => !prev)}
            title={isHintExpanded ? "Свернуть подсказку" : "Развернуть подсказку"}
          >
            <div className="solution-recommendation-header">
              <span>{currentVariant.isRecommended ? "💡" : "📌"}</span>
              <span>
                {currentVariant.badge ||
                  (currentVariant.isRecommended
                    ? "Предпочтительно на собеседовании"
                    : "Особенности подхода")}
                :
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`recommendation-chevron ${
                isHintExpanded ? "rotate-open" : ""
              }`}
            />
          </button>
          {isHintExpanded && (
            <div className="solution-recommendation-text">
              {currentVariant.recommendationNote}
            </div>
          )}
        </div>
      )}

      {hasSolutionComponent && (
        <div className="view-mode-toggle-bar">
          <button
            className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
            title="Просмотр UI решения"
          >
            <Eye size={12} />
            <span>Интерфейс</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => setViewMode("code")}
            title="Просмотр исходного кода"
          >
            <Code2 size={12} />
            <span>Код</span>
          </button>
        </div>
      )}

      {hasSolutionComponent && viewMode === "preview" ? (
        <ReactLivePreview
          task={currentTask}
          files={files}
          activeFileIdx={activeFileIdx}
          currentCode={currentCodeRef.current}
          storagePrefix="sol"
          variantIdx={activeVariantIndex}
          fallbackComponent={SolutionComponent}
          onToggleFullscreen={handleToggleFullscreen}
        />
      ) : (
        /* Чистый и минималистичный редактор решения, расширяющийся по высоте */
        <div className="task-code-section">
          <CodeEditor
            key={`sol_${currentTask.id}_${activeVariantIndex}`}
            initialCode={activeFile.code || "// Код решения подготавливается"}
            taskId={`sol_${currentTask.id}_${activeVariantIndex}_file_${activeFileIdx}`}
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
                    onStop={handleStopCode}
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

export default SolutionTab;

