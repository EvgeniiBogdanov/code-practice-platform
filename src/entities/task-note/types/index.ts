export interface TaskNote {
  /** Markdown source of the note. */
  text: string;
}

export interface TaskNoteState {
  notes: Record<string, TaskNote>;
  setNoteText: (taskId: string | number, text: string) => void;
}
