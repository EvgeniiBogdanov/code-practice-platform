import React from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { useReviewStore, selectDueTasksCount } from "@/entities/review";
import { Tooltip } from "@/shared/ui";
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

  const tooltipText = `${dueCount} задач ожидают повторения сегодня`;

  return (
    <Tooltip content={tooltipText} side="bottom">
      <button
        type="button"
        className={clsx(styles.badge, className)}
        onClick={onClick}
        aria-label={tooltipText}
      >
        <Clock size={12} />
        <span>Повторить: {dueCount}</span>
      </button>
    </Tooltip>
  );
};

DueTasksBadge.displayName = "DueTasksBadge";
