import { useState, type JSX } from "react";
import { selectTaskNote, useTaskNoteStore } from "@/entities/task-note";
import { NoteEditor } from "../NoteEditor/NoteEditor";

export interface TaskNotesProps {
  taskId: string | number;
  className?: string;
}

/** Personal notes for one task, written as a Notion-like page. Mount it with `key={taskId}`. */
export const TaskNotes = ({ taskId, className }: TaskNotesProps): JSX.Element => {
  const setNoteText = useTaskNoteStore((state) => state.setNoteText);
  // The editor owns the text while it is open, so the store is read once instead of subscribed to.
  const [initialText] = useState(() => selectTaskNote(taskId)(useTaskNoteStore.getState()).text);

  return (
    <NoteEditor
      initialMarkdown={initialText}
      onChange={(text): void => setNoteText(taskId, text)}
      className={className}
    />
  );
};
