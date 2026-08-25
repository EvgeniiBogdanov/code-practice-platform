import React, { useState, useMemo } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";
import { clsx } from "clsx";
import { MasteryStats } from "@/entities/review";
import styles from "./VisxMasteryPie.module.css";

interface MasteryPieInnerProps {
  width: number;
  height: number;
  masteryStats: MasteryStats;
  margin?: { top: number; right: number; bottom: number; left: number };
}

function MasteryPieInner({
  width,
  height,
  masteryStats,
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
}: MasteryPieInnerProps) {
  const [activeSegment, setActiveSegment] = useState<{
    id: string;
    pctText: string;
    sub: string;
  } | null>(null);

  const total = masteryStats.totalCount || 0;
  const totalReviewed = masteryStats.totalReviewed || 0;
  const learning = masteryStats.learning || 0;
  const reviewing = masteryStats.reviewing || 0;
  const mastered = masteryStats.mastered || 0;
  const unreviewed = masteryStats.unreviewed || 0;

  const data = useMemo(() => {
    return [
      {
        id: "mastered",
        label: "Мастер (30-60+ дней)",
        shortLabel: "Мастер",
        count: mastered,
        colorStart: "#10b981",
        colorEnd: "#059669",
        gradientId: "visx-mastery-mastered",
      },
      {
        id: "reviewing",
        label: "Закрепление (7-14 дней)",
        shortLabel: "Закрепление",
        count: reviewing,
        colorStart: "#f59e0b",
        colorEnd: "#d97706",
        gradientId: "visx-mastery-reviewing",
      },
      {
        id: "learning",
        label: "Изучение (1-3 дня)",
        shortLabel: "Изучение",
        count: learning,
        colorStart: "#f43f5e",
        colorEnd: "#e11d48",
        gradientId: "visx-mastery-learning",
      },
      {
        id: "unreviewed",
        label: "Не в графике",
        shortLabel: "Не в графике",
        count: unreviewed,
        colorStart: "#64748b",
        colorEnd: "#334155",
        gradientId: "visx-mastery-unreviewed",
      },
    ].filter((item) => item.count > 0);
  }, [learning, reviewing, mastered, unreviewed]);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2 + margin.top;
  const centerX = innerWidth / 2 + margin.left;
  const donutThickness = Math.max(18, Math.min(26, radius * 0.27));

  const masteryPercent = totalReviewed > 0 ? Math.round((mastered / totalReviewed) * 100) : 0;

  if (width <= 0 || height <= 0) return null;

  const currentPercent = activeSegment ? activeSegment.pctText : `${masteryPercent}%`;
  const currentSubtitle = activeSegment ? activeSegment.sub : "Мастерство";

  return (
    <div className={styles.container}>
      <svg width={width} height={height}>
        <defs>
          <LinearGradient id="visx-mastery-mastered" from="#10b981" to="#059669" vertical />
          <LinearGradient id="visx-mastery-reviewing" from="#f59e0b" to="#d97706" vertical />
          <LinearGradient id="visx-mastery-learning" from="#f43f5e" to="#e11d48" vertical />
          <LinearGradient id="visx-mastery-unreviewed" from="#64748b" to="#334155" vertical />
        </defs>

        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={(d) => d.count}
            outerRadius={radius}
            innerRadius={radius - donutThickness}
            cornerRadius={5}
            padAngle={0.035}
          >
            {(pie) =>
              pie.arcs.map((arc, index) => {
                const isHovered = activeSegment?.id === arc.data.id;
                const isDimmed = activeSegment && !isHovered;
                const pct = total > 0 ? Math.round((arc.data.count / total) * 100) : 0;

                return (
                  <g
                    key={`arc-${arc.data.id}-${index}`}
                    className={clsx(
                      styles.arcGroup,
                      isHovered && styles.hovered,
                      isDimmed && styles.dimmed
                    )}
                    onMouseEnter={() => {
                      setActiveSegment({
                        id: arc.data.id,
                        pctText: `${pct}%`,
                        sub: arc.data.shortLabel || arc.data.label,
                      });
                    }}
                    onMouseLeave={() => {
                      setActiveSegment(null);
                    }}
                  >
                    <path d={pie.path(arc) || ""} fill={`url(#${arc.data.gradientId})`} />
                  </g>
                );
              })
            }
          </Pie>

          <circle r={Math.max(0, radius - donutThickness - 4)} className={styles.centerDisc} />
          <text
            textAnchor="middle"
            y={-3}
            className={styles.centerPercent}
            fontSize={radius > 70 ? 23 : 19}
          >
            {currentPercent}
          </text>
          <text textAnchor="middle" y={14} className={styles.centerSubtitle}>
            {currentSubtitle}
          </text>
        </Group>
      </svg>
    </div>
  );
}

export interface VisxMasteryPieProps {
  masteryStats: MasteryStats;
  height?: number;
}

export function VisxMasteryPie({ masteryStats, height = 210 }: VisxMasteryPieProps) {
  return (
    <div style={{ width: "100%", height, minHeight: height }}>
      <ParentSize debounceTime={10}>
        {({ width, height: pHeight }) => (
          <MasteryPieInner width={width} height={pHeight || height} masteryStats={masteryStats} />
        )}
      </ParentSize>
    </div>
  );
}
