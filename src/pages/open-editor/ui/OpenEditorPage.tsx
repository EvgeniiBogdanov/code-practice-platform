import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Home, FileQuestion, ArrowDown } from "lucide-react";
import { getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
import type { SectionType } from "@/entities/task/meta";
import { useTaskById } from "@/entities/task/catalog";
import { CodeEditor } from "@/features/code-editor";
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
} from "@/shared/lib/storage";
import { Tooltip, ErrorBoundary, ResizableSplitPane, UiLoader, ViewMode } from "@/shared/ui";
import { useUIStore } from "@/entities/ui-state";
import { useFullscreenExitTransition } from "../model/use-fullscreen-exit-transition";
import styles from "./OpenEditorPage.module.css";

export interface OpenEditorPageProps {
  taskId?: string;
  section?: SectionType;
  tab?: "candidate" | "solution";
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
    return [{ name: isReact ? "index.jsx" : "solution.js", code: defaultCode }];
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

  const [previewTarget, setPreviewTarget] = useState<"candidate" | "solution">(tab);

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
  const editorSessionKey = `${task?.id ?? "sandbox"}:${tab}:${initialViewMode ?? "default"}`;
  const previousEditorSessionKeyRef = useRef(editorSessionKey);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const consoleWrapperRef = useRef<HTMLDivElement>(null);

  // Keep the initial state intact to prevent a post-paint layout update on fullscreen entry.
  useEffect(() => {
    if (previousEditorSessionKeyRef.current === editorSessionKey) return;

    previousEditorSessionKeyRef.current = editorSessionKey;
    setActiveFileIdx(0);
    setIsConsoleVisible(true);
    setFiles(initialFiles);
    setPreviewTarget(tab);
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
    clearRunningTimers();
  }, [editorSessionKey, initialFiles, task, tab, initialViewMode, isReact]);

  // Load saved solution
  useEffect(() => {
    if (!task) return;
    let isMounted = true;
    async function loadSaved() {
      const saved = await getUserSolution(
        task!.id,
        tab === "solution" ? "sol" : "cand",
        activeFileIdx
      );
      if (isMounted && typeof saved === "string") {
        setFiles((prev) => {
          const next = [...prev];
          if (next[activeFileIdx]) {
            next[activeFileIdx] = { ...next[activeFileIdx], code: saved };
          }
          return next;
        });
      }
    }
    loadSaved();
    return () => {
      isMounted = false;
    };
  }, [task, tab, activeFileIdx]);

  // Listen for console logs from sandbox iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "SANDBOX_CONSOLE") {
        const text = String(e.data.text ?? "");
        const logType =
          e.data.level === "error" ? "error" : e.data.level === "warn" ? "warn" : "stdout";
        setConsoleLogs((prev) => [
          ...prev,
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
  }, []);

  // Track console visibility
  useEffect(() => {
    const el = consoleWrapperRef.current;
    if (!el || isReact || viewMode === "preview") {
      setIsConsoleVisible(true);
      return;
    }

    let isMounted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isMounted && entry && entry.target && entry.target.isConnected) {
          setIsConsoleVisible(entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [isReact, viewMode, activeFileIdx, task]);

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

  const handleResetCode = async () => {
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
      const result = await runNodeJsCode(code);
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

  const navigateToTask = useCallback((): Promise<void> => {
    if (task) {
      const section = task.section || "javascript";
      return navigate({
        to:
          section === "algorithms"
            ? "/algorithms/$taskId"
            : section === "react"
              ? "/react/$taskId"
              : "/javascript/$taskId",
        params: { taskId: String(task.id) },
        search: { tab },
        resetScroll: false,
      });
    }

    return navigate({
      to: "/",
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
    return <UiLoader fullscreen={true} size="lg" label="Загружаем редактор" />;
  }

  if (taskId && !task) {
    return (
      <div className={styles.notFound}>
        <FileQuestion size={40} />
        <h2>Задача #{taskId} не найдена</h2>
        <button type="button" className={styles.actionBtn} onClick={() => navigate({ to: "/" })}>
          <Home size={14} />
          <span>На главную</span>
        </button>
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
    <div ref={consoleWrapperRef}>
      <JsConsole
        logs={consoleLogs}
        isRunning={isRunning}
        lastExecution={lastExecution}
        filename={activeFile.name}
        onRun={() => handleRunCode()}
        onStop={handleStopCode}
        onClear={handleClearConsole}
      />
    </div>
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
                  key={`open_${task?.id}_${tab}_${activeFileIdx}`}
                  code={activeFile?.code || ""}
                  onChange={handleCodeChange}
                  onRun={() => handleRunCode()}
                  onReset={handleResetCode}
                  files={files}
                  activeFileIdx={activeFileIdx}
                  onFileSelect={setActiveFileIdx}
                  filepath={activeFile?.name || ""}
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
                key={`open_${task?.id}_${tab}_${activeFileIdx}`}
                code={activeFile?.code || ""}
                onChange={handleCodeChange}
                onRun={() => handleRunCode()}
                onReset={handleResetCode}
                files={files}
                activeFileIdx={activeFileIdx}
                onFileSelect={setActiveFileIdx}
                filepath={activeFile?.name || ""}
                fillHeight={true}
                isFullscreen={true}
                onToggleFullscreen={handleExit}
                isFullscreenTransitioning={isFullscreenExiting}
                bottomConsole={consoleNode}
              />

              {!isConsoleVisible && (
                <Tooltip content="Перейти к консоли" side="left" sideOffset={10}>
                  <button
                    type="button"
                    className={styles.quickScrollConsoleBtn}
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
            </>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};
