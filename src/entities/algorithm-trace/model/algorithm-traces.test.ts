import { describe, expect, it } from "vitest";
import { getAlgorithmDefinition } from "../config/algorithm-definitions";
import {
  VISUALIZED_ALGORITHM_IDS,
  hasAlgorithmVisualization,
} from "../config/available-visualizations";
import { parseAlgorithmInput } from "../lib/parse-algorithm-input";
import type { AlgorithmInput, TraceStep } from "./algorithm-trace";

const build = (
  id: string,
  values: readonly number[],
  parameter = 0,
  text = ""
): readonly TraceStep[] => {
  const input: AlgorithmInput = { values, parameter, text };
  const definition = getAlgorithmDefinition(id);
  if (!definition) throw new Error(`Unknown algorithm: ${id}`);
  return definition.build(input);
};
const last = (steps: readonly TraceStep[]): TraceStep => steps[steps.length - 1];

const arrays = (length: number): number[][] =>
  length === 0
    ? [[]]
    : arrays(length - 1).flatMap((prefix) => [-2, 0, 1, 2].map((value) => [...prefix, value]));

describe("algorithm traces", () => {
  it("registers exactly the seven tasks and excludes unrelated routes", () => {
    expect(VISUALIZED_ALGORITHM_IDS).toHaveLength(7);
    expect(hasAlgorithmVisualization("algo1", "algorithms")).toBe(true);
    expect(hasAlgorithmVisualization("algo1", "react")).toBe(false);
    expect(getAlgorithmDefinition("toString")).toBeUndefined();
  });

  it.each(VISUALIZED_ALGORITHM_IDS)(
    "builds every preset of %s without mutating its input or previous snapshots",
    (id) => {
      const definition = getAlgorithmDefinition(id)!;
      definition.examples.forEach((example) => {
        const parsed = parseAlgorithmInput(definition, example.input, example.parameter ?? "");
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        Object.freeze(parsed.input.values);
        const trace = definition.build(parsed.input);
        expect(trace.length).toBeGreaterThan(1);
        expect(last(trace).result).not.toBeUndefined();
        expect(new Set(trace.map((step) => step.id)).size).toBe(trace.length);
        expect(trace[0].values).toEqual(
          definition.inputKind === "text" ? parsed.input.text.split("") : parsed.input.values
        );
        trace.forEach((step) => {
          expect(step.line).toBeTruthy();
          expect(step.title).toBeTruthy();
          expect(step.explanation).toBeTruthy();
          step.pointers.forEach((pointer) => expect(Number.isInteger(pointer.index)).toBe(true));
        });
      });
    }
  );

  it("matches independent oracles for all arrays of length 0–4 over [-2,0,1,2]", () => {
    const inputs = [0, 1, 2, 3, 4].flatMap(arrays);
    inputs.forEach((values) => {
      const sorted = [...values].sort((a, b) => a - b);
      const kept = values.filter((number) => number !== 2);
      const removed = last(build("algo38", values, 2));
      expect(removed.result).toBe(kept.length);
      expect(removed.values.slice(0, kept.length)).toEqual(kept);
      const unique = [...new Set(sorted)];
      const deduplicated = last(build("algo36", sorted));
      expect(deduplicated.result).toBe(unique.length);
      expect(deduplicated.values.slice(0, unique.length)).toEqual(unique);
      expect(last(build("algo35", values)).values).toEqual([
        ...values.filter(Boolean),
        ...values.filter((number) => number === 0),
      ]);
      const partition = last(build("algo37", values)).values as readonly number[];
      expect([...partition].sort((a, b) => a - b)).toEqual(sorted);
      const firstOdd = partition.findIndex((number) => number % 2 !== 0);
      if (firstOdd >= 0)
        expect(partition.slice(firstOdd).every((number) => number % 2 !== 0)).toBe(true);
      verifySums(values, sorted);
    });
  });

  it.each([
    "",
    " ",
    ",:!",
    "A,b a",
    "race a car",
    "0P",
    "a",
    "11",
    "a1A",
    "A man, a plan, a canal: Panama",
  ])("checks palindrome %j with the ASCII contract", (text) => {
    const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    expect(last(build("algo2", [], 0, text)).result).toBe(
      normalized === [...normalized].reverse().join("")
    );
  });
});

const verifySums = (values: number[], sorted: number[]): void => {
  for (const target of [-4, 0, 1, 4]) {
    const pair = last(build("algo1", sorted, target)).result as readonly number[];
    const exists = sorted.some((value, i) =>
      sorted.some((other, j) => j > i && value + other === target)
    );
    expect(pair.length === 2).toBe(exists);
    if (exists) {
      expect(pair[0]).toBeLessThan(pair[1]);
      expect(sorted[pair[0] - 1] + sorted[pair[1] - 1]).toBe(target);
    }
  }
  const expected = new Set<string>();
  for (let i = 0; i < values.length; i++)
    for (let j = i + 1; j < values.length; j++)
      for (let k = j + 1; k < values.length; k++) {
        if (values[i] + values[j] + values[k] === 0)
          expected.add([values[i], values[j], values[k]].sort((a, b) => a - b).join(","));
      }
  const trace = build("algo3", values);
  const triples = last(trace).result as readonly (readonly number[])[];
  expect(new Set(triples.map((tuple) => tuple.join(",")))).toEqual(expected);
  expect(triples).toHaveLength(expected.size);
  expect(trace[0].found).toEqual([]);
};
