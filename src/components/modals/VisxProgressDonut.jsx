import React, { useState, useMemo } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";

function ProgressDonutInner({
  width,
  height,
  solved = 0,
  unsolved = 0,
  inProgress = 0,
  total = 0,
  solvedPct = 0,
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
}) {
  const [activeSegment, setActiveSegment] = useState(null);

  const data = useMemo(() => {
    return [
      {
        id: "solved",
        label: "Решено",
        count: solved,
        colorStart: "#10b981",
        colorEnd: "#059669",
        gradientId: "visx-stat-solved",
      },
      {
        id: "unsolved",
        label: "Не решено",
        count: unsolved,
        colorStart: "#f43f5e",
        colorEnd: "#e11d48",
        gradientId: "visx-stat-unsolved",
      },
      {
        id: "inProgress",
        label: "В процессе",
        count: inProgress,
        colorStart: "#38bdf8",
        colorEnd: "#2563eb",
        gradientId: "visx-stat-progress",
      },
    ].filter((item) => item.count > 0);
  }, [solved, unsolved, inProgress]);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2 + margin.top;
  const centerX = innerWidth / 2 + margin.left;
  const donutThickness = Math.max(18, Math.min(26, radius * 0.27));

  if (width <= 0 || height <= 0) return null;

  const currentPercent = activeSegment ? activeSegment.pctText : `${solvedPct}%`;
  const currentLabel = activeSegment ? activeSegment.label : "Решено";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={width} height={height}>
        <defs>
          <LinearGradient id="visx-stat-solved" from="#10b981" to="#059669" vertical />
          <LinearGradient id="visx-stat-unsolved" from="#f43f5e" to="#e11d48" vertical />
          <LinearGradient id="visx-stat-progress" from="#38bdf8" to="#2563eb" vertical />
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
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const isHovered = activeSegment?.id === arc.data.id;
                const isDimmed = activeSegment && !isHovered;
                const pct = total > 0 ? Math.round((arc.data.count / total) * 100) : 0;

                return (
                  <g
                    key={`modal-arc-${arc.data.id}-${index}`}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease",
                      transform: isHovered ? "scale(1.035)" : "scale(1)",
                      transformOrigin: "0 0",
                      opacity: isDimmed ? 0.38 : 1,
                    }}
                    onMouseEnter={() => {
                      setActiveSegment({
                        id: arc.data.id,
                        label: arc.data.label,
                        pctText: `${pct}%`,
                      });
                    }}
                    onMouseLeave={() => {
                      setActiveSegment(null);
                    }}
                  >
                    <path
                      d={pie.path(arc)}
                      fill={`url(#${arc.data.gradientId})`}
                    />
                  </g>
                );
              });
            }}
          </Pie>

          {/* Center Hub: Clean minimal disc with tabular percentage + category label */}
          <circle
            r={radius - donutThickness - 4}
            fill="var(--bg-subtle, rgba(255, 255, 255, 0.025))"
          />
          <text
            textAnchor="middle"
            y={-3}
            fill="var(--text-main, #ffffff)"
            fontSize={radius > 70 ? 23 : 19}
            fontWeight={800}
            fontFamily="var(--font-mono, monospace)"
            letterSpacing="-0.02em"
          >
            {currentPercent}
          </text>
          <text
            textAnchor="middle"
            y={14}
            fill="var(--text-muted, rgba(255, 255, 255, 0.65))"
            fontSize={radius > 70 ? 10 : 9}
            fontWeight={600}
            letterSpacing="0.04em"
            style={{ textTransform: "uppercase" }}
          >
            {currentLabel}
          </text>
        </Group>
      </svg>
    </div>
  );
}

export const VisxProgressDonut = ({
  solved = 0,
  unsolved = 0,
  inProgress = 0,
  total = 0,
  solvedPct = 0,
  height = 190,
}) => {
  return (
    <div style={{ width: "100%", height, minHeight: height }}>
      <ParentSize debounceTime={10}>
        {({ width, height: pHeight }) => (
          <ProgressDonutInner
            width={width}
            height={pHeight || height}
            solved={solved}
            unsolved={unsolved}
            inProgress={inProgress}
            total={total}
            solvedPct={solvedPct}
          />
        )}
      </ParentSize>
    </div>
  );
};

export default VisxProgressDonut;
