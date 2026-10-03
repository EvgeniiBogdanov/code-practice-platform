import React from "react";
import { AlertCircle, Bot, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { MAX_STAGE, STAGE_INTERVALS } from "@/entities/review";
import { PreviewCard } from "./PreviewCard";
import styles from "./HeroPreviews.module.css";

const CURRENT_STAGE = 3;

const RATING_OPTIONS = [
  { label: "Сложно", interval: "+1 день", Icon: AlertCircle, tone: styles.rateHard },
  { label: "Средне", interval: "+3 дня", Icon: Clock, tone: styles.rateMedium },
  { label: "Легко", interval: "+7 дней", Icon: CheckCircle2, tone: styles.rateEasy },
] as const;

/** Spaced-repetition assistant bar from the task page, with the real stage intervals. */
export const ReviewAssistantPreview = (): React.JSX.Element => (
  <PreviewCard>
    <div className={styles.assistantHead}>
      <span className={styles.botAvatar}>
        <Bot size={16} />
      </span>
      <div className={styles.assistantTexts}>
        <div className={styles.assistantName}>
          Интервальный помощник
          <span className={styles.dueBadge}>
            <RotateCcw size={11} />
            Пора повторить
          </span>
        </div>
        <p className={styles.assistantMessage}>
          Прошла неделя - освежим <b>debounce</b>? Оцени, как далась задача.
        </p>
      </div>
    </div>

    <div className={styles.rateRow}>
      {RATING_OPTIONS.map(({ label, interval, Icon, tone }) => (
        <span key={label} className={clsx(styles.rate, tone)}>
          <span className={styles.rateLabel}>
            <Icon size={12} />
            {label}
          </span>
          <span className={styles.rateInterval}>{interval}</span>
        </span>
      ))}
    </div>

    <ol className={styles.stages} aria-label="Интервалы повторения">
      {STAGE_INTERVALS.slice(1).map((days, index) => {
        const stage = index + 1;
        return (
          <li
            key={days}
            className={clsx(
              styles.stage,
              stage < CURRENT_STAGE && styles.stageDone,
              stage === CURRENT_STAGE && styles.stageCurrent
            )}
          >
            {stage === MAX_STAGE ? "Мастер" : `${days} д`}
          </li>
        );
      })}
    </ol>
  </PreviewCard>
);
