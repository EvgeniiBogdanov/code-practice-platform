export type TraceValue = number | string;
export type TraceTone = "primary" | "secondary" | "anchor";

export interface TracePointer {
  readonly label: string;
  readonly index: number;
  readonly tone: TraceTone;
}

export interface TracePanel {
  readonly kind: "buckets" | "window" | "prefix" | "balance" | "search" | "sequence";
  readonly label: string;
  readonly entries: readonly {
    readonly key: string;
    readonly value: string;
    readonly active?: boolean;
    readonly tone?: TraceTone;
  }[];
}

export interface TraceStackLane {
  readonly label: string;
  readonly values: readonly TraceValue[];
}
export interface TraceStackAction {
  readonly kind: "push" | "pop" | "peek";
  readonly before: readonly TraceStackLane[];
  readonly items: readonly { readonly lane: number; readonly value: TraceValue }[];
}
export interface TraceStructure {
  readonly stacks?: readonly TraceStackLane[];
  readonly stackAction?: TraceStackAction;
  readonly kind: "stack" | "list" | "tree" | "grid" | "decisions";
  readonly label: string;
  readonly nodes: readonly {
    readonly id: string;
    readonly value: TraceValue;
    readonly column: number;
    readonly row: number;
    readonly caption?: string;
    readonly shape?: "circle" | "box" | "diamond";
    readonly state?: "active" | "frontier" | "done" | "rejected" | "muted";
  }[];
  readonly edges: readonly {
    readonly from: string;
    readonly to: string;
    readonly label?: string;
  }[];
}

export type StackOperation = readonly ["push", number] | readonly ["pop" | "top" | "getMin"];

export interface TraceScene {
  readonly structure?: TraceStructure;
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
  readonly result?:
    | number
    | string
    | boolean
    | null
    | readonly (TraceValue | null)[]
    | readonly (readonly TraceValue[])[];
}

export interface AlgorithmInput {
  readonly values: readonly number[];
  readonly text: string;
  readonly words?: readonly string[];
  readonly tree?: readonly (number | null)[];
  readonly secondTree?: readonly (number | null)[];
  readonly secondValues?: readonly number[];
  readonly grid?: readonly (readonly number[])[];
  readonly cell?: readonly [number, number];
  readonly operations?: readonly StackOperation[];
  readonly secondText?: string;
  readonly range?: readonly [number, number];
  readonly parameter: number;
}

export interface AlgorithmExample {
  readonly id: string;
  readonly label: string;
  readonly input: string;
  readonly parameter?: string;
  readonly isTask?: boolean;
}

export interface AlgorithmDefinition {
  readonly pattern: string;
  readonly invariant: string;
  readonly complexity: string;
  readonly inputKind:
    | "sorted"
    | "array"
    | "text"
    | "words"
    | "positive"
    | "window"
    | "rotated"
    | "versions"
    | "brackets"
    | "operations"
    | "lists"
    | "cycle"
    | "tree"
    | "trees"
    | "islands"
    | "oranges"
    | "flood"
    | "subsets"
    | "permutations"
    | "combinations"
    | "binary"
    | "parentheses";
  readonly inputLabel?: string;
  readonly inputHint?: string;
  readonly parameter?:
    "target" | "val" | "k" | "t" | "left, right" | "firstBad" | "pos" | "sr, sc, color";
  readonly examples: readonly AlgorithmExample[];
  readonly build: (input: AlgorithmInput) => readonly TraceStep[];
}

export type ParsedAlgorithmInput =
  | { readonly ok: true; readonly input: AlgorithmInput }
  | { readonly ok: false; readonly error: string };
