import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { Task, SectionType } from "@/entities/task";
import { Card } from "@/shared/ui";
import styles from "./SectionOverviewPage.module.css";

export interface SectionDueAlertProps {
  section: SectionType;
  dueTasks: Task[];
}

export const SectionDueAlert = memo(({ section, dueTasks }: SectionDueAlertProps) => {
  if (dueTasks.length === 0) return null;

  return (
    <Card className={styles.dueAlertCard}>
      <div className={styles.dueAlertHeader}>
        <RotateCcw size={18} className={styles.statusDue} />
        <span className={styles.dueAlertTitle}>
          Задачи к повторению в этом разделе ({dueTasks.length})
        </span>
      </div>
      <p className={styles.dueAlertText}>
        Интервальный алгоритм SM-2 рекомендует повторить эти задачи для закрепления в долговременной
        памяти:
      </p>
      <div className={styles.dueTasksChips}>
        {dueTasks.slice(0, 6).map((t) => (
          <Link
            key={t.id}
            to={`/${section}/$taskId`}
            params={{ taskId: String(t.id) }}
            className={styles.dueChip}
          >
            <RotateCcw size={12} className={styles.statusDue} />
            <span>{t.title}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
});

SectionDueAlert.displayName = "SectionDueAlert";
