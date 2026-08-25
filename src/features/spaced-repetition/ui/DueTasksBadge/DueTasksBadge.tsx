import React from "react";
import { Clock } from "lucide-react";
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
      className={[styles.badge, className].filter(Boolean).join(" ")}
      onClick={onClick}
      title={`${dueCount} задач ожидают повторения сегодня`}
    >
      <Clock size={12} />
      <span>Повторить: {dueCount}</span>
    </button>
  );
};

DueTasksBadge.displayName = "DueTasksBadge";
