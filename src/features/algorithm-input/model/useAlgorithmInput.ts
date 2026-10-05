import { useState } from "react";
import {
  parseAlgorithmInput,
  type AlgorithmDefinition,
  type TraceStep,
} from "@/entities/algorithm-trace";

export interface AlgorithmSession {
  readonly id: number;
  readonly steps: readonly TraceStep[];
  readonly input: string;
}
export interface AlgorithmInputState {
  readonly draft: string;
  readonly parameter: string;
  readonly exampleId: string;
  readonly error: string | null;
  readonly session: AlgorithmSession;
  readonly setDraft: (value: string) => void;
  readonly setParameter: (value: string) => void;
  readonly selectExample: (id: string) => void;
  readonly apply: () => void;
}

export const useAlgorithmInput = (definition: AlgorithmDefinition): AlgorithmInputState => {
  const first = definition.examples[0];
  const [draft, setDraft] = useState(first.input);
  const [parameter, setParameter] = useState(first.parameter ?? "");
  const [exampleId, setExampleId] = useState(first.id);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AlgorithmSession>(() => {
    const parsed = parseAlgorithmInput(definition, first.input, first.parameter ?? "");
    if (!parsed.ok) throw new Error(parsed.error);
    return { id: 0, steps: definition.build(parsed.input), input: first.input };
  });
  const submit = (input: string, value: string): boolean => {
    const parsed = parseAlgorithmInput(definition, input, value);
    if (!parsed.ok) {
      setError(parsed.error);
      return false;
    }
    setSession((previous) => ({
      id: previous.id + 1,
      steps: definition.build(parsed.input),
      input,
    }));
    setError(null);
    return true;
  };
  const selectExample = (id: string): void => {
    const example = definition.examples.find((item) => item.id === id);
    if (!example) return;
    setDraft(example.input);
    setParameter(example.parameter ?? "");
    setExampleId(id);
    submit(example.input, example.parameter ?? "");
  };
  const apply = (): void => {
    if (submit(draft, parameter)) setExampleId("custom");
  };
  return {
    draft,
    parameter,
    exampleId,
    error,
    session,
    setDraft,
    setParameter,
    selectExample,
    apply,
  };
};
