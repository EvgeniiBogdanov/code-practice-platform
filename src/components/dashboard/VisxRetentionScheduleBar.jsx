import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";
import {
  isTaskDue,
  getLocalDateString,
  getStartOfLocalDay,
} from "../../utils/spacedRepetition";

function RetentionScheduleBarInner({
  width,
  height,
  reviews = {},
  allTasks = [],
  margin = { top: 20, right: 16, bottom: 32, left: 16 },
}) {
  // Compute schedule buckets
  const scheduleData = useMemo(() => {
    const todayStr = getLocalDateString();
    const todayStart = getStartOfLocalDay().getTime();

    const buckets = [
      {
        id: "today",
        label: "Сегодня",
        count: 0,
        colorStart: "#ef4444",
        colorEnd: "#dc2626",
        gradientId: "visx-sched-today",
      },
      {
        id: "tomorrow",
        label: "Завтра",
        count: 0,
        colorStart: "#f59e0b",
        colorEnd: "#d97706",
        gradientId: "visx-sched-tomorrow",
      },
      {
        id: "2-3d",
        label: "2-3 дня",
        count: 0,
        colorStart: "#38bdf8",
        colorEnd: "#0284c7",
        gradientId: "visx-sched-2-3d",
      },
      {
        id: "4-7d",
        label: "4-7 дней",
        count: 0,
        colorStart: "#818cf8",
        colorEnd: "#4f46e5",
        gradientId: "visx-sched-4-7d",
      },
      {
        id: "8-14d",
        label: "8-14 дней",
        count: 0,
        colorStart: "#a855f7",
        colorEnd: "#7c3aed",
        gradientId: "visx-sched-8-14d",
      },
      {
        id: "15-30d",
        label: "15-30 дней",
        count: 0,
        colorStart: "#06b6d4",
        colorEnd: "#0891b2",
        gradientId: "visx-sched-15-30d",
      },
      {
        id: "master",
        label: "Мастер",
        count: 0,
        colorStart: "#10b981",
        colorEnd: "#059669",
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

      const targetStr = rev.dueDate || (rev.nextReviewAt ? getLocalDateString(rev.nextReviewAt) : "");
      let diffDays = 1;

      if (targetStr) {
        const targetDate = rev.nextReviewAt ? new Date(rev.nextReviewAt) : new Date(`${targetStr}T00:00:00`);
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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <svg width={width} height={height}>
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
          {/* Bars */}
          {scheduleData.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = d.count > 0 ? yMax - yScale(d.count) : 4;
            const barX = xScale(d.id);
            const barY = d.count > 0 ? yScale(d.count) : yMax - 4;

            const isToday = d.id === "today";
            const isDueNow = isToday && d.count > 0;

            return (
              <g key={`bar-${d.id}`}>
                <rect
                  x={barX}
                  y={0}
                  width={barWidth}
                  height={yMax}
                  rx={4}
                  fill="rgba(255, 255, 255, 0.02)"
                />

                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={d.count > 0 ? `url(#${d.gradientId})` : "rgba(255, 255, 255, 0.08)"}
                  rx={4}
                  style={{
                    transition: "all 0.25s ease",
                    filter: isDueNow ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.45))" : undefined,
                  }}
                />

                {d.count > 0 && (
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 5}
                    fill={isDueNow ? "#ef4444" : "var(--text-main, #ffffff)"}
                    fontSize={11}
                    fontWeight={700}
                    fontFamily="var(--font-mono, monospace)"
                    textAnchor="middle"
                  >
                    {d.count}
                  </text>
                )}
              </g>
            );
          })}

          {/* Bottom X-Axis */}
          <AxisBottom
            top={yMax}
            scale={xScale}
            hideAxisLine={true}
            hideTicks={true}
            tickFormat={(id) => {
              const item = scheduleData.find((d) => d.id === id);
              return item ? item.label : id;
            }}
            tickLabelProps={() => ({
              fill: "var(--text-muted, rgba(255, 255, 255, 0.65))",
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

export const VisxRetentionScheduleBar = ({ reviews, allTasks, height = 210 }) => {
  return (
    <div style={{ width: "100%", height, minHeight: height }}>
      <ParentSize debounceTime={10}>
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
};

export default VisxRetentionScheduleBar;
