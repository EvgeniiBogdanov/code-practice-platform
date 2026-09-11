export const VISUALIZED_ALGORITHM_IDS = [
  "algo38",
  "algo36",
  "algo35",
  "algo2",
  "algo37",
  "algo1",
  "algo3",
  "algo4",
  "algo5",
  "algo6",
  "algo7",
  "algo8",
  "algo9",
  "algo10",
  "algo11",
  "algo12",
  "algo13",
  "algo14",
  "algo15",
  "algo16",
  "algo17",
  "algo39",
] as const;
export type VisualizedAlgorithmId = (typeof VISUALIZED_ALGORITHM_IDS)[number];

export const hasAlgorithmVisualization = (taskId: string, section: string): boolean =>
  section === "algorithms" && VISUALIZED_ALGORITHM_IDS.some((id) => id === taskId);
