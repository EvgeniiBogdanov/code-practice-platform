import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { Card, NotificationBadge } from "@/shared/ui";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionUnsolvedTabProps {
  unsolvedTasks: Task[];
  scopeLabel: string;
  onNavigate?: () => void;
}

const getTaskPath = (t: Task): string => {
  if (t.section === "javascript") return `/javascript/${t.id}`;
  if (t.section === "algorithms") return `/algorithms/${t.id}`;
  return `/react/${t.id}`;
};

export const SpacedRepetitionUnsolvedTab = memo(
  ({ unsolvedTasks, scopeLabel, onNavigate }: SpacedRepetitionUnsolvedTabProps) => {
    if (unsolvedTasks.length === 0) {
      return (
        <Card variant="subtle" className={styles.emptyDueCard}>
          <CheckCircle2 size={32} className={styles.emptyDueIcon} />
          <div className={styles.emptyDueTitle}>Нет нерешённых задач {scopeLabel}</div>
          <div className={styles.emptyDueDesc}>
            Задачи, отмеченные кнопкой «Не решено», отображаются здесь для повторного решения и разбора.
          </div>
        </Card>
      );
    }

    return (
      <div className={styles.unsolvedContainer}>
        <div className={styles.upcomingList}>
          {unsolvedTasks.map((task) => {
            const groupTag = task.group
              ? `${task.group}${task.subgroup ? ` • ${task.subgroup}` : ""}`
              : task.difficulty || "Задача";

            return (
              <Link
                key={task.id}
                to={getTaskPath(task)}
                className={styles.upcomingRowLink}
                onClick={onNavigate}
              >
                <div className={styles.upcomingRow}>
                  <div className={styles.upcomingRowLeft}>
                    <FileText size={16} className={styles.fileIcon} />
                    <span className={clsx(styles.upcomingRowTitle, styles.ratingUnsolved)}>
                      {task.title}
                    </span>
                  </div>

                  <div className={styles.upcomingRowRight}>
                    <NotificationBadge
                      variant="neutral"
                      pinned={false}
                      ring={false}
                      size="tab"
                    >
                      {groupTag}
                    </NotificationBadge>

                    <NotificationBadge
                      variant="red"
                      pinned={false}
                      ring={false}
                      size="tab"
                    >
                      Не решено
                    </NotificationBadge>

                    <ArrowRight size={13} className={styles.upcomingRowArrow} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
);

SpacedRepetitionUnsolvedTab.displayName = "SpacedRepetitionUnsolvedTab";
