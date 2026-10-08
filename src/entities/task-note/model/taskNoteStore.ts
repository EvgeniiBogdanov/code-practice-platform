import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TaskNote, TaskNoteState } from "../types";

const EMPTY_NOTE: TaskNote = { text: "", mistakes: [] };

const createMistakeId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const isEmptyNote = (note: TaskNote): boolean => note.text.trim() === "" && !note.mistakes.length;

/** Applies `update` to the task's note and drops the record once nothing is left in it. */
const updateNote = (
  notes: Record<string, TaskNote>,
  taskId: string | number,
  update: (note: TaskNote) => TaskNote
): Record<string, TaskNote> => {
  const key = String(taskId);
  const next = update(notes[key] ?? EMPTY_NOTE);
  const result = { ...notes, [key]: next };
  if (isEmptyNote(next)) delete result[key];
  return result;
};

export const useTaskNoteStore = create<TaskNoteState>()(
  persist(
    (set) => ({
      notes: {},
      setNoteText: (taskId, text): void => {
        set((state) => ({
          notes: updateNote(state.notes, taskId, (note) => ({ ...note, text })),
        }));
      },
      addMistake: (taskId, reasonId, comment = ""): void => {
        set((state) => ({
          notes: updateNote(state.notes, taskId, (note) => ({
            ...note,
            mistakes: [
              {
                id: createMistakeId(),
                reasonId,
                comment: comment.trim(),
                createdAt: Date.now(),
              },
              ...note.mistakes,
            ],
          })),
        }));
      },
      removeMistake: (taskId, mistakeId): void => {
        set((state) => ({
          notes: updateNote(state.notes, taskId, (note) => ({
            ...note,
            mistakes: note.mistakes.filter((mistake) => mistake.id !== mistakeId),
          })),
        }));
      },
    }),
    {
      name: "playground_task_notes",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);

export const selectTaskNote = (taskId: string | number) => (state: TaskNoteState) =>
  state.notes[String(taskId)] ?? EMPTY_NOTE;
