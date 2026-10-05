import type { AlgorithmDefinition } from "@/entities/algorithm-trace";

export interface TraceInputProps {
  readonly definition: AlgorithmDefinition;
  readonly exampleId: string;
  readonly draft: string;
  readonly parameter: string;
  readonly error: string | null;
  readonly onDraft: (value: string) => void;
  readonly onParameter: (value: string) => void;
  readonly onExample: (id: string) => void;
  readonly onApply: () => void;
}

export interface TraceParameterInputProps extends TraceInputProps {
  readonly errorId: string;
}
