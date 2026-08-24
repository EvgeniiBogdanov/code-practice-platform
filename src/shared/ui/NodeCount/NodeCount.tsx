import { memo } from "react";
import { clsx } from "clsx";
import styles from "./NodeCount.module.css";

export interface NodeCountProps {
  completed: number;
  total: number;
  completedClass?: string;
  isCompleted?: boolean;
  className?: string;
}

export const NodeCount = memo(
  ({ completed, total, completedClass, isCompleted, className }: NodeCountProps) => {
    const variantClass =
      completedClass && styles[completedClass]
        ? styles[completedClass]
        : isCompleted || (completed > 0 && completed === total)
          ? styles.completed
          : "";

    return (
      <span className={clsx(styles.nodeCount, variantClass, className)}>
        <span className={styles.inner}>
          {completed}/{total}
        </span>
      </span>
    );
  }
);

NodeCount.displayName = "NodeCount";
