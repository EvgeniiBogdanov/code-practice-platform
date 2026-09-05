import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Task, TaskSolution, getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
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
import { ViewMode } from "@/shared/ui";
import { useFullscreenNavigation } from "./use-fullscreen-navigation";

export interface UseSolutionTabReturn {
  isReact: boolean;
  hasVisualComponent: boolean;
  solutions: TaskSolution[];
  selectedSolutionIdx: number;
  setSelectedSolutionIdx: (idx: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeFileIdx: number;
  setActiveFileIdx: (idx: number) => void;
  isHintExpanded: boolean;
  setIsHintExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  files: TaskSourceFile[];
  activeFile: TaskSourceFile;
  consoleLogs: NodeRunnerLogEntry[];
  isRunning: boolean;
  lastExecution: { durationMs?: number; exitCode?: number } | null;
  isConsoleVisible: boolean;
  consoleWrapperRef: React.RefObject<HTMLDivElement | null>;
  recommendationNote?: string;
  isRecommended?: boolean;
  badgeText: string;
  isFullscreenTransitioning: boolean;
  preloadFullscreen: () => void;
  handleToggleFullscreen: () => void;
  handleCodeChange: (newCode: string) => void;
  handleResetCode: () => Promise<void>;
  handleRunCode: (codeToExecute?: string) => Promise<void>;
  handleStopCode: () => void;
  handleClearConsole: () => void;
}

const MAX_CONSOLE_LOGS = 500;

export function useSolutionTab(task: Task): UseSolutionTabReturn {
  const isReact = task.section === "react";
  const solutions = useMemo(
    () => task.solutions || task.variants || [],
    [task.solutions, task.variants]
  );

  const [selectedSolutionIdx, setSelectedSolutionIdx] = useState(0);
  const activeSolution = solutions[selectedSolutionIdx];

  const initialFiles: TaskSourceFile[] = useMemo(() => {
    if (activeSolution?.files && activeSolution.files.length > 0) {
      return activeSolution.files.map((f) => ({
        name: f.name || (f.filepath ? f.filepath.split("/").pop() || "main.js" : "main.js"),
        filepath: f.filepath || f.name || "main.js",
        code: String(f.solution || f.rawSolution || f.code || ""),
      }));
    }
    const solCode =
      typeof activeSolution?.rawSolution === "string"
        ? activeSolution.rawSolution
        : typeof activeSolution?.code === "string"
          ? activeSolution.code
          : typeof task.rawSolution === "string"
            ? task.rawSolution
            : typeof task.solution === "string"
              ? task.solution
              : "";

    const solTask: Task = {
      ...task,
      rawSolution: solCode,
      filepath: activeSolution?.filepath || task.filepath,
    };
    const baseFiles = getTaskFiles(solTask, "solution");
    return baseFiles.map((file, idx) => {
      const cached = getUserSolutionSync(task.id, "sol", idx, selectedSolutionIdx);
      if (typeof cached === "string") {
        return { ...file, code: cached };
      }
      return file;
    });
  }, [activeSolution, task, selectedSolutionIdx]);

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [files, setFiles] = useState<TaskSourceFile[]>(initialFiles);
  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

  const hasVisualComponent = useMemo(() => hasTaskVisualComponent(task, files), [task, files]);

  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const { isFullscreenTransitioning, handleToggleFullscreen, preloadFullscreen } =
    useFullscreenNavigation({ task, tab: "solution", hasVisualComponent });
  const [isHintExpanded, setIsHintExpanded] = useState(false);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const consoleWrapperRef = useRef<HTMLDivElement>(null);

  // Reset state when task changes
  useEffect(() => {
    setSelectedSolutionIdx(0);
    setActiveFileIdx(0);
    setIsConsoleVisible(true);
    setIsHintExpanded(false);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
    clearRunningTimers();
  }, [task.id]);

  // Update files and viewMode on variant switch or task change
  useEffect(() => {
    setActiveFileIdx(0);
    setFiles(initialFiles);
    setViewMode("code");
    setIsHintExpanded(false);
  }, [task, initialFiles]);

  // Load saved solution from storage on file select / variant switch
  useEffect(() => {
    let isMounted = true;
    async function loadSaved() {
      const saved = await getUserSolution(task.id, "sol", activeFileIdx, selectedSolutionIdx);
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
  }, [task.id, activeFileIdx, selectedSolutionIdx]);

  // Listen for console logs from sandbox iframe
  useEffect(() => {
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
  }, []);

  // IntersectionObserver to track console visibility
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

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setFiles((prev) => {
        const next = [...prev];
        if (next[activeFileIdx]) {
          next[activeFileIdx] = { ...next[activeFileIdx], code: newCode };
        }
        return next;
      });
      saveUserSolution(task.id, "sol", activeFileIdx, newCode, selectedSolutionIdx);
    },
    [task.id, activeFileIdx, selectedSolutionIdx]
  );

  const handleResetCode = useCallback(async () => {
    await deleteUserSolution(task.id, "sol", activeFileIdx, selectedSolutionIdx);
    const original = initialFiles[activeFileIdx]?.code || "";
    handleCodeChange(original);
  }, [task.id, activeFileIdx, selectedSolutionIdx, initialFiles, handleCodeChange]);

  const handleRunCode = useCallback(
    async (codeToExecute?: string) => {
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
    },
    [isRunning, activeFile?.code]
  );

  const handleStopCode = useCallback(() => {
    clearRunningTimers();
    setIsRunning(false);
    setLastExecution({
      durationMs: 0,
      exitCode: 130,
    });
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
    setLastExecution(null);
    clearRunningTimers();
    setIsRunning(false);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, []);

  const recommendationNote = activeSolution?.recommendationNote || task.recommendationNote;
  const isRecommended = activeSolution?.isRecommended ?? task.isRecommended;
  const badgeText =
    activeSolution?.badge || (isRecommended ? "Рекомендуемый подход" : "Вариант решения");

  return {
    isReact,
    hasVisualComponent,
    solutions,
    selectedSolutionIdx,
    setSelectedSolutionIdx,
    viewMode,
    setViewMode,
    activeFileIdx,
    setActiveFileIdx,
    isHintExpanded,
    setIsHintExpanded,
    files,
    activeFile,
    consoleLogs,
    isRunning,
    lastExecution,
    isConsoleVisible,
    consoleWrapperRef,
    recommendationNote,
    isRecommended,
    badgeText,
    isFullscreenTransitioning,
    preloadFullscreen,
    handleToggleFullscreen,
    handleCodeChange,
    handleResetCode,
    handleRunCode,
    handleStopCode,
    handleClearConsole,
  };
}
