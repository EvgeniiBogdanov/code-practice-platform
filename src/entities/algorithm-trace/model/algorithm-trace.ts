export type TraceValue = number | string;
export type TraceTone = "primary" | "secondary" | "anchor";

export interface TracePointer {
  readonly label: string;
  readonly index: number;
  readonly tone: TraceTone;
}

export interface TracePanel {
  readonly kind: "buckets" | "window" | "prefix" | "balance" | "search";
  readonly label: string;
  readonly entries: readonly {
    readonly key: string;
    readonly value: string;
    readonly active?: boolean;
    readonly tone?: TraceTone;
  }[];
}

export interface TraceScene {
  readonly values: readonly TraceValue[];
  readonly pointers: readonly TracePointer[];
  readonly panels?: readonly TracePanel[];
  readonly band?: { readonly start: number; readonly end: number; readonly tone: TraceTone };
  readonly shape?: "box" | "token" | "diamond";
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
  readonly result?: number | boolean | readonly TraceValue[] | readonly (readonly TraceValue[])[];
}

export interface AlgorithmInput {
  readonly values: readonly number[];
  readonly text: string;
  readonly words?: readonly string[];
  readonly secondText?: string;
  readonly range?: readonly [number, number];
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
  readonly inputKind:
    "sorted" | "array" | "text" | "words" | "positive" | "window" | "rotated" | "versions";
  readonly inputLabel?: string;
  readonly inputHint?: string;
  readonly parameter?: "target" | "val" | "k" | "t" | "left, right" | "firstBad";
  readonly examples: readonly AlgorithmExample[];
  readonly build: (input: AlgorithmInput) => readonly TraceStep[];
}

export type ParsedAlgorithmInput =
  | { readonly ok: true; readonly input: AlgorithmInput }
  | { readonly ok: false; readonly error: string };
