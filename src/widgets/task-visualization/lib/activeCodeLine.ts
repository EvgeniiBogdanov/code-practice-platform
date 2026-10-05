import type { TraceStep } from "@/entities/algorithm-trace";

export const getActiveCodeLine = (
  code: string,
  step: Pick<TraceStep, "line" | "occurrence">
): number => {
  const matches = code
    .split("\n")
    .flatMap((line, index) => (line.includes(step.line) ? [index + 1] : []));
  return matches[step.occurrence ?? 0] ?? 0;
};

export const getSolutionCode = (source: string): string =>
  source.split("// Пример вызова:")[0].trim();
