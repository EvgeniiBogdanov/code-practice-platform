import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Task, TaskSolution, getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
import {
  getUserSolution,
  getUserSolutionSync,
  canReadUserSolutionSync,
  saveUserSolution,
  deleteUserSolution,
  subscribeToSyncEvents,
} from "@/shared/lib/storage";
import {
  runNodeJsCode,
  clearRunningTimers,
  NodeRunnerLogEntry,
  TaskSourceFile,
  isMessageFromFrameIn,
} from "@/shared/lib/code-runners";
import { ViewMode } from "@/shared/ui";

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
  isFilesReady: boolean;
  activeFile: TaskSourceFile;
  consoleLogs: NodeRunnerLogEntry[];
  isRunning: boolean;
  lastExecution: { durationMs?: number; exitCode?: number } | null;
  tabRef: React.RefObject<HTMLDivElement | null>;
  recommendationNote?: string;
  isRecommended?: boolean;
  hasWarning?: boolean;
  badgeText: string;
  handleCodeChange: (newCode: string) => void;
  handleFilesChange: (files: Array<{ name: string; code: string }>) => void;
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

  const defaultFiles: TaskSourceFile[] = useMemo(() => {
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
    return getTaskFiles(solTask, "solution");
  }, [activeSolution, task]);

  const initialFiles: TaskSourceFile[] = useMemo(() => {
    return defaultFiles.map((file, idx) => {
      const cached = getUserSolutionSync(task.id, "sol", idx, selectedSolutionIdx);
      if (typeof cached === "string") {
        return { ...file, code: cached };
      }
      return file;
    });
  }, [defaultFiles, task.id, selectedSolutionIdx]);

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [files, setFiles] = useState<TaskSourceFile[]>(initialFiles);
  const currentFilesScope = `${task.section}:${task.id}:${selectedSolutionIdx}`;
  const [filesScope, setFilesScope] = useState(currentFilesScope);
  const savedScope = `${currentFilesScope}:${activeFileIdx}`;
  // The editor waits for the stored code: rendering defaults first made it jump once the
  // async read finished (and flipped the quick-scroll button) whenever the sync cache missed.
  const [loadedScope, setLoadedScope] = useState<string | null>(() =>
    canReadUserSolutionSync(task.id, "sol", activeFileIdx, selectedSolutionIdx) ? savedScope : null
  );
  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

  const hasVisualComponent = useMemo(() => hasTaskVisualComponent(task, files), [task, files]);

  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [isHintExpanded, setIsHintExpanded] = useState(false);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);

  const tabRef = useRef<HTMLDivElement>(null);

  // Reset state when task changes
  const [currentTaskId, setCurrentTaskId] = useState(task.id);
  if (currentTaskId !== task.id) {
    setCurrentTaskId(task.id);
    setSelectedSolutionIdx(0);
    setActiveFileIdx(0);
    setIsHintExpanded(false);
    setConsoleLogs([]);
    setIsRunning(false);
    setLastExecution(null);
  }

  // Update files and viewMode on variant switch or task change
  const [filesSource, setFilesSource] = useState(initialFiles);
  if (filesSource !== initialFiles || filesScope !== currentFilesScope) {
    setFilesSource(initialFiles);
    setFilesScope(currentFilesScope);
    setActiveFileIdx(0);
    setFiles(initialFiles);
    setViewMode("code");
    setIsHintExpanded(false);
  }

  // Load saved solution from storage on file select / variant switch
  useEffect(() => {
    let isMounted = true;
    async function loadSaved() {
      const saved = await getUserSolution(task.id, "sol", activeFileIdx, selectedSolutionIdx);
      if (!isMounted) return;
      if (typeof saved === "string") {
        setFiles((prev) => {
          const next = [...prev];
          if (next[activeFileIdx]) {
            next[activeFileIdx] = { ...next[activeFileIdx], code: saved };
          }
          return next;
        });
      }
      setLoadedScope(`${task.section}:${task.id}:${selectedSolutionIdx}:${activeFileIdx}`);
    }
    loadSaved();
    return () => {
      isMounted = false;
    };
  }, [task.id, activeFileIdx, selectedSolutionIdx]);

  // Listen for solution clearing (e.g. from settings reset)
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((event) => {
      if (event.type === "SOLUTIONS_CLEARED") {
        const isCurrentTaskCleared =
          event.all || (Array.isArray(event.taskIds) && event.taskIds.includes(String(task.id)));
        if (isCurrentTaskCleared) {
          const baseFiles = getTaskFiles(task, "solution");
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
  }, [task]);

  // Listen for console logs from sandbox iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Both editor tabs stay mounted: only logs of this tab's own sandbox belong here.
      if (!isMessageFromFrameIn(tabRef.current, e)) return;
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

  const handleFilesChange = useCallback(
    (renamed: Array<{ name: string; code: string }>): void => {
      setFiles((prev) =>
        prev.map((file, index) => ({ ...file, code: renamed[index]?.code ?? file.code }))
      );
      renamed.forEach((file, index) => {
        if (file.code !== files[index]?.code) {
          saveUserSolution(task.id, "sol", index, file.code, selectedSolutionIdx);
        }
      });
    },
    [files, task.id, selectedSolutionIdx]
  );

  const handleResetCode = useCallback(async () => {
    await deleteUserSolution(task.id, "sol", activeFileIdx, selectedSolutionIdx);
    const original = defaultFiles[activeFileIdx]?.code || "";
    setFiles((prev) => {
      const next = [...prev];
      if (next[activeFileIdx]) {
        next[activeFileIdx] = { ...next[activeFileIdx], code: original };
      }
      return next;
    });
  }, [task.id, activeFileIdx, selectedSolutionIdx, defaultFiles]);

  const handleRunCode = useCallback(
    async (codeToExecute?: string) => {
      if (isRunning) return;
      setIsRunning(true);
      setConsoleLogs([]);

      const codeToRun = codeToExecute !== undefined ? codeToExecute : activeFile.code || "";
      const result = await runNodeJsCode(codeToRun, {
        filename: activeFile.name,
        onLog: (_newLog, allLogs) => setConsoleLogs(allLogs),
      });

      setConsoleLogs(result.logs);
      setLastExecution({ durationMs: result.durationMs, exitCode: result.exitCode });
      setIsRunning(false);
    },
    [isRunning, activeFile.code, activeFile.name]
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

  // Stop timers of the previous task, and on unmount
  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, [task.id]);

  const recommendationNote = activeSolution?.recommendationNote || task.recommendationNote;
  const isRecommended = activeSolution?.isRecommended ?? task.isRecommended;
  const hasWarning = Boolean(activeSolution?.hasWarning || activeSolution?.warning);
  const badgeText =
    activeSolution?.badge ||
    (isRecommended ? "Рекомендуемый подход" : hasWarning ? "Важное замечание" : "Вариант решения");

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
    isFilesReady: filesScope === currentFilesScope && loadedScope === savedScope,
    activeFile,
    consoleLogs,
    isRunning,
    lastExecution,
    tabRef,
    recommendationNote,
    isRecommended,
    hasWarning,
    badgeText,
    handleCodeChange,
    handleFilesChange,
    handleResetCode,
    handleRunCode,
    handleStopCode,
    handleClearConsole,
  };
}
