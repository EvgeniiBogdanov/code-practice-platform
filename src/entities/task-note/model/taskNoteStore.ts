import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TaskNote, TaskNoteState } from "../types";

const EMPTY_NOTE: TaskNote = { text: "" };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** v1 notes also carried a mistake journal; keep only the text of each note. */
const migrateNotes = (persisted: unknown): Pick<TaskNoteState, "notes"> => {
  const notes: Record<string, TaskNote> = {};
  const stored = isRecord(persisted) && isRecord(persisted.notes) ? persisted.notes : {};
  for (const [taskId, note] of Object.entries(stored)) {
    if (isRecord(note) && typeof note.text === "string" && note.text.trim()) {
      notes[taskId] = { text: note.text };
    }
  }
  return { notes };
};

export const useTaskNoteStore = create<TaskNoteState>()(
  persist(
    (set) => ({
      notes: {},
      setNoteText: (taskId, text): void => {
        set((state) => {
          const notes = { ...state.notes };
          if (text.trim()) notes[String(taskId)] = { text };
          else delete notes[String(taskId)];
          return { notes };
        });
      },
    }),
    {
      name: "playground_task_notes",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notes: state.notes }),
      migrate: migrateNotes,
    }
  )
);

export const selectTaskNote = (taskId: string | number) => (state: TaskNoteState) =>
  state.notes[String(taskId)] ?? EMPTY_NOTE;
