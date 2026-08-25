import React, { memo } from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import { useTimerStore } from "@/entities/ui-state";
import styles from "./TimerDisplay.module.css";

export interface TimerDisplayProps {
  className?: string;
  disabled?: boolean;
}

export const TimerDisplay = memo(({ className, disabled = false }: TimerDisplayProps) => {
  const timerSeconds = useTimerStore((state) => state.timerSeconds);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const formatTimer = useTimerStore((state) => state.formatTimer);

  if (timerSeconds === null) return null;

  const isExpired = timerSeconds === 0;

  return (
    <Tooltip content="Сбросить таймер" side="bottom" disabled={disabled}>
      <button
        type="button"
        className={clsx(
          styles.timerDisplay,
          isExpired && styles.expired,
          disabled && styles.disabled,
          className
        )}
        onClick={disabled ? undefined : resetTimer}
        disabled={disabled}
        aria-label="Сбросить таймер"
      >
        <Clock size={14} />
        <span>{formatTimer(timerSeconds)}</span>
      </button>
    </Tooltip>
  );
});

TimerDisplay.displayName = "TimerDisplay";
