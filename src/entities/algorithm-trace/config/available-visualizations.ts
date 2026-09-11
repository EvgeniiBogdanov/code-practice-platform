export const VISUALIZED_ALGORITHM_IDS = [
  "algo38",
  "algo36",
  "algo35",
  "algo2",
  "algo37",
  "algo1",
  "algo3",
] as const;
export type VisualizedAlgorithmId = (typeof VISUALIZED_ALGORITHM_IDS)[number];

export const hasAlgorithmVisualization = (taskId: string, section: string): boolean =>
  section === "algorithms" && VISUALIZED_ALGORITHM_IDS.some((id) => id === taskId);
