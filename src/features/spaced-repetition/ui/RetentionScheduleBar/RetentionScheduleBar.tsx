import { useMemo } from "react";
import { Bar, type BarCustomLayerProps, type BarTooltipProps } from "@nivo/bar";
import { useParentSize } from "@/shared/lib/hooks";
import {
  type ReviewItem,
  isTaskDue,
  getLocalDateString,
  getStartOfLocalDay,
} from "@/entities/review";
import { type Task } from "@/entities/task";
import styles from "./RetentionScheduleBar.module.css";

export interface ScheduleBarDatum {
  id: string;
  label: string;
  count: number;
  color: string;
  [key: string]: string | number;
}

export interface RetentionScheduleBarProps {
  reviews?: Record<string, ReviewItem>;
  allTasks?: Task[];
  height?: number;
}

const THEME = {
  text: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 11,
    fill: "var(--text-muted, #94a3b8)",
  },
  axis: {
    ticks: {
      text: {
        fontSize: 10,
        fontWeight: 500,
        fill: "var(--text-muted, #94a3b8)",
      },
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

const BUCKET_DEFINITIONS = [
  { id: "today", label: "Сегодня", color: "var(--color-error)" },
  { id: "tomorrow", label: "Завтра", color: "var(--color-warning)" },
  { id: "2-3d", label: "2-3 дня", color: "var(--accent-cyan)" },
  { id: "4-7d", label: "4-7 дней", color: "var(--accent-blue)" },
  { id: "8-14d", label: "8-14 дней", color: "var(--accent-purple)" },
  { id: "15-30d", label: "15-30 дней", color: "var(--accent-cyan)" },
  { id: "master", label: "Мастер", color: "var(--color-success)" },
] as const;

function calculateScheduleBuckets(
  reviews?: Record<string, ReviewItem>,
  allTasks: Task[] = []
): ScheduleBarDatum[] {
  const buckets: ScheduleBarDatum[] = BUCKET_DEFINITIONS.map((def) => ({
    id: def.id,
    label: def.label,
    count: 0,
    color: def.color,
  }));

  if (!reviews) return buckets;

  const todayStart = getStartOfLocalDay().getTime();
  const taskMap = new Map(allTasks.map((t) => [String(t.id), t]));

  for (const [taskId, rev] of Object.entries(reviews)) {
    if (!rev || !rev.stage || rev.stage === 0) continue;

    const task = taskMap.get(String(taskId));
    if (!task) continue;

    if (isTaskDue(rev)) {
      buckets[0].count++;
      continue;
    }

    if (rev.stage >= 6) {
      buckets[6].count++;
      continue;
    }

    const targetStr =
      rev.dueDate || (rev.nextReviewAt ? getLocalDateString(rev.nextReviewAt) : "");
    let diffDays = 1;

    if (targetStr) {
      const targetDate = rev.nextReviewAt
        ? new Date(rev.nextReviewAt)
        : new Date(`${targetStr}T00:00:00`);
      const targetStart = getStartOfLocalDay(targetDate).getTime();
      diffDays = Math.round((targetStart - todayStart) / (1000 * 60 * 60 * 24));
    }

    if (diffDays <= 0) {
      buckets[0].count++;
    } else if (diffDays === 1) {
      buckets[1].count++;
    } else if (diffDays <= 3) {
      buckets[2].count++;
    } else if (diffDays <= 7) {
      buckets[3].count++;
    } else if (diffDays <= 14) {
      buckets[4].count++;
    } else if (diffDays <= 30) {
      buckets[5].count++;
    } else {
      buckets[6].count++;
    }
  }

  return buckets;
}

export function RetentionScheduleBar({
  reviews,
  allTasks = [],
  height = 220,
}: RetentionScheduleBarProps): React.JSX.Element {
  const [containerRef, { width: measuredWidth, height: measuredHeight }] =
    useParentSize<HTMLDivElement>({ width: 0, height });

  const scheduleData = useMemo(
    () => calculateScheduleBuckets(reviews, allTasks),
    [reviews, allTasks]
  );

  const maxCount = useMemo(() => {
    const m = Math.max(...scheduleData.map((d) => d.count), 0);
    return Math.max(m, 4);
  }, [scheduleData]);

  const renderTooltip = ({ data }: BarTooltipProps<ScheduleBarDatum>): React.JSX.Element => {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipHeader}>
          <span className={styles.tooltipDot} style={{ backgroundColor: data.color }} />
          <span className={styles.tooltipLabel}>{data.label}</span>
        </div>
        <div className={styles.tooltipValue}>
          {data.count} {data.count === 1 ? "задача" : "задач"}
        </div>
      </div>
    );
  };

  const CustomBarsWithTracks = ({
    bars,
    innerHeight,
  }: BarCustomLayerProps<ScheduleBarDatum>): React.JSX.Element => {
    return (
      <g>
        {bars.map((bar) => {
          const hasCount = (bar.data.value ?? 0) > 0;
          const count = bar.data.value ?? 0;
          const barHeight = hasCount ? bar.height : 4;
          const barY = hasCount ? bar.y : innerHeight - 4;

          return (
            <g key={bar.key}>
              <rect
                x={bar.x}
                y={0}
                width={bar.width}
                height={innerHeight}
                rx={4}
                className={styles.barTrack}
              />
              <rect
                x={bar.x}
                y={barY}
                width={bar.width}
                height={barHeight}
                fill={hasCount ? bar.color : "var(--border-color, rgba(255, 255, 255, 0.1))"}
                rx={4}
              />
              {hasCount && (
                <text
                  x={bar.x + bar.width / 2}
                  y={barY - 6}
                  textAnchor="middle"
                  className={styles.barCountText}
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const chartWidth = measuredWidth > 0 ? measuredWidth : 500;
  const chartHeight = measuredHeight > 0 ? measuredHeight : height;

  return (
    <div
      ref={containerRef}
      className={styles.chartWrapper}
      style={{ height, minHeight: height }}
    >
      {chartWidth > 0 && chartHeight > 0 && (
        <div className={styles.container}>
          <Bar<ScheduleBarDatum>
            width={chartWidth}
            height={chartHeight}
            data={scheduleData}
            keys={["count"]}
            indexBy="label"
            margin={{ top: 28, right: 16, bottom: 32, left: 16 }}
            padding={0.35}
            valueScale={{ type: "linear", min: 0, max: maxCount }}
            indexScale={{ type: "band", round: true }}
            colors={({ data }) => data.color}
            borderRadius={4}
            axisTop={null}
            axisRight={null}
            axisLeft={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 0,
            }}
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            isInteractive={true}
            tooltip={renderTooltip}
            theme={THEME}
            animate={true}
            layers={["grid", CustomBarsWithTracks, "axes"]}
          />
        </div>
      )}
    </div>
  );
}
