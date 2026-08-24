import React, { memo } from "react";
import { ProgressKpiGrid } from "@/entities/progress";
import { HomeStats } from "../model/use-home-stats";

interface HomeKpiSummaryProps {
  stats: HomeStats;
}

export const HomeKpiSummary = memo(({ stats }: HomeKpiSummaryProps): React.JSX.Element => {
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
