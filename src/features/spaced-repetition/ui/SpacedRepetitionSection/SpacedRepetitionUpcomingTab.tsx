import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, ArrowRight, Clock, AlertCircle, FileText } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { Card, NotificationBadge } from "@/shared/ui";
import { UpcomingTaskItem } from "../../lib/upcoming-helpers";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionUpcomingTabProps {
  upcomingTasks: UpcomingTaskItem[];
  scopeLabel: string;
  onNavigate?: () => void;
}

const getTaskPath = (t: Task): string => {
  if (t.section === "javascript") return `/javascript/${t.id}`;
  if (t.section === "algorithms") return `/algorithms/${t.id}`;
  return `/react/${t.id}`;
};

const getTaskRatingClass = (difficulty?: string, reviewRating?: string): string => {
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

export const SpacedRepetitionUpcomingTab = memo(
  ({ upcomingTasks, scopeLabel, onNavigate }: SpacedRepetitionUpcomingTabProps) => {
    if (upcomingTasks.length === 0) {
      return (
        <Card variant="subtle" className={styles.emptyDueCard}>
          <CalendarClock size={32} className={styles.emptyDueIcon} />
          <div className={styles.emptyDueTitle}>Нет запланированных повторений {scopeLabel}</div>
          <div className={styles.emptyDueDesc}>
            Оценивайте решенные задачи шкалой интервального повторения (Трудно / Нормально / Легко),
            чтобы формировать график предстоящих повторов.
          </div>
        </Card>
      );
    }

    return (
      <div className={styles.upcomingList}>
        {upcomingTasks.map((item) => {
          const { task, review, stage, intervalDays, isDue, daysUntil, relativeTime, formattedDate } =
            item;

          const badgeVariant = isDue
            ? "yellow"
            : daysUntil === 0
              ? "green"
              : daysUntil <= 2
                ? "blue"
                : "neutral";

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
                      getTaskRatingClass(task.difficulty, review?.rating)
                    )}
                  >
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
                    Этап {stage} • {intervalDays} дн.
                  </NotificationBadge>

                  <NotificationBadge
                    variant={badgeVariant}
                    pinned={false}
                    ring={false}
                    size="tab"
                  >
                    {isDue ? (
                      <AlertCircle size={11} style={{ marginRight: 4 }} />
                    ) : daysUntil <= 1 ? (
                      <Clock size={11} style={{ marginRight: 4 }} />
                    ) : null}
                    <span>
                      {relativeTime} ({formattedDate})
                    </span>
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

SpacedRepetitionUpcomingTab.displayName = "SpacedRepetitionUpcomingTab";
