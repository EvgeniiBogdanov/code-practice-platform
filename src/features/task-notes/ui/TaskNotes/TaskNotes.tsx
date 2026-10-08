import { useState, type JSX } from "react";
import { clsx } from "clsx";
import { Bug, NotebookPen, Trash2 } from "lucide-react";
import {
  MISTAKE_REASONS,
  getMistakeReason,
  selectTaskNote,
  useTaskNoteStore,
} from "@/entities/task-note";
import { Button, Input, MarkdownView, MetaBadge, Textarea, UiSegmentedControl } from "@/shared/ui";
import styles from "./TaskNotes.module.css";

type NoteMode = "edit" | "preview";

const NOTE_MODES: readonly { value: NoteMode; label: string }[] = [
  { value: "edit", label: "Редактор" },
  { value: "preview", label: "Просмотр" },
];

const formatMistakeDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export interface TaskNotesProps {
  taskId: string | number;
  className?: string;
}

/** Personal markdown notes and a mistake journal for one task. Mount it with `key={taskId}`. */
export const TaskNotes = ({ taskId, className }: TaskNotesProps): JSX.Element => {
  const note = useTaskNoteStore(selectTaskNote(taskId));
  const setNoteText = useTaskNoteStore((state) => state.setNoteText);
  const addMistake = useTaskNoteStore((state) => state.addMistake);
  const removeMistake = useTaskNoteStore((state) => state.removeMistake);

  const [mode, setMode] = useState<NoteMode>(note.text ? "preview" : "edit");
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleAddMistake = (): void => {
    if (!reasonId) return;
    addMistake(taskId, reasonId, comment);
    setReasonId(null);
    setComment("");
  };

  return (
    <div className={clsx(styles.container, className)}>
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div>
            <h3 className={styles.title}>
              <NotebookPen size={16} className={styles.titleIcon} />
              Мои заметки
            </h3>
            <p className={styles.subtitle}>
              Личные конспекты по задаче. Поддерживается markdown, заметки хранятся только в этом
              браузере.
            </p>
          </div>
          <UiSegmentedControl
            label="Режим заметок"
            value={mode}
            options={NOTE_MODES}
            onChange={setMode}
          />
        </header>

        {mode === "edit" ? (
          <Textarea
            aria-label="Текст заметки"
            placeholder="Что важно запомнить: идея, ловушки, сложность, похожие задачи…"
            value={note.text}
            onChange={(event): void => setNoteText(taskId, event.target.value)}
          />
        ) : note.text.trim() ? (
          <MarkdownView content={note.text} />
        ) : (
          <p className={styles.empty}>Заметок пока нет.</p>
        )}
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div>
            <h3 className={styles.title}>
              <Bug size={16} className={styles.titleIcon} />
              Журнал ошибок
            </h3>
            <p className={styles.subtitle}>
              Записывайте, из-за чего не получилось: перед повторением видно, где вы спотыкались.
            </p>
          </div>
        </header>

        <div className={styles.reasons} role="group" aria-label="Причина ошибки">
          {MISTAKE_REASONS.map((reason) => (
            <Button
              key={reason.id}
              size="sm"
              variant="outline"
              isActive={reasonId === reason.id}
              onClick={(): void => setReasonId(reason.id)}
            >
              {reason.label}
            </Button>
          ))}
        </div>

        <div className={styles.addRow}>
          <Input
            aria-label="Комментарий к ошибке"
            placeholder="Комментарий (необязательно)"
            value={comment}
            onChange={(event): void => setComment(event.target.value)}
            onKeyDown={(event): void => {
              if (event.key === "Enter") handleAddMistake();
            }}
            containerClassName={styles.commentInput}
          />
          <Button variant="primary" disabled={!reasonId} onClick={handleAddMistake}>
            Записать ошибку
          </Button>
        </div>

        {note.mistakes.length > 0 ? (
          <ul className={styles.mistakes}>
            {note.mistakes.map((mistake) => (
              <li key={mistake.id} className={styles.mistake}>
                <MetaBadge variant="red">{getMistakeReason(mistake.reasonId).label}</MetaBadge>
                <span className={styles.mistakeDate}>{formatMistakeDate(mistake.createdAt)}</span>
                {mistake.comment && (
                  <span className={styles.mistakeComment}>{mistake.comment}</span>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={styles.removeButton}
                  aria-label="Удалить запись об ошибке"
                  onClick={(): void => removeMistake(taskId, mistake.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Ошибок не записано.</p>
        )}
      </section>
    </div>
  );
};
