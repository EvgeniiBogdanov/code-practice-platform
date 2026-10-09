import { getTaskSolutionSource } from "@/entities/task";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Home, FileQuestion } from "lucide-react";
import { getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
import type { SectionType } from "@/entities/task/meta";
import { useTaskById } from "@/entities/task/catalog";
import { CodeEditor, activateCodeHistoryTask } from "@/features/code-editor";
import { TypeTestsPanel, useTypeTests, useTypeTestsNavigation } from "@/features/type-tests";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import {
  runNodeJsCode,
  clearRunningTimers,
  NodeRunnerLogEntry,
  TaskSourceFile,
} from "@/shared/lib/code-runners";
import {
  getUserSolution,
  getUserSolutionSync,
  saveUserSolution,
  deleteUserSolution,
  subscribeToSyncEvents,
} from "@/shared/lib/storage";
import { ErrorBoundary, ResizableSplitPane, UiLoader, ViewMode } from "@/shared/ui";
import { useUIStore } from "@/entities/ui-state";
import { TaskVisualization } from "@/widgets/task-visualization";
import { useFullscreenExitTransition } from "../model/useFullscreenExitTransition";
import styles from "./OpenEditorPage.module.css";

const MAX_CONSOLE_LOGS = 500;

export interface OpenEditorPageProps {
  taskId?: string;
  section?: SectionType;
  tab?: "candidate" | "solution" | "visualization";
  initialViewMode?: ViewMode;
}

export const OpenEditorPage = ({
  taskId,
  section = "react",
  tab = "candidate",
  initialViewMode,
}: OpenEditorPageProps) => {
  const navigate = useNavigate();
  const splitRatio = useUIStore((state) => state.editorSplitRatio) || 70;
  const setSplitRatio = useUIStore((state) => state.setEditorSplitRatio);
  const resetSplitRatio = useUIStore((state) => state.resetEditorSplitRatio);
  const { isFullscreenExiting, startFullscreenExit } = useFullscreenExitTransition();

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const { task: loadedTask, isLoading: isTaskLoading } = useTaskById(taskId ?? "", section);
  const task = taskId ? loadedTask : null;
  useEffect(() => {
    activateCodeHistoryTask(taskId ? `${section}:${taskId}` : null);
  }, [section, taskId]);
  const isReact = task ? task.section === "react" : true;

  const defaultCode = isReact
    ? `import React, { useState } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}`
    : `function solution() {\n  console.log("Hello from sandbox!");\n}\nsolution();`;

  const initialFiles: TaskSourceFile[] = useMemo(() => {
    if (task) {
      const baseFiles = getTaskFiles(task, tab === "solution" ? "solution" : "candidate");
      return baseFiles.map((file, idx) => {
        const cached = getUserSolutionSync(task.id, tab === "solution" ? "sol" : "cand", idx);
        if (typeof cached === "string") {
          return { ...file, code: cached };
        }
        return file;
      });
    }
    return [
      {
        name: isReact ? "index.jsx" : section === "typescript" ? "solution.ts" : "solution.js",
        code: defaultCode,
      },
    ];
  }, [task, tab, isReact, defaultCode]);

  const [files, setFiles] = useState<TaskSourceFile[]>(initialFiles);
  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

  const solutionFiles = useMemo(() => {
    if (!task) return [];
    return getTaskFiles(task, "solution");
  }, [task]);

  const candidateFiles = useMemo(() => {
    if (!task) return [];
    return getTaskFiles(task, "candidate");
  }, [task]);

  const hasSolutionReference = useMemo(() => {
    if (!task) return false;
    return solutionFiles.length > 0 && solutionFiles.some((f) => Boolean(f.code?.trim()));
  }, [task, solutionFiles]);

  const [previewTarget, setPreviewTarget] = useState<"candidate" | "solution">(
    tab === "solution" ? "solution" : "candidate"
  );

  const hasVisualComponent = useMemo(
    () => (task ? hasTaskVisualComponent(task, files) : isReact),
    [task, files, isReact]
  );

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (initialViewMode === "preview") return "preview";
    if (initialViewMode === "code" && !hasVisualComponent) return "code";
    if (initialViewMode === "split") return "split";
    return hasVisualComponent ? "split" : "code";
  });
  const editorSessionKey = `${section}:${task?.id ?? "sandbox"}:${tab}:${initialViewMode ?? "default"}`;
  const [currentSessionKey, setCurrentSessionKey] = useState(editorSessionKey);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);

  // A new session starts from the initial state. Adjusting during render discards the stale pass,
  // so the editor never mounts with the previous session's files.
  if (currentSessionKey !== editorSessionKey) {
    setCurrentSessionKey(editorSessionKey);
    setActiveFileIdx(0);
    setFiles(initialFiles);
    setPreviewTarget(tab === "solution" ? "solution" : "candidate");
    const hasVis = task ? hasTaskVisualComponent(task, initialFiles) : isReact;
    setViewMode(
      initialViewMode === "preview"
        ? "preview"
        : initialViewMode === "code" && !hasVis
          ? "code"
          : hasVis
            ? "split"
            : "code"
    );
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
  }

  // Stop timers and workers of the previous session, and on unmount
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, [editorSessionKey]);

  // Load saved solution
  useEffect(() => {
    if (!task || tab === "visualization") return;
    let isMounted = true;
    async function loadSaved() {
      const saved = await getUserSolution(
        task!.id,
        tab === "solution" ? "sol" : "cand",
        activeFileIdx
      );
      if (!isMounted) return;
      if (typeof saved === "string") {
        setFiles((prev) => {
          const next = [...prev];
          if (next[activeFileIdx]) {
            next[activeFileIdx] = { ...next[activeFileIdx], code: saved };
          }
          return next;
        });
      } else {
        const defaults = getTaskFiles(task!, tab === "solution" ? "solution" : "candidate");
        const defaultCode = defaults[activeFileIdx]?.code || "";
        setFiles((prev) => {
          if (prev[activeFileIdx]?.code === defaultCode) return prev;
          const next = [...prev];
          if (next[activeFileIdx]) {
            next[activeFileIdx] = { ...next[activeFileIdx], code: defaultCode };
          }
          return next;
        });
      }
    }
    loadSaved();

    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadSaved();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [task, tab, activeFileIdx]);

  // Listen for solution clearing (e.g. from settings reset)
  useEffect(() => {
    if (!task || tab === "visualization") return;
    const unsubscribe = subscribeToSyncEvents((event) => {
      if (event.type === "SOLUTIONS_CLEARED") {
        const isCurrentTaskCleared =
          event.all || (Array.isArray(event.taskIds) && event.taskIds.includes(String(task.id)));
        if (isCurrentTaskCleared) {
          const baseFiles = getTaskFiles(task, tab === "solution" ? "solution" : "candidate");
          setFiles(baseFiles);
          setConsoleLogs([]);
          setIsRunning(false);
          setLastExecution(null);
          clearRunningTimers();
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [task, tab]);

  // Listen for console logs from sandbox iframe
  useEffect(() => {
    if (tab === "visualization") return;
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "SANDBOX_CONSOLE") {
        const text = String(e.data.text ?? "");
        const logType =
          e.data.level === "error" ? "error" : e.data.level === "warn" ? "warn" : "stdout";
        setConsoleLogs((prev) => [
          ...prev.slice(-(MAX_CONSOLE_LOGS - 1)),
          {
            id: Date.now() + Math.random(),
            type: logType,
            text,
            args: [{ type: "string", text }],
            timestamp: Date.now(),
          },
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tab]);

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) => {
      const next = [...prev];
      if (next[activeFileIdx]) {
        next[activeFileIdx] = { ...next[activeFileIdx], code: newCode };
      }
      return next;
    });
    if (task) {
      saveUserSolution(task.id, tab === "solution" ? "sol" : "cand", activeFileIdx, newCode);
    }
  };

  const handleFilesChange = (renamed: Array<{ name: string; code: string }>): void => {
    setFiles((prev) =>
      prev.map((file, index) => ({ ...file, code: renamed[index]?.code ?? file.code }))
    );
    if (task) {
      renamed.forEach((file, index) => {
        if (file.code !== files[index]?.code) {
          saveUserSolution(task.id, tab === "solution" ? "sol" : "cand", index, file.code);
        }
      });
    }
  };

  const handleResetCode = async () => {
    typeTests.reset();
    const baseFiles = getTaskFiles(task, tab === "solution" ? "solution" : "candidate");
    const originalCode = baseFiles[activeFileIdx]?.code || "";
    setFiles((prev) => {
      const next = [...prev];
      if (next[activeFileIdx]) {
        next[activeFileIdx] = { ...next[activeFileIdx], code: originalCode };
      }
      return next;
    });
    if (task) {
      await deleteUserSolution(task.id, tab === "solution" ? "sol" : "cand", activeFileIdx);
    }
  };

  const handleRunCode = async (codeToExecute?: string) => {
    const code = codeToExecute !== undefined ? codeToExecute : activeFile?.code || "";
    setIsRunning(true);
    const start = performance.now();
    try {
      const result = await runNodeJsCode(code, { filename: activeFile.name });
      const duration = Math.round(performance.now() - start);
      setConsoleLogs((prev) => [...prev, ...result.logs]);
      setLastExecution({ durationMs: duration, exitCode: result.exitCode });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: "stderr",
          text: errMsg,
          args: [{ type: "string", text: errMsg }],
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopCode = () => {
    clearRunningTimers();
    setIsRunning(false);
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "stderr",
        text: "[Остановлено пользователем]",
        args: [{ type: "string", text: "[Остановлено пользователем]" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    setLastExecution(null);
  };

  const hasTypeTests = tab !== "visualization" && Boolean(task?.rawTests);
  const isReferenceTab = tab === "solution";
  const typeTests = useTypeTests({
    enabled: hasTypeTests,
    autoRun: isReferenceTab,
    taskId: String(task?.id ?? ""),
    code: activeFile.code ?? "",
    filepath: activeFile.name ?? "solution.ts",
    tests: task?.rawTests ?? "",
    testsHash: task?.testsHash ?? "",
    updatesChecklist: !isReferenceTab,
    checklistTests: task?.checklistTests,
  });
  const { showCompileProblem } = useTypeTestsNavigation(activeFile.name ?? "");

  const navigateToTask = useCallback((): Promise<void> => {
    if (task) {
      const section = task.section || "javascript";
      return navigate({
        to:
          section === "algorithms"
            ? "/algorithms/$taskId"
            : section === "typescript"
              ? "/typescript/$taskId"
              : section === "react"
                ? "/react/$taskId"
                : "/javascript/$taskId",
        params: { taskId: String(task.id) },
        search: { tab },
        resetScroll: false,
      });
    }

    return navigate({
      to: "/home",
      resetScroll: false,
    });
  }, [navigate, task, tab]);

  const handleExit = useCallback((): void => {
    startFullscreenExit(navigateToTask);
  }, [navigateToTask, startFullscreenExit]);

  // Keyboard shortcut for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExit]);

  if (taskId && isTaskLoading) {
    return (
      <UiLoader
        fullscreen={true}
        size="lg"
        label={tab === "visualization" ? "Загружаем визуализатор" : "Загружаем редактор"}
      />
    );
  }

  if (taskId && !task) {
    return (
      <div className={styles.notFound}>
        <FileQuestion size={40} />
        <h2>Задача #{taskId} не найдена</h2>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => navigate({ to: "/home" })}
        >
          <Home size={14} />
          <span>На главную</span>
        </button>
      </div>
    );
  }

  if (tab === "visualization" && task) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <ErrorBoundary>
            <TaskVisualization
              taskId={String(task.id)}
              solution={getTaskSolutionSource(task)}
              isFullscreen={true}
              isActive={true}
              onToggleFullscreen={handleExit}
            />
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  const previewFiles =
    previewTarget === "solution"
      ? tab === "candidate"
        ? solutionFiles
        : files
      : tab === "solution"
        ? candidateFiles
        : files;

  const previewCurrentCode =
    previewTarget === "solution"
      ? tab === "candidate"
        ? solutionFiles[activeFileIdx]?.code || solutionFiles[0]?.code
        : activeFile.code
      : tab === "solution"
        ? candidateFiles[activeFileIdx]?.code || candidateFiles[0]?.code
        : activeFile.code;

  const previewActiveFileIdx = Math.min(activeFileIdx, Math.max(0, (previewFiles.length || 1) - 1));

  const previewStoragePrefix = previewTarget === "solution" ? "sol" : "cand";

  const consoleNode = (
    <JsConsole
      logs={consoleLogs}
      isRunning={isRunning}
      lastExecution={lastExecution}
      filename={activeFile.name}
      onRun={() => handleRunCode()}
      onStop={handleStopCode}
      onClear={handleClearConsole}
    />
  );
  const bottomConsole =
    hasTypeTests && task?.rawTests ? (
      <TypeTestsPanel
        taskId={String(task.id)}
        controller={typeTests}
        mode={isReferenceTab ? "reference" : "practice"}
        tests={task.rawTests}
        testsHash={task.testsHash ?? ""}
        onBackToTask={handleExit}
        onShowCompileProblem={showCompileProblem}
      />
    ) : (
      consoleNode
    );

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <ErrorBoundary>
          {hasVisualComponent && viewMode === "split" ? (
            <ResizableSplitPane
              splitRatio={splitRatio}
              onSplitRatioChange={setSplitRatio}
              onReset={resetSplitRatio}
              className={styles.splitContainer}
              left={
                <CodeEditor
                  key={`open_${section}_${task?.id}_${tab}_${activeFileIdx}`}
                  code={activeFile?.code || ""}
                  onChange={handleCodeChange}
                  onFilesChange={handleFilesChange}
                  onRun={() => handleRunCode()}
                  onReset={handleResetCode}
                  files={files}
                  activeFileIdx={activeFileIdx}
                  onFileSelect={setActiveFileIdx}
                  filepath={activeFile?.name || ""}
                  historyScope={
                    task
                      ? {
                          taskKey: `${task.section}:${task.id}`,
                          documentKey: `${tab === "solution" ? "solution:0" : "candidate"}:${activeFileIdx}`,
                        }
                      : undefined
                  }
                  fillHeight={true}
                  isFullscreen={true}
                  onToggleFullscreen={handleExit}
                  isFullscreenTransitioning={isFullscreenExiting}
                  bottomConsole={consoleNode}
                />
              }
              right={
                <ReactLivePreview
                  task={task || undefined}
                  files={previewFiles}
                  activeFileIdx={previewActiveFileIdx}
                  currentCode={previewCurrentCode}
                  storagePrefix={previewStoragePrefix}
                  fullHeight={true}
                  previewTarget={previewTarget}
                  onPreviewTargetChange={setPreviewTarget}
                  hasSolutionReference={hasSolutionReference}
                />
              }
            />
          ) : hasVisualComponent && viewMode === "preview" ? (
            <ReactLivePreview
              task={task || undefined}
              files={previewFiles}
              activeFileIdx={previewActiveFileIdx}
              currentCode={previewCurrentCode}
              storagePrefix={previewStoragePrefix}
              fullHeight={true}
              previewTarget={previewTarget}
              onPreviewTargetChange={setPreviewTarget}
              hasSolutionReference={hasSolutionReference}
            />
          ) : (
            <>
              <CodeEditor
                key={`open_${section}_${task?.id}_${tab}_${activeFileIdx}`}
                code={activeFile?.code || ""}
                onChange={handleCodeChange}
                onFilesChange={handleFilesChange}
                onRun={() => (hasTypeTests ? typeTests.run() : handleRunCode())}
                onReset={handleResetCode}
                files={files}
                activeFileIdx={activeFileIdx}
                onFileSelect={setActiveFileIdx}
                filepath={activeFile?.name || ""}
                historyScope={
                  task
                    ? {
                        taskKey: `${task.section}:${task.id}`,
                        documentKey: `${tab === "solution" ? "solution:0" : "candidate"}:${activeFileIdx}`,
                      }
                    : undefined
                }
                fillHeight={true}
                isFullscreen={true}
                onToggleFullscreen={handleExit}
                isFullscreenTransitioning={isFullscreenExiting}
                bottomConsole={bottomConsole}
              />
            </>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};
