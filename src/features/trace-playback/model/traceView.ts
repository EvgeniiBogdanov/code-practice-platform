import type { AlgorithmDefinition, TraceStep } from "@/entities/algorithm-trace";

export interface TraceSceneProps {
  readonly step: TraceStep;
  readonly steps?: readonly TraceStep[];
  readonly reducedMotion: boolean;
  readonly definition?: AlgorithmDefinition;
  readonly zoom?: number;
  readonly onZoomChange?: (zoom: number) => void;
}
export interface TraceExplanationProps {
  readonly step: TraceStep;
  readonly playing: boolean;
}

export interface TraceFallbackProps {
  readonly step: TraceStep;
  readonly onRetry: () => void;
}
