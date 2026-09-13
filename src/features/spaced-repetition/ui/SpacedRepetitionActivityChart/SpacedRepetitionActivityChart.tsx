import { memo, useMemo } from "react";
import { clsx } from "clsx";
import { TimeRange, type CalendarDatum, type CalendarTooltipProps } from "@nivo/calendar";
import { getLocalDateString } from "@/entities/review";
import { useParentSize } from "@/shared/lib/hooks";
import { UiSkeleton } from "@/shared/ui";
import styles from "./SpacedRepetitionActivityChart.module.css";

export interface SpacedRepetitionActivityChartProps {
  activityByDate: Readonly<Record<string, number>>;
  endDate?: Date;
  className?: string;
  isLoading?: boolean;
}

export const CHART_HEIGHT = 112;
export const MARGIN_TOP = 20;
export const MARGIN_BOTTOM = 12;
export const MARGIN_LEFT = 16;
export const BASE_MARGIN_RIGHT = 16;
export const WEEKDAY_LEGEND_OFFSET = 24;
export const DAY_SPACING = 2;
export const NUM_ROWS = 7;

const CALENDAR_COLORS = [
  "var(--accent-green-bg)",
  "var(--accent-green-border)",
  "var(--accent-green)",
  "var(--accent-green-hover)",
];
const CALENDAR_THEME = {
  labels: {
    text: {
      fill: "var(--fg-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: 9,
    },
  },
  tooltip: {
    container: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
    },
  },
};

const formatReviewDate = (date: string): string => {
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
  return formattedDate;
};

const formatMonth = (_year: number, _month: number, date: Date): string =>
  new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(date);

const ReviewActivityTooltip = ({ day, value }: CalendarTooltipProps): React.JSX.Element => {
  const count = Number(value);
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipDate}>{formatReviewDate(day)}</span>
      <span className={styles.tooltipValue}>Решено: {count}</span>
    </div>
  );
};

export interface ChartLayout {
  chartHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getActualCols = (from: Date, to: Date): number => {
  let mondays = 0;
  const current = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  current.setDate(current.getDate() + 1);
  while (current <= end) {
    if (current.getDay() === 1) {
      mondays++;
    }
    current.setDate(current.getDate() + 1);
  }
  return mondays + 1;
};

export const computeChartLayout = (width: number, from: string, to: string): ChartLayout => {
  if (width <= 0) {
    return {
      chartHeight: CHART_HEIGHT,
      margin: {
        top: MARGIN_TOP,
        right: BASE_MARGIN_RIGHT,
        bottom: MARGIN_BOTTOM,
        left: MARGIN_LEFT,
      },
    };
  }

  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  const diffDays = Math.max(0, Math.round((toDate.getTime() - fromDate.getTime()) / 86400000));
  const totalDaysNivo = fromDate.getDay() + diffDays;
  const nivoCols = Math.max(1, Math.ceil(totalDaysNivo / 7));
  const actualCols = getActualCols(fromDate, toDate);

  const initialInnerWidth = Math.max(0, width - MARGIN_LEFT - BASE_MARGIN_RIGHT);
  const initialAvailWidth = Math.max(0, initialInnerWidth - WEEKDAY_LEGEND_OFFSET);
  const estCellWidth = Math.max(0, (initialAvailWidth - DAY_SPACING * (nivoCols + 1)) / nivoCols);

  const marginRight =
    actualCols > nivoCols
      ? BASE_MARGIN_RIGHT + estCellWidth * (actualCols - nivoCols)
      : BASE_MARGIN_RIGHT;

  const innerWidth = Math.max(0, width - MARGIN_LEFT - marginRight);
  const availableWidth = Math.max(0, innerWidth - WEEKDAY_LEGEND_OFFSET);
  const cellSize = Math.max(0, (availableWidth - DAY_SPACING * (nivoCols + 1)) / nivoCols);
  const neededInnerHeight = NUM_ROWS * cellSize + DAY_SPACING * (NUM_ROWS + 1);

  const chartHeight = Math.max(
    CHART_HEIGHT,
    Math.ceil(neededInnerHeight + MARGIN_TOP + MARGIN_BOTTOM)
  );

  return {
    chartHeight,
    margin: {
      top: MARGIN_TOP,
      right: Math.ceil(marginRight),
      bottom: MARGIN_BOTTOM,
      left: MARGIN_LEFT,
    },
  };
};

export const getActivityRange = (endTimestamp: number): { from: string; to: string } => {
  const endDate = new Date(endTimestamp);
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  startDate.setDate(startDate.getDate() - 364);
  return { from: getLocalDateString(startDate), to: getLocalDateString(endDate) };
};

export const SpacedRepetitionActivityChart = memo(
  ({
    activityByDate,
    endDate,
    className,
    isLoading = false,
  }: Readonly<SpacedRepetitionActivityChartProps>): React.JSX.Element => {
    const endTimestamp = endDate?.getTime() ?? Date.now();
    const { from, to } = useMemo(() => getActivityRange(endTimestamp), [endTimestamp]);
    const data = useMemo<CalendarDatum[]>(
      () =>
        Object.entries(activityByDate)
          .filter(([day, count]) => day >= from && day <= to && count > 0)
          .map(([day, value]) => ({ day, value }))
          .sort((first, second) => first.day.localeCompare(second.day)),
      [activityByDate, from, to]
    );

    const [containerRef, { width }] = useParentSize<HTMLDivElement>({
      width: 0,
      height: CHART_HEIGHT,
    });

    const { chartHeight, margin } = useMemo(
      () => computeChartLayout(width, from, to),
      [width, from, to]
    );

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
          <h3 id="solution-activity-title" className={styles.title}>
            Активность решений
          </h3>
        )}

        <div
          ref={containerRef}
          className={styles.chart}
          {...(isLoading
            ? { "aria-hidden": "true" }
            : { role: "img", "aria-label": "Активность решений за последний год" })}
        >
          {isLoading ? (
            <UiSkeleton
              variant="rounded"
              width="100%"
              height={chartHeight}
              radius={4}
              className={styles.chartPlaceholder}
            />
          ) : width > 0 ? (
            <TimeRange
              width={width}
              height={chartHeight}
              data={data}
              from={from}
              to={to}
              direction="horizontal"
              firstWeekday="monday"
              weekdays={["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]}
              weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
              weekdayLegendOffset={WEEKDAY_LEGEND_OFFSET}
              monthLegend={formatMonth}
              monthLegendOffset={8}
              daySpacing={DAY_SPACING}
              dayRadius={2}
              dayBorderWidth={1}
              dayBorderColor="var(--border-color)"
              emptyColor="var(--state-hover)"
              colors={CALENDAR_COLORS}
              minValue={0}
              maxValue={4}
              margin={margin}
              theme={CALENDAR_THEME}
              tooltip={ReviewActivityTooltip}
              role="presentation"
            />
          ) : null}
        </div>
      </section>
    );
  }
);

SpacedRepetitionActivityChart.displayName = "SpacedRepetitionActivityChart";
