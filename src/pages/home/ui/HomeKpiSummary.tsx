import React, { memo } from "react";
import { KpiGrid } from "@/shared/ui";
import { HomeStats } from "../model/use-home-stats";

interface HomeKpiSummaryProps {
  stats: HomeStats;
}

export const HomeKpiSummary = memo(({ stats }: HomeKpiSummaryProps): React.JSX.Element => {
  return (
    <KpiGrid
      total={stats.grandTotal}
      solved={stats.grandSolved}
      percent={stats.grandPct}
      remaining={stats.grandRemaining}
      excludedCount={stats.grandExcluded}
      progressLabel="Общий прогресс"
    />
  );
});

HomeKpiSummary.displayName = "HomeKpiSummary";
