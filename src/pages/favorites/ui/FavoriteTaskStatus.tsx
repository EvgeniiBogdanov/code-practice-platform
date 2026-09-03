import React from "react";
import { Check, Minus, RotateCcw, X } from "lucide-react";
import { clsx, Tooltip } from "@/shared/ui";
import { FavoriteTaskStatus as TaskStatus } from "../model/use-favorites-page";
import styles from "./FavoritesPage.module.css";

export interface FavoriteTaskStatusProps {
  status: TaskStatus;
  isDue: boolean;
  isExcluded?: boolean;
  showLabel?: boolean;
}

export const FavoriteTaskStatus = ({
  status,
  isDue,
  isExcluded = false,
  showLabel = false,
}: Readonly<FavoriteTaskStatusProps>): React.JSX.Element => {
  const label = isExcluded
    ? "Исключена"
    : isDue
      ? "Пора повторить"
      : status === "solved"
        ? "Решено"
        : status === "unsolved"
          ? "Не решено"
          : "Не начато";
  const icon = isExcluded ? (
    <Minus size={10} />
  ) : isDue ? (
    <RotateCcw size={13} />
  ) : status === "solved" ? (
    <Check size={14} />
  ) : status === "unsolved" ? (
    <X size={14} />
  ) : (
    <Minus size={10} />
  );

  const statusType = isExcluded ? "excluded" : isDue ? "due" : status;

  const statusNode = (
    <span
      className={clsx(styles.taskStatus, styles[`status_${statusType}`])}
      aria-label={label}
    >
      {icon}
      {showLabel ? <span>{label}</span> : null}
    </span>
  );

  if (!showLabel) {
    return (
      <Tooltip content={label} side="top">
        {statusNode}
      </Tooltip>
    );
  }

  return statusNode;
};
