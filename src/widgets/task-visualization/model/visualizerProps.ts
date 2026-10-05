import type { ReactNode } from "react";
import type { AlgorithmDefinition, TraceStep } from "@/entities/algorithm-trace";

export interface TaskVisualizationProps {
  readonly taskId: string;
  readonly solution: string;
  readonly isActive?: boolean;
  readonly isFullscreen?: boolean;
  readonly onToggleFullscreen?: () => void;
}
export interface AlgorithmLabProps {
  readonly definition: AlgorithmDefinition;
  readonly solution: string;
  readonly isActive?: boolean;
  readonly isFullscreen?: boolean;
  readonly onToggleFullscreen?: () => void;
}
export interface TracePlayerProps {
  readonly steps: readonly TraceStep[];
  readonly code: string;
  readonly definition?: AlgorithmDefinition;
  readonly isActive?: boolean;
  readonly isFullscreen?: boolean;
  readonly toolbar?: ReactNode;
  readonly inputs?: ReactNode;
}
