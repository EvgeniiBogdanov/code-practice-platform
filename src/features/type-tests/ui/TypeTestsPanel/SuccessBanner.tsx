import React from "react";
import { clsx } from "clsx";
import { CheckCircle2 } from "lucide-react";
import { Button, Callout } from "@/shared/ui";
import styles from "./SuccessBanner.module.css";

export interface SuccessBannerProps {
  duration: string;
  /** Fade in: only for a banner that has just appeared, not for one shown again after a remount. */
  animated?: boolean;
  isSolved?: boolean;
  onMarkSolved?: () => void;
  onShowReference?: () => void;
  onNextTask?: () => void;
  onBackToTask?: () => void;
}

/** Shown while the latest run passed every test and the code has not changed since. */
export const SuccessBanner = ({
  duration,
  animated = false,
  isSolved,
  onMarkSolved,
  onShowReference,
  onNextTask,
  onBackToTask,
}: SuccessBannerProps): React.JSX.Element => (
  <div className={clsx(styles.banner, animated && styles.animated)}>
    <Callout
      color="green"
      size="sm"
      icon={<CheckCircle2 size={18} />}
      title={`Все тесты пройдены · ${duration}`}
    >
      <div className={styles.actions}>
        {!isSolved && onMarkSolved && (
          <Button variant="success" size="sm" onClick={onMarkSolved}>
            Отметить решённой
          </Button>
        )}
        {onShowReference && (
          <Button variant="outline" size="sm" onClick={onShowReference}>
            Посмотреть эталон
          </Button>
        )}
        {onNextTask && (
          <Button variant="outline" size="sm" onClick={onNextTask}>
            Следующая задача →
          </Button>
        )}
        {onBackToTask && (
          <Button variant="outline" size="sm" onClick={onBackToTask}>
            Вернуться к задаче
          </Button>
        )}
      </div>
    </Callout>
  </div>
);

SuccessBanner.displayName = "SuccessBanner";
