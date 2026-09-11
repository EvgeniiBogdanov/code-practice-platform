import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { Card, NotificationBadge } from "@/shared/ui";
import { isDueTaskUnsolved } from "../../lib/sort-due-tasks";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionDueTabProps {
  dueTasks: Task[];
  reviews: Record<string, ReviewItem>;
  scopeLabel: string;
  onNavigate?: () => void;
}

const getTaskPath = (t: Task): string => {
  if (t.section === "javascript") return `/javascript/${t.id}`;
  if (t.section === "algorithms") return `/algorithms/${t.id}`;
  return `/react/${t.id}`;
};

const getTaskRatingClass = (
  difficulty?: string,
  reviewRating?: string,
  isUnsolved?: boolean
): string => {
  if (isUnsolved) return styles.ratingUnsolved;
  const r = reviewRating?.toLowerCase();
  if (r === "hard") return styles.ratingHard;
  if (r === "medium") return styles.ratingMedium;
  if (r === "easy") return styles.ratingEasy;

  const d = difficulty?.toLowerCase();
  if (d === "hard") return styles.ratingHard;
  if (d === "medium" || d === "ts" || d === "refactoring") return styles.ratingMedium;
  if (d === "easy" || d === "warm-up" || d === "middle") return styles.ratingEasy;
  if (d === "strong") return styles.ratingPurple;

  return "";
};

export const SpacedRepetitionDueTab = memo(
  ({ dueTasks, reviews, scopeLabel, onNavigate }: SpacedRepetitionDueTabProps) => {
    const completedTasks = useProgressStore((state) => state.completedTasks);

    if (dueTasks.length === 0) {
      return (
        <Card variant="ghost" className={styles.emptyDueCard}>
          <CheckCircle2 size={32} className={styles.emptyDueIcon} />
          <div className={styles.emptyDueTitle}>Все задачи {scopeLabel} повторены!</div>
          <div className={styles.emptyDueDesc}>
            На сегодня нет задач {scopeLabel} с наступившим сроком повторения. Решайте новые задачи,
            чтобы пополнить график интервального повторения.
          </div>
        </Card>
      );
    }

    return (
      <div className={styles.upcomingList}>
        {dueTasks.map((task) => {
          const rev = reviews[String(task.id)];
          const stage = rev?.stage ?? 1;
          const intervalDays = rev?.intervalDays ?? 1;
          const isUnsolved = isDueTaskUnsolved(task.id, reviews, completedTasks);

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
                  <span
                    className={clsx(
                      styles.upcomingRowTitle,
                      getTaskRatingClass(task.difficulty, rev?.rating, isUnsolved)
                    )}
                  >
                    {task.title}
                  </span>
                </div>

                <div className={styles.upcomingRowRight}>
                  <NotificationBadge
                    variant={isUnsolved ? "red" : "yellow"}
                    pinned={false}
                    ring={false}
                    size="tab"
                  >
                    {isUnsolved ? "Не решено • 1 дн." : `Этап ${stage} • ${intervalDays} дн.`}
                  </NotificationBadge>

                  <ArrowRight size={13} className={styles.upcomingRowArrow} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
);

SpacedRepetitionDueTab.displayName = "SpacedRepetitionDueTab";
