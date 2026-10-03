import React from "react";
import { Activity, CalendarClock, PieChart } from "lucide-react";
import { clsx } from "clsx";
import { UiNumberScramble } from "@/shared/ui";
import type { PracticePreviewProps } from "./WorkspacePreview";
import styles from "./SectionPreviews.module.css";
import local from "./PracticePreviews.module.css";

/** Demo learner stats; levels and colours follow the workspace mastery scale. */
const MASTERY = [
  { id: "due", label: "Пора повторить", value: 4 },
  { id: "learning", label: "Изучение", value: 12 },
  { id: "reviewing", label: "Повторение", value: 31 },
  { id: "mastered", label: "Мастер", value: 18 },
] as const;

const UPCOMING = [
  { title: "debounce", when: "сегодня", tone: styles.chipYellow },
  { title: "Promise.all", when: "завтра", tone: styles.chipBlue },
  { title: "Two Sum", when: "через 3 дня", tone: styles.chipGray },
  { title: "EventEmitter", when: "через 7 дней", tone: styles.chipGray },
] as const;

const WEEKS = 20;
const CELL = 12;

/** Deterministic pseudo-random activity that grows towards recent weeks. */
const HEATMAP = Array.from({ length: WEEKS * 7 }, (_, index) => {
  const seed = Math.sin(index * 78.233) * 43758.5453;
  const noise = seed - Math.floor(seed);
  const ramp = Math.floor(index / 7) / WEEKS;
  if (noise < 0.34 - ramp * 0.22) return 0;
  return Math.min(4, 1 + Math.floor(noise * 1.6 + ramp * 2.4));
});

const MASTERY_TOTAL = MASTERY.reduce((sum, level) => sum + level.value, 0);
const MASTERY_SEGMENTS = MASTERY.map((level, index) => ({
  ...level,
  x: (MASTERY.slice(0, index).reduce((sum, item) => sum + item.value, 0) / MASTERY_TOTAL) * 100,
  width: (level.value / MASTERY_TOTAL) * 100,
}));

/** Spaced repetition dashboard: mastery KPIs, activity heatmap and the review queue. */
export const ReviewStatsPreview = ({ isActive }: PracticePreviewProps): React.JSX.Element => (
  <div className={clsx(styles.stage, isActive && styles.active)}>
    <div className={clsx(styles.absolute, local.kpiRow)}>
      {MASTERY.map((level, index) => (
        <div
          key={level.id}
          className={clsx(styles.miniCard, styles.stg, local.kpiCard, styles[`i${index}`])}
        >
          <span className={clsx(local.kpiLabel, local[`tone_${level.id}`])}>{level.label}</span>
          <UiNumberScramble className={local.kpiValue} value={isActive ? level.value : 0} />
        </div>
      ))}
    </div>

    <div
      className={clsx(styles.absolute, styles.miniCard, styles.stg, styles.i4, local.heatmapCard)}
    >
      <p className={styles.miniTitle}>
        <Activity size={15} />
        Активность решений
      </p>
      <svg className={local.heatmap} viewBox={`0 0 ${WEEKS * CELL} ${7 * CELL}`}>
        {HEATMAP.map((level, index) => (
          <rect
            key={index}
            className={local[`heat_${level}`]}
            x={Math.floor(index / 7) * CELL}
            y={(index % 7) * CELL}
            width={CELL - 2}
            height={CELL - 2}
            rx="2"
          />
        ))}
      </svg>
    </div>

    <div className={clsx(styles.absolute, styles.miniCard, styles.stg, styles.i5, local.queueCard)}>
      <p className={styles.miniTitle}>
        <CalendarClock size={15} />
        Ближайшие повторы
      </p>
      <ul className={local.queue}>
        {UPCOMING.map((item) => (
          <li key={item.title} className={local.queueItem}>
            <span className={local.queueTitle}>{item.title}</span>
            <span className={clsx(styles.chip, item.tone)}>{item.when}</span>
          </li>
        ))}
      </ul>
    </div>

    <div
      className={clsx(styles.absolute, styles.miniCard, styles.stg, styles.i6, local.masteryCard)}
    >
      <p className={styles.miniTitle}>
        <PieChart size={15} />
        Распределение по уровням
      </p>
      <svg className={local.masteryBar} viewBox="0 0 100 6" preserveAspectRatio="none">
        {MASTERY_SEGMENTS.map((segment) => (
          <rect
            key={segment.id}
            className={local[`fill_${segment.id}`]}
            x={segment.x}
            width={segment.width}
            height="6"
          />
        ))}
      </svg>
      <ul className={local.legend}>
        {MASTERY.map((level) => (
          <li key={level.id} className={clsx(local.legendItem, local[`tone_${level.id}`])}>
            {level.label} · {level.value}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
