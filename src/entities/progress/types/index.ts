export type TaskCompletionStatus = "solved" | "unsolved" | null;

export interface ProgressState {
  completedTasks: Record<string, TaskCompletionStatus>;
  checklistState: Record<string, boolean>;
  copiedCodeId: string | null;
  isInitialized: boolean;
  initProgress: () => Promise<void>;
  setTaskStatus: (taskId: string | number, status: TaskCompletionStatus) => Promise<void>;
  toggleChecklistItem: (key: string) => Promise<void>;
  handleCopyCode: (id: string, codeText: string) => void;
  handleFullReset: (scope?: "section" | "all", taskIds?: Array<string | number>) => Promise<void>;
}

export interface SectionProgressStats {
  total: number;
  completed: number;
  percentage: number;
}
