import { memo } from "react";
import { ProgressKpiGrid } from "@/entities/progress";

export interface SectionKpiGridProps {
  total: number;
  solved: number;
  percent: number;
  remaining: number;
}

export const SectionKpiGrid = memo(({ total, solved, percent, remaining }: SectionKpiGridProps) => {
  return (
    <ProgressKpiGrid
      total={total}
      solved={solved}
      percent={percent}
      remaining={remaining}
      progressLabel="Прогресс раздела"
    />
  );
});

SectionKpiGrid.displayName = "SectionKpiGrid";
