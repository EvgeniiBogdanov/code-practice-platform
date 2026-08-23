import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionDueTabProps {
  dueTasks: Task[];
  reviews: Record<string, ReviewItem>;
  scopeLabel: string;
  onNavigate?: () => void;
}

const getTaskPath = (t: Task) => {
  if (t.section === "javascript") return `/javascript/${t.id}`;
  if (t.section === "algorithms") return `/algorithms/${t.id}`;
  return `/react/${t.id}`;
};

const getSectionMeta = (section?: string) => {
  if (section === "javascript") {
    return { name: "JavaScript", color: "#f59e0b" };
  }
  if (section === "algorithms") {
    return { name: "Алгоритмы", color: "#a855f7" };
  }
  return { name: "React", color: "#3b82f6" };
};

export const SpacedRepetitionDueTab = memo(
  ({ dueTasks, reviews, scopeLabel, onNavigate }: SpacedRepetitionDueTabProps) => {
    if (dueTasks.length === 0) {
      return (
        <div className={styles.emptyDueCard}>
          <CheckCircle2 size={32} style={{ color: "#10b981", margin: "0 auto 8px" }} />
          <div className={styles.emptyDueTitle}>Все задачи {scopeLabel} повторены!</div>
          <div className={styles.emptyDueDesc}>
            На сегодня нет задач {scopeLabel} с наступившим сроком повторения. Решайте новые задачи,
            чтобы пополнить график интервального повторения.
          </div>
        </div>
      );
    }

    return (
      <div className={styles.dueGrid}>
        {dueTasks.map((task) => {
          const meta = getSectionMeta(task.section);
          const rev = reviews[String(task.id)];
          const stage = rev?.stage || 1;

          return (
            <Link
              key={task.id}
              to={getTaskPath(task)}
              className={styles.dueCard}
              onClick={onNavigate}
            >
              <div className={styles.dueCardTop}>
                <span className={styles.dueCardSection} style={{ color: meta.color }}>
                  <span className={styles.sectionDot} style={{ backgroundColor: meta.color }} />
                  {meta.name}
                </span>
                <span className={styles.dueCardStage}>Этап {stage}</span>
              </div>

              <div className={styles.dueCardTitle}>{task.title}</div>

              <div className={styles.dueCardFooter}>
                <span className={styles.dueAlertText}>
                  <RotateCcw size={11} />
                  <span>Пора повторить</span>
                </span>
                <span className={styles.dueActionBtn}>
                  <span>Решить</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
);

SpacedRepetitionDueTab.displayName = "SpacedRepetitionDueTab";
