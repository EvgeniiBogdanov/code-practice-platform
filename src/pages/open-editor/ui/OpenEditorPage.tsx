import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Code2, Share2, Check, Minimize2, Home, FileQuestion, ArrowDown } from "lucide-react";
import { clsx } from "clsx";
import { getTaskById, getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
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
import { Tooltip, ErrorBoundary, ViewModeToggle } from "@/shared/ui";
import styles from "./OpenEditorPage.module.css";

export interface OpenEditorPageProps {
  taskId?: string;
  tab?: "candidate" | "solution";
  initialViewMode?: "preview" | "code";
}

export const OpenEditorPage = ({
  taskId,
  tab = "candidate",
  initialViewMode,
}: OpenEditorPageProps) => {
  const navigate = useNavigate();
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const task = useMemo(() => (taskId ? getTaskById(taskId) : null), [taskId]);
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

  const hasVisualComponent = useMemo(
    () => (task ? hasTaskVisualComponent(task, files) : isReact),
    [task, files, isReact]
  );

  const [viewMode, setViewMode] = useState<"preview" | "code">(
    initialViewMode || (hasVisualComponent ? "preview" : "code")
  );

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const consoleWrapperRef = useRef<HTMLDivElement>(null);

  // Reset files when task or tab changes
  useEffect(() => {
    setActiveFileIdx(0);
    setIsConsoleVisible(true);
    setFiles(initialFiles);
    setViewMode(
      initialViewMode ||
        (task ? (hasTaskVisualComponent(task, initialFiles) ? "preview" : "code") : "preview")
    );
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [task?.id, tab, initialFiles, task, initialViewMode]);

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
    if (task) {
      await deleteUserSolution(task.id, tab === "solution" ? "sol" : "cand", activeFileIdx);
    }
    const original = initialFiles[activeFileIdx]?.code || defaultCode;
    handleCodeChange(original);
  };

  const handleRunCode = async (codeToExecute?: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLogs([]);

    const codeToRun = codeToExecute !== undefined ? codeToExecute : activeFile?.code || "";
    const result = await runNodeJsCode(codeToRun, {
      onLog: (_newLog, allLogs) => setConsoleLogs(allLogs),
    });

    setConsoleLogs(result.logs);
    setLastExecution({ durationMs: result.durationMs, exitCode: result.exitCode });
    setIsRunning(false);
  };

  const handleStopCode = () => {
    clearRunningTimers();
    setIsRunning(false);
    setLastExecution({
      durationMs: 0,
      exitCode: 130,
    });
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    setLastExecution(null);
    clearRunningTimers();
    setIsRunning(false);
  };

  const handleExit = () => {
    if (task) {
      const section = task.section || "javascript";
      if (section === "algorithms") {
        navigate({
          to: "/algorithms/$taskId",
          params: { taskId: String(task.id) },
          search: { tab },
        });
      } else if (section === "react") {
        navigate({
          to: "/react/$taskId",
          params: { taskId: String(task.id) },
          search: { tab },
        });
      } else {
        navigate({
          to: "/javascript/$taskId",
          params: { taskId: String(task.id) },
          search: { tab },
        });
      }
    } else {
      navigate({ to: "/" });
    }
  };

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
  }, [task, tab]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.titleBadge}>
          <Code2 size={16} className={styles.titleIcon} />
          <span>
            {task
              ? `${task.title} (${tab === "solution" ? "Эталон" : "Решение"})`
              : "Полноэкранный редактор"}
          </span>
        </div>

        {hasVisualComponent && <ViewModeToggle mode={viewMode} onChange={setViewMode} />}

        <div className={styles.topActions}>
          <button
            type="button"
            className={clsx(styles.actionBtn, linkCopied && styles.copied)}
            onClick={handleCopyLink}
            title="Скопировать ссылку"
          >
            {linkCopied ? <Check size={13} /> : <Share2 size={13} />}
            <span>{linkCopied ? "Ссылка скопирована" : "Поделиться"}</span>
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleExit}
            title="Выйти из полноэкранного режима (Esc)"
          >
            <Minimize2 size={14} />
            <span>Свернуть</span>
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <ErrorBoundary>
          {hasVisualComponent && viewMode === "preview" ? (
            <ReactLivePreview
              task={task || undefined}
              files={files}
              activeFileIdx={activeFileIdx}
              currentCode={activeFile.code}
              storagePrefix={tab === "solution" ? "sol" : "cand"}
            />
          ) : (
            <>
              <CodeEditor
                key={`open_${task?.id}_${tab}_${activeFileIdx}`}
                code={activeFile?.code || ""}
                onChange={handleCodeChange}
                onRun={hasVisualComponent ? undefined : () => handleRunCode()}
                onReset={handleResetCode}
                files={files}
                activeFileIdx={activeFileIdx}
                onFileSelect={setActiveFileIdx}
                filepath={activeFile?.name || ""}
                isFullscreen={true}
                onToggleFullscreen={handleExit}
                bottomConsole={
                  !hasVisualComponent ? (
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
                  ) : null
                }
              />

              {!hasVisualComponent && !isConsoleVisible && (
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
