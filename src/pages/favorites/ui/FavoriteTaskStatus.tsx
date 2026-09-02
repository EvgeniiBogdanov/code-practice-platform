import React from "react";
import { Check, Minus, RotateCcw, X } from "lucide-react";
import { clsx, Tooltip } from "@/shared/ui";
import { FavoriteTaskStatus as TaskStatus } from "../model/use-favorites-page";
import styles from "./FavoritesPage.module.css";

export interface FavoriteTaskStatusProps {
  status: TaskStatus;
  isDue: boolean;
  showLabel?: boolean;
}

export const FavoriteTaskStatus = ({
  status,
  isDue,
  showLabel = false,
}: Readonly<FavoriteTaskStatusProps>): React.JSX.Element => {
  const label = isDue
    ? "Пора повторить"
    : status === "solved"
      ? "Решено"
      : status === "unsolved"
        ? "Не решено"
        : "Не начато";
  const icon = isDue ? (
    <RotateCcw size={13} />
  ) : status === "solved" ? (
    <Check size={14} />
  ) : status === "unsolved" ? (
    <X size={14} />
  ) : (
    <Minus size={10} />
  );

  const statusNode = (
    <span
      className={clsx(styles.taskStatus, styles[`status_${isDue ? "due" : status}`])}
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
