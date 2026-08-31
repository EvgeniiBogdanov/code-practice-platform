import { memo } from "react";
import { clsx } from "clsx";
import styles from "./NodeCount.module.css";

export type NodeCountVariant = "progress" | "count";

export interface NodeCountProps {
  completed: number;
  total: number;
  completedClass?: string;
  isCompleted?: boolean;
  className?: string;
  variant?: NodeCountVariant;
}

export const NodeCount = memo(
  ({
    completed,
    total,
    completedClass,
    isCompleted,
    className,
    variant = "progress",
  }: NodeCountProps) => {
    const showsProgress = variant === "progress";
    const variantClass =
      showsProgress && completedClass && styles[completedClass]
        ? styles[completedClass]
        : showsProgress && (isCompleted || (completed > 0 && completed === total))
          ? styles.completed
          : "";

    return (
      <span className={clsx(styles.nodeCount, variantClass, className)}>
        <span className={styles.inner}>{showsProgress ? `${completed}/${total}` : total}</span>
      </span>
    );
  }
);

NodeCount.displayName = "NodeCount";
