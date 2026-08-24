import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { Task, SectionType, SECTIONS_CONFIG } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import { Card } from "@/shared/ui";
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

export const SpacedRepetitionDueTab = memo(
  ({ dueTasks, reviews, scopeLabel, onNavigate }: SpacedRepetitionDueTabProps) => {
    if (dueTasks.length === 0) {
      return (
        <Card variant="subtle" className={styles.emptyDueCard}>
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
      <div className={styles.dueGrid}>
        {dueTasks.map((task) => {
          const section = (task.section ?? "react") as SectionType;
          const meta = SECTIONS_CONFIG[section] ?? SECTIONS_CONFIG.react;
          const rev = reviews[String(task.id)];
          const stage = rev?.stage ?? 1;

          return (
            <Link
              key={task.id}
              to={getTaskPath(task)}
              className={styles.dueCardLink}
              onClick={onNavigate}
            >
              <Card variant="subtle" className={styles.dueCard}>
                <div className={styles.dueCardTop}>
                  <span className={clsx(styles.dueCardSection, styles[`section_${section}`])}>
                    <span className={styles.sectionDot} />
                    {meta.title}
                  </span>
                  <span className={styles.dueCardStage}>Этап {stage}</span>
                </div>

                <div className={styles.dueCardTitle}>{task.title}</div>

                <div className={styles.dueCardFooter}>
                  <span className={styles.dueAlertText}>
                    <span>Пора повторить</span>
                  </span>
                  <span className={styles.dueActionBtn}>
                    <span>Решить</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }
);

SpacedRepetitionDueTab.displayName = "SpacedRepetitionDueTab";
