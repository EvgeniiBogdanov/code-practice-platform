import { memo } from "react";
import { KpiGrid } from "@/shared/ui";

export interface SectionKpiGridProps {
  total: number;
  solved: number;
  percent: number;
  remaining: number;
  excludedCount?: number;
}

export const SectionKpiGrid = memo(
  ({ total, solved, percent, remaining, excludedCount }: SectionKpiGridProps) => {
    return (
      <KpiGrid
        total={total}
        solved={solved}
        percent={percent}
        remaining={remaining}
        excludedCount={excludedCount}
        progressLabel="Прогресс раздела"
      />
    );
  }
);

SectionKpiGrid.displayName = "SectionKpiGrid";
