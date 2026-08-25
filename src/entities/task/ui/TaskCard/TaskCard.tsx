import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "../../types";
import { TaskDifficultyBadge } from "../TaskDifficultyBadge";
import styles from "./TaskCard.module.css";

export interface TaskCardProps {
  task: Task;
  isActive?: boolean;
  isCompleted?: boolean;
  isDue?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TaskCard({
  task,
  isActive = false,
  isCompleted = false,
  isDue = false,
  onClick,
  className,
}: TaskCardProps) {
  return (
    <div
      className={clsx(styles.card, isActive && styles.active, className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.left}>
        <span
          className={clsx(styles.statusIcon, isCompleted && styles.statusCompleted)}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </span>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{task.title}</span>
          </div>
          {task.category && <span className={styles.category}>{task.category}</span>}
        </div>
      </div>

      <div className={styles.right}>
        {isDue && (
          <span className={styles.dueBadge} title="Пора повторить по интервальной системе">
            <Clock size={12} />
            <span>Повторить</span>
          </span>
        )}
        <TaskDifficultyBadge difficulty={task.difficulty} />
      </div>
    </div>
  );
}
