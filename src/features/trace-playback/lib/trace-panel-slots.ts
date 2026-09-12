import type { TraceStep } from "@/entities/algorithm-trace";
import type { UiDataBoardPlaceholder } from "@/shared/ui/UiDataBoard";

export interface PanelCapacity {
  readonly maxCount: number;
  readonly placeholders: readonly UiDataBoardPlaceholder[];
}

export const computePanelCapacities = (
  steps?: readonly TraceStep[]
): readonly PanelCapacity[] => {
  if (!steps || steps.length === 0) {
    return [];
  }

  // Determine the maximum number of panels across all steps
  let maxPanelsCount = 0;
  for (const step of steps) {
    if (step.panels && step.panels.length > maxPanelsCount) {
      maxPanelsCount = step.panels.length;
    }
  }

  if (maxPanelsCount === 0) {
    return [];
  }

  const capacities: PanelCapacity[] = [];

  for (let panelIndex = 0; panelIndex < maxPanelsCount; panelIndex++) {
    let maxEntries = 0;
    const orderedKeys: string[] = [];
    const seenKeys = new Set<string>();

    for (const step of steps) {
      const panel = step.panels?.[panelIndex];
      if (panel) {
        if (panel.entries.length > maxEntries) {
          maxEntries = panel.entries.length;
        }
        for (const entry of panel.entries) {
          if (!seenKeys.has(entry.key)) {
            seenKeys.add(entry.key);
            orderedKeys.push(entry.key);
          }
        }
      }
    }

    const placeholders: UiDataBoardPlaceholder[] = Array.from(
      { length: maxEntries },
      (_, i) => {
        const key = orderedKeys[i];
        return {
          key: key !== undefined && key !== "" ? key : "—",
          value: "—",
        };
      }
    );

    capacities.push({
      maxCount: maxEntries,
      placeholders,
    });
  }

  return capacities;
};
