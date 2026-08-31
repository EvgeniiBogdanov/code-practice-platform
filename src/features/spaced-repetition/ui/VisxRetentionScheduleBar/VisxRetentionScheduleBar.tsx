import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";
import { clsx } from "clsx";
import { ReviewItem, isTaskDue, getLocalDateString, getStartOfLocalDay } from "@/entities/review";
import { Task } from "@/entities/task";
import styles from "./VisxRetentionScheduleBar.module.css";

interface RetentionScheduleBarInnerProps {
  width: number;
  height: number;
  reviews?: Record<string, ReviewItem>;
  allTasks?: Task[];
  margin?: { top: number; right: number; bottom: number; left: number };
}

function RetentionScheduleBarInner({
  width,
  height,
  reviews = {},
  allTasks = [],
  margin = { top: 20, right: 16, bottom: 32, left: 16 },
}: RetentionScheduleBarInnerProps) {
  const scheduleData = useMemo(() => {
    const todayStr = getLocalDateString();
    const todayStart = getStartOfLocalDay().getTime();

    const buckets = [
      {
        id: "today",
        label: "Сегодня",
        count: 0,
        gradientId: "visx-sched-today",
      },
      {
        id: "tomorrow",
        label: "Завтра",
        count: 0,
        gradientId: "visx-sched-tomorrow",
      },
      {
        id: "2-3d",
        label: "2-3 дня",
        count: 0,
        gradientId: "visx-sched-2-3d",
      },
      {
        id: "4-7d",
        label: "4-7 дней",
        count: 0,
        gradientId: "visx-sched-4-7d",
      },
      {
        id: "8-14d",
        label: "8-14 дней",
        count: 0,
        gradientId: "visx-sched-8-14d",
      },
      {
        id: "15-30d",
        label: "15-30 дней",
        count: 0,
        gradientId: "visx-sched-15-30d",
      },
      {
        id: "master",
        label: "Мастер",
        count: 0,
        gradientId: "visx-sched-master",
      },
    ];

    if (!reviews) return buckets;

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
  }, [reviews, allTasks]);

  const xMax = Math.max(0, width - margin.left - margin.right);
  const yMax = Math.max(0, height - margin.top - margin.bottom);

  const maxCount = useMemo(() => {
    const m = Math.max(...scheduleData.map((d) => d.count), 0);
    return Math.max(m, 4);
  }, [scheduleData]);

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: scheduleData.map((d) => d.id),
        padding: 0.28,
      }),
    [xMax, scheduleData]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, maxCount],
        nice: true,
      }),
    [yMax, maxCount]
  );

  if (width <= 0 || height <= 0) return null;

  return (
    <div className={styles.container}>
      <svg width={width} height={height} className={styles.svg}>
        <defs>
          <LinearGradient id="visx-sched-today" from="#ef4444" to="#b91c1c" vertical />
          <LinearGradient id="visx-sched-tomorrow" from="#f59e0b" to="#d97706" vertical />
          <LinearGradient id="visx-sched-2-3d" from="#38bdf8" to="#0284c7" vertical />
          <LinearGradient id="visx-sched-4-7d" from="#818cf8" to="#4f46e5" vertical />
          <LinearGradient id="visx-sched-8-14d" from="#a855f7" to="#7c3aed" vertical />
          <LinearGradient id="visx-sched-15-30d" from="#06b6d4" to="#0891b2" vertical />
          <LinearGradient id="visx-sched-master" from="#10b981" to="#059669" vertical />
        </defs>

        <Group top={margin.top} left={margin.left}>
          {scheduleData.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = d.count > 0 ? yMax - (yScale(d.count) ?? yMax) : 4;
            const barX = xScale(d.id) ?? 0;
            const barY = d.count > 0 ? (yScale(d.count) ?? yMax) : yMax - 4;
            const isDueNow = d.id === "today" && d.count > 0;

            return (
              <g key={`bar-${d.id}`}>
                <rect
                  x={barX}
                  y={0}
                  width={barWidth}
                  height={yMax}
                  rx={4}
                  className={styles.barTrack}
                />
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={d.count > 0 ? `url(#${d.gradientId})` : "var(--border-color)"}
                  rx={4}
                />
                {d.count > 0 && (
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 5}
                    className={clsx(styles.barCountText, isDueNow && styles.barCountDue)}
                    textAnchor="middle"
                  >
                    {d.count}
                  </text>
                )}
              </g>
            );
          })}

          <AxisBottom
            top={yMax}
            scale={xScale}
            hideAxisLine={true}
            hideTicks={true}
            tickFormat={(id) => {
              const item = scheduleData.find((d) => d.id === id);
              return item ? item.label : String(id);
            }}
            tickLabelProps={() => ({
              fill: "var(--text-muted)",
              fontSize: 10,
              textAnchor: "middle",
              fontWeight: 500,
              dy: "0.25em",
            })}
          />
        </Group>
      </svg>
    </div>
  );
}

export interface VisxRetentionScheduleBarProps {
  reviews?: Record<string, ReviewItem>;
  allTasks?: Task[];
  height?: number;
}

export function VisxRetentionScheduleBar({
  reviews,
  allTasks,
  height = 220,
}: VisxRetentionScheduleBarProps) {
  return (
    <div className={styles.chartWrapper} style={{ height, minHeight: height }}>
      <ParentSize debounceTime={0}>
        {({ width, height: pHeight }) => (
          <RetentionScheduleBarInner
            width={width}
            height={pHeight || height}
            reviews={reviews}
            allTasks={allTasks}
          />
        )}
      </ParentSize>
    </div>
  );
}
