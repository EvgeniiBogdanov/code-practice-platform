import React from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { useReviewStore, selectDueTasksCount } from "@/entities/review";
import styles from "./DueTasksBadge.module.css";

export interface DueTasksBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const DueTasksBadge = ({
  onClick,
  className,
}: DueTasksBadgeProps): React.JSX.Element | null => {
  const dueCount = useReviewStore(selectDueTasksCount);

  if (dueCount === 0) return null;

  return (
    <button
      type="button"
      className={clsx(styles.badge, className)}
      onClick={onClick}
      title={`${dueCount} задач ожидают повторения сегодня`}
    >
      <Clock size={12} />
      <span>Повторить: {dueCount}</span>
    </button>
  );
};

DueTasksBadge.displayName = "DueTasksBadge";
