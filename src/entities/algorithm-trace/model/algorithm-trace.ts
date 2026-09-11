export type TraceValue = number | string;
export type TraceTone = "primary" | "secondary" | "anchor";

export interface TracePointer {
  readonly label: string;
  readonly index: number;
  readonly tone: TraceTone;
}

export interface TraceScene {
  readonly values: readonly TraceValue[];
  readonly pointers: readonly TracePointer[];
  readonly settled?: readonly number[];
  readonly dimmed?: readonly number[];
  readonly found?: readonly (readonly number[])[];
}

export interface TraceStep extends TraceScene {
  readonly id: string;
  readonly line: string;
  readonly occurrence?: number;
  readonly title: string;
  readonly explanation: string;
  readonly formula?: string;
  readonly focus?: readonly number[];
  readonly transfer?: {
    readonly from: number;
    readonly to: number;
    readonly kind: "copy" | "swap";
  };
  readonly result?: number | boolean | readonly number[] | readonly (readonly number[])[];
}

export interface AlgorithmInput {
  readonly values: readonly number[];
  readonly text: string;
  readonly parameter: number;
}

export interface AlgorithmExample {
  readonly id: string;
  readonly label: string;
  readonly input: string;
  readonly parameter?: string;
}

export interface AlgorithmDefinition {
  readonly pattern: string;
  readonly invariant: string;
  readonly complexity: string;
  readonly inputKind: "sorted" | "array" | "text";
  readonly parameter?: "target" | "val";
  readonly examples: readonly AlgorithmExample[];
  readonly build: (input: AlgorithmInput) => readonly TraceStep[];
}

export type ParsedAlgorithmInput =
  | { readonly ok: true; readonly input: AlgorithmInput }
  | { readonly ok: false; readonly error: string };
