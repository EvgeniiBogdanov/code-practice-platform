import { memo } from "react";
import { ProgressKpiGrid } from "@/entities/progress";
import { HomeStats } from "../model/useHomeStats";

interface HomeKpiSummaryProps {
  stats: HomeStats;
}

export const HomeKpiSummary = memo(({ stats }: HomeKpiSummaryProps) => {
  return (
    <ProgressKpiGrid
      total={stats.grandTotal}
      solved={stats.grandSolved}
      percent={stats.grandPct}
      remaining={stats.grandRemaining}
      progressLabel="Общий прогресс"
    />
  );
});

HomeKpiSummary.displayName = "HomeKpiSummary";
