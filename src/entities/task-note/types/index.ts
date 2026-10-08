export interface TaskMistake {
  id: string;
  reasonId: string;
  comment: string;
  createdAt: number;
}

export interface TaskNote {
  text: string;
  mistakes: TaskMistake[];
}

export interface TaskNoteState {
  notes: Record<string, TaskNote>;
  setNoteText: (taskId: string | number, text: string) => void;
  addMistake: (taskId: string | number, reasonId: string, comment?: string) => void;
  removeMistake: (taskId: string | number, mistakeId: string) => void;
}
