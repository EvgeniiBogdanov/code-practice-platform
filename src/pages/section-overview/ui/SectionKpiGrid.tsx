import { memo } from "react";
import { KpiGrid } from "@/shared/ui";

export interface SectionKpiGridProps {
  total: number;
  solved: number;
  percent: number;
  remaining: number;
}

export const SectionKpiGrid = memo(({ total, solved, percent, remaining }: SectionKpiGridProps) => {
  return (
    <KpiGrid
      total={total}
      solved={solved}
      percent={percent}
      remaining={remaining}
      progressLabel="Прогресс раздела"
    />
  );
});

SectionKpiGrid.displayName = "SectionKpiGrid";
