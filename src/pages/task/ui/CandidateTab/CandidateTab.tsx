import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { clsx } from "clsx";
import { Task, getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
import {
  getUserSolution,
  getUserSolutionSync,
  saveUserSolution,
  deleteUserSolution,
} from "@/shared/lib/storage";
import {
  runNodeJsCode,
  clearRunningTimers,
  NodeRunnerLogEntry,
  TaskSourceFile,
} from "@/shared/lib/code-runners";
import { Tooltip, ErrorBoundary, ViewModeToggle, ViewMode } from "@/shared/ui";
import { CodeEditor } from "@/features/code-editor";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import styles from "./CandidateTab.module.css";

export interface CandidateTabProps {
  task: Task;
  className?: string;
}

export const CandidateTab = ({ task, className }: CandidateTabProps): React.JSX.Element => {
  const navigate = useNavigate();

  const initialFiles: TaskSourceFile[] = useMemo(() => {
    const rawFiles = getTaskFiles(task, "candidate");
    return rawFiles.map((file, idx) => {
      const cached = getUserSolutionSync(task.id, "cand", idx);
      if (typeof cached === "string") {
        return { ...file, code: cached };
      }
      return file;
    });
  }, [task]);

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [files, setFiles] = useState<TaskSourceFile[]>(initialFiles);
  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

  const hasVisualComponent = useMemo(() => hasTaskVisualComponent(task, files), [task, files]);

  const [viewMode, setViewMode] = useState<ViewMode>("code");

  // JS Runner state
  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const consoleWrapperRef = useRef<HTMLDivElement>(null);

  // Reset when task changes
  useEffect(() => {
    setActiveFileIdx(0);
    setIsConsoleVisible(true);
    setFiles(initialFiles);
    setViewMode("code");
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [task.id, initialFiles, task]);

  // Load saved solution from storage on task mount / file select
  useEffect(() => {
    let isMounted = true;
    async function loadSaved(): Promise<void> {
      const saved = await getUserSolution(task.id, "cand", activeFileIdx);
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
  }, [task.id, activeFileIdx]);

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

  // IntersectionObserver to track console visibility for the quick-scroll button
  useEffect(() => {
    const el = consoleWrapperRef.current;
    if (!el || viewMode === "preview") {
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
  }, [viewMode, activeFileIdx, task.id]);

  const handleToggleFullscreen = () => {
    const section = task.section || "javascript";
    navigate({
      to:
        section === "algorithms"
          ? "/open/algorithms/$taskId"
          : section === "react"
            ? "/open/react/$taskId"
            : "/open/javascript/$taskId",
      params: { taskId: String(task.id) },
      search: { tab: "candidate", view: hasVisualComponent ? "split" : "code" },
    });
  };

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) => {
      const next = [...prev];
      if (next[activeFileIdx]) {
        next[activeFileIdx] = { ...next[activeFileIdx], code: newCode };
      }
      return next;
    });
    saveUserSolution(task.id, "cand", activeFileIdx, newCode);
  };

  const handleResetCode = async (): Promise<void> => {
    await deleteUserSolution(task.id, "cand", activeFileIdx);
    const defaults = getTaskFiles(task, "candidate");
    const original = defaults[activeFileIdx]?.code || "";
    handleCodeChange(original);
  };

  const handleRunCode = async (codeToExecute?: string): Promise<void> => {
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

  const handleStopCode = (): void => {
    clearRunningTimers();
    setIsRunning(false);
    setLastExecution({
      durationMs: 0,
      exitCode: 130,
    });
  };

  const handleClearConsole = (): void => {
    setConsoleLogs([]);
    setLastExecution(null);
    clearRunningTimers();
    setIsRunning(false);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, []);

  return (
    <div className={clsx(styles.container, className)}>
      {hasVisualComponent && <ViewModeToggle mode={viewMode} onChange={setViewMode} />}

      <ErrorBoundary>
        {hasVisualComponent && viewMode === "preview" ? (
          <ReactLivePreview
            task={task}
            files={files}
            activeFileIdx={activeFileIdx}
            currentCode={activeFile?.code || ""}
            storagePrefix="cand"
          />
        ) : (
          <>
            <CodeEditor
              key={`cand_${task.id}_${activeFileIdx}`}
              code={activeFile?.code || ""}
              onChange={handleCodeChange}
              onRun={() => handleRunCode()}
              onReset={handleResetCode}
              files={files}
              activeFileIdx={activeFileIdx}
              onFileSelect={setActiveFileIdx}
              filepath={activeFile.name}
              onToggleFullscreen={handleToggleFullscreen}
              bottomConsole={
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
              }
            />

            {/* Quick-scroll to console button */}
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
  );
};
