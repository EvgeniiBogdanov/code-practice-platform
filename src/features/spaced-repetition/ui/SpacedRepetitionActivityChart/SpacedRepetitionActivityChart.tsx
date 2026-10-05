import { Fragment, memo, useEffect, useMemo, useRef } from "react";
import { clsx } from "clsx";
import { Tooltip, UiSkeleton } from "@/shared/ui";
import {
  buildActivityGrid,
  MAX_ACTIVITY_LEVEL,
  type ActivityCell,
  type ActivityLevel,
} from "../../lib/activityGrid";
import styles from "./SpacedRepetitionActivityChart.module.css";

export interface SpacedRepetitionActivityChartProps {
  activityByDate: Readonly<Record<string, number>>;
  endDate?: Date;
  className?: string;
  isLoading?: boolean;
}

const WEEKDAY_LABELS: readonly string[] = ["Пн", "", "Ср", "", "Пт", "", ""];
const LEGEND_LEVELS: readonly ActivityLevel[] = Array.from(
  { length: MAX_ACTIVITY_LEVEL + 1 },
  (_, level) => level as ActivityLevel
);

const LEVEL_CLASSES: Readonly<Record<ActivityLevel, string>> = {
  0: styles.level0,
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
  4: styles.level4,
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatReviewDate = (date: string): string =>
  dateFormatter.format(new Date(`${date}T00:00:00`));

const ActivityDay = memo(({ cell }: { cell: ActivityCell }): React.JSX.Element => (
  <Tooltip
    side="top"
    delayDuration={0}
    content={
      <>
        <strong>{cell.count > 0 ? `Решено: ${cell.count}` : "Нет решений"}</strong>
        {" · "}
        {formatReviewDate(cell.date)}
      </>
    }
  >
    <div className={clsx(styles.day, LEVEL_CLASSES[cell.level])} data-date={cell.date} />
  </Tooltip>
));

ActivityDay.displayName = "ActivityDay";

export const SpacedRepetitionActivityChart = memo(
  ({
    activityByDate,
    endDate,
    className,
    isLoading = false,
  }: Readonly<SpacedRepetitionActivityChartProps>): React.JSX.Element => {
    const endTimestamp = endDate?.getTime() ?? Date.now();
    const { weeks, total } = useMemo(
      () => buildActivityGrid(activityByDate, endTimestamp),
      [activityByDate, endTimestamp]
    );
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const scroller = scrollerRef.current;
      if (scroller) scroller.scrollLeft = scroller.scrollWidth;
    }, [isLoading]);

    return (
      <section
        className={clsx(styles.section, className)}
        {...(isLoading
          ? { role: "status", "aria-label": "Загрузка активности решений" }
          : { "aria-labelledby": "solution-activity-title" })}
      >
        {isLoading ? (
          <div className={styles.titleWrapper} aria-hidden="true">
            <UiSkeleton variant="rounded" width={145} height={13} radius={3} />
          </div>
        ) : (
          <div className={styles.header}>
            <h3 id="solution-activity-title" className={styles.title}>
              Активность решений
            </h3>
            <span className={styles.total}>{total} за последний год</span>
          </div>
        )}

        {isLoading ? (
          <UiSkeleton variant="rounded" radius={4} className={styles.chartPlaceholder} />
        ) : (
          <>
            <div ref={scrollerRef} className={styles.scroller}>
              <div
                className={styles.grid}
                role="img"
                aria-label={`Активность решений за последний год: ${total}`}
              >
                <span aria-hidden="true" />
                {WEEKDAY_LABELS.map((label, index) => (
                  <span key={index} className={styles.weekday} aria-hidden="true">
                    {label}
                  </span>
                ))}
                {weeks.map((week, weekIndex) => (
                  <Fragment key={weekIndex}>
                    <span className={styles.month} aria-hidden="true">
                      {week.monthLabel}
                    </span>
                    {week.days.map((cell, dayIndex) =>
                      cell ? (
                        <ActivityDay key={cell.date} cell={cell} />
                      ) : (
                        <div key={dayIndex} className={styles.dayEmpty} />
                      )
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
            <div className={styles.legend} aria-hidden="true">
              <span>Меньше</span>
              {LEGEND_LEVELS.map((level) => (
                <div key={level} className={clsx(styles.day, LEVEL_CLASSES[level])} />
              ))}
              <span>Больше</span>
            </div>
          </>
        )}
      </section>
    );
  }
);

SpacedRepetitionActivityChart.displayName = "SpacedRepetitionActivityChart";
