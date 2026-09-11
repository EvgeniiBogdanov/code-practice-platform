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
      pointers: (detail.pointers ?? current.pointers).map((pointer) => ({ ...pointer })),
      settled: [...(detail.settled ?? current.settled ?? [])],
      dimmed: [...(detail.dimmed ?? current.dimmed ?? [])],
      found: current.found?.map((tuple) => [...tuple]),
    });
  };
  return { steps, add };
};
