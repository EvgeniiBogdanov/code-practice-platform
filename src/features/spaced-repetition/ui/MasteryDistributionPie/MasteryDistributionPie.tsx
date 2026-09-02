import { useState, useMemo } from "react";
import { Pie, type PieTooltipProps } from "@nivo/pie";
import { useParentSize } from "@/shared/lib/hooks";
import { type MasteryStats } from "@/entities/review";
import styles from "./MasteryDistributionPie.module.css";

export interface PieChartDatum {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  color: string;
}

export interface MasteryDistributionPieProps {
  masteryStats: MasteryStats;
  height?: number;
}

const THEME = {
  tooltip: {
    container: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
    },
  },
};

export function MasteryDistributionPie({
  masteryStats,
  height = 210,
}: MasteryDistributionPieProps): React.JSX.Element {
  const [containerRef, { width: measuredWidth, height: measuredHeight }] =
    useParentSize<HTMLDivElement>({ width: 0, height });

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

  const data = useMemo<PieChartDatum[]>(() => {
    const items: PieChartDatum[] = [
      {
        id: "mastered",
        label: "Мастер (30-60+ дней)",
        shortLabel: "Мастер",
        value: mastered,
        color: "var(--color-mastery-mastered)",
      },
      {
        id: "reviewing",
        label: "Закрепление (7-14 дней)",
        shortLabel: "Закрепление",
        value: reviewing,
        color: "var(--color-mastery-reviewing)",
      },
      {
        id: "learning",
        label: "Изучение (1-3 дня)",
        shortLabel: "Изучение",
        value: learning,
        color: "var(--color-mastery-learning)",
      },
      {
        id: "unreviewed",
        label: "Не в графике",
        shortLabel: "Не в графике",
        value: unreviewed,
        color: "var(--color-mastery-unreviewed)",
      },
    ];

    const activeItems = items.filter((item) => item.value > 0);
    if (activeItems.length === 0) {
      return [
        {
          id: "empty",
          label: "Нет данных",
          shortLabel: "Нет данных",
          value: 1,
          color: "var(--border-color)",
        },
      ];
    }
    return activeItems;
  }, [learning, reviewing, mastered, unreviewed]);

  const masteryPercent =
    totalReviewed > 0 ? Math.round((mastered / totalReviewed) * 100) : 0;
  const currentPercent = activeSegment ? activeSegment.pctText : `${masteryPercent}%`;
  const currentSubtitle = activeSegment ? activeSegment.sub : "Мастерство";

  const renderTooltip = ({ datum }: PieTooltipProps<PieChartDatum>): React.JSX.Element => {
    if (datum.id === "empty") {
      return <div className={styles.tooltip}>Нет данных по задачам</div>;
    }
    const pct = total > 0 ? Math.round((datum.value / total) * 100) : 0;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipHeader}>
          <span className={styles.tooltipDot} style={{ backgroundColor: datum.data.color }} />
          <span className={styles.tooltipLabel}>{datum.data.label}</span>
        </div>
        <div className={styles.tooltipValue}>
          {datum.value} {datum.value === 1 ? "задача" : "задач"} ({pct}%)
        </div>
      </div>
    );
  };

  const chartWidth = measuredWidth > 0 ? measuredWidth : 220;
  const chartHeight = measuredHeight > 0 ? measuredHeight : height;

  return (
    <div
      ref={containerRef}
      className={styles.chartWrapper}
      style={{ height, minHeight: height }}
    >
      {chartWidth > 0 && chartHeight > 0 && (
        <div className={styles.container}>
          <Pie<PieChartDatum>
            width={chartWidth}
            height={chartHeight}
            data={data}
            id="id"
            value="value"
            colors={{ datum: "data.color" }}
            innerRadius={0.72}
            padAngle={data.length > 1 ? 2.5 : 0}
            cornerRadius={4}
            activeOuterRadiusOffset={3.5}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            tooltip={renderTooltip}
            onMouseEnter={(datum) => {
              if (datum.id === "empty") return;
              const pct = total > 0 ? Math.round((datum.value / total) * 100) : 0;
              setActiveSegment({
                id: String(datum.id),
                pctText: `${pct}%`,
                sub: datum.data.shortLabel || datum.data.label,
              });
            }}
            onMouseLeave={() => {
              setActiveSegment(null);
            }}
            animate={true}
            motionConfig="gentle"
            theme={THEME}
          />
          <div className={styles.centerOverlay}>
            <span className={styles.centerPercent}>{currentPercent}</span>
            <span className={styles.centerSubtitle}>{currentSubtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}
