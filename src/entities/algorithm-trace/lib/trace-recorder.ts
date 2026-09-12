import type { TracePointer, TraceScene, TraceStep } from "../model/algorithm-trace";

export const pointerPair = (
  first: number,
  second: number,
  labels: readonly [string, string] = ["left", "right"]
): readonly TracePointer[] => [
  { label: labels[0], index: first, tone: "primary" },
  { label: labels[1], index: second, tone: "secondary" },
];

export const indices = (length: number, start = 0): number[] =>
  Array.from({ length: Math.max(0, length) }, (_, offset) => start + offset);

export const createTraceRecorder = (
  scene: () => TraceScene
): {
  steps: TraceStep[];
  add: (line: string, title: string, explanation: string, detail?: Partial<TraceStep>) => void;
} => {
  const steps: TraceStep[] = [];
  const add = (
    line: string,
    title: string,
    explanation: string,
    detail: Partial<TraceStep> = {}
  ): void => {
    const current = scene();
    steps.push({
      ...current,
      ...detail,
      id: `step-${steps.length}`,
      line,
      title,
      explanation,
      values: [...current.values],
      structure: current.structure
        ? {
            ...current.structure,
            stacks: current.structure.stacks?.map((stack) => ({
              ...stack,
              values: [...stack.values],
            })),
            stackAction: current.structure.stackAction
              ? {
                  ...current.structure.stackAction,
                  before: current.structure.stackAction.before.map((stack) => ({
                    ...stack,
                    values: [...stack.values],
                  })),
                  items: current.structure.stackAction.items.map((item) => ({ ...item })),
                }
              : undefined,
            nodes: current.structure.nodes.map((node) => ({ ...node })),
            edges: current.structure.edges.map((edge) => ({ ...edge })),
          }
        : undefined,
      pointers: (detail.pointers ?? current.pointers).map((pointer) => ({ ...pointer })),
      settled: [...(detail.settled ?? current.settled ?? [])],
      dimmed: [...(detail.dimmed ?? current.dimmed ?? [])],
      panels: (detail.panels ?? current.panels)?.map((panel) => ({
        ...panel,
        entries: panel.entries.map((entry) => ({ ...entry })),
      })),
      band: (detail.band ?? current.band) ? { ...(detail.band ?? current.band)! } : undefined,
      found: current.found?.map((tuple) => [...tuple]),
    });
  };
  return { steps, add };
};
