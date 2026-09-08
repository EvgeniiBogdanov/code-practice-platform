import { memo, useMemo } from "react";
import { TimeRange, type CalendarDatum, type CalendarTooltipProps } from "@nivo/calendar";
import { getLocalDateString } from "@/entities/review";
import { useParentSize } from "@/shared/lib/hooks";
import styles from "./SpacedRepetitionActivityChart.module.css";

export interface SpacedRepetitionActivityChartProps {
  activityByDate: Readonly<Record<string, number>>;
  endDate?: Date;
}

const CHART_HEIGHT = 112;
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

interface NivoActivityCalendarProps {
  data: CalendarDatum[];
  from: string;
  to: string;
}

const NivoActivityCalendar = ({
  data,
  from,
  to,
}: Readonly<NivoActivityCalendarProps>): React.JSX.Element => {
  const [containerRef, { width }] = useParentSize<HTMLDivElement>({
    width: 0,
    height: CHART_HEIGHT,
  });

  return (
    <div
      ref={containerRef}
      className={styles.chart}
      role="img"
      aria-label="Активность решений за последний год"
    >
      {width > 0 ? (
        <TimeRange
          width={width}
          height={CHART_HEIGHT}
          data={data}
          from={from}
          to={to}
          direction="horizontal"
          firstWeekday="monday"
          weekdays={["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]}
          weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
          weekdayLegendOffset={24}
          monthLegend={formatMonth}
          monthLegendOffset={8}
          daySpacing={2}
          dayRadius={2}
          dayBorderWidth={1}
          dayBorderColor="var(--border-color)"
          emptyColor="var(--state-hover)"
          colors={CALENDAR_COLORS}
          minValue={0}
          maxValue={4}
          margin={{ top: 16, right: 8, bottom: 0, left: 8 }}
          theme={CALENDAR_THEME}
          tooltip={ReviewActivityTooltip}
          role="presentation"
        />
      ) : null}
    </div>
  );
};

const getActivityRange = (endTimestamp: number): { from: string; to: string } => {
  const endDate = new Date(endTimestamp);
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  startDate.setDate(startDate.getDate() - 364);
  return { from: getLocalDateString(startDate), to: getLocalDateString(endDate) };
};

export const SpacedRepetitionActivityChart = memo(
  ({
    activityByDate,
    endDate,
  }: Readonly<SpacedRepetitionActivityChartProps>): React.JSX.Element => {
    const endTimestamp = endDate?.getTime() ?? Date.now();
    const { from, to } = getActivityRange(endTimestamp);
    const data = useMemo<CalendarDatum[]>(
      () =>
        Object.entries(activityByDate)
          .filter(([day, count]) => day >= from && day <= to && count > 0)
          .map(([day, value]) => ({ day, value }))
          .sort((first, second) => first.day.localeCompare(second.day)),
      [activityByDate, from, to]
    );

    return (
      <section className={styles.section} aria-labelledby="solution-activity-title">
        <h3 id="solution-activity-title" className={styles.title}>
          Активность решений
        </h3>
        <NivoActivityCalendar data={data} from={from} to={to} />
      </section>
    );
  }
);

SpacedRepetitionActivityChart.displayName = "SpacedRepetitionActivityChart";
