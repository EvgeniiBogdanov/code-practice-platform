import { describe, expect, it } from "vitest";
import { getAlgorithmDefinition } from "../config/algorithm-definitions";
import { parseAlgorithmInput } from "../lib/parse-algorithm-input";
import type { TraceStep } from "./algorithm-trace";

const trace = (id: string, input: string, parameter = ""): readonly TraceStep[] => {
  const definition = getAlgorithmDefinition(id)!;
  const parsed = parseAlgorithmInput(definition, input, parameter);
  if (!parsed.ok) throw new Error(parsed.error);
  const before = JSON.stringify(parsed.input);
  const steps = definition.build(parsed.input);
  expect(JSON.stringify(parsed.input)).toBe(before);
  return steps;
};
const result = (id: string, input: string, parameter = ""): TraceStep["result"] =>
  trace(id, input, parameter).at(-1)!.result;

it.each([
  ["algo18", "{[()]}", "", true],
  ["algo18", "([)]", "", false],
  ["algo18", "", "", true],
  ["algo40", "abbaca", "", "ca"],
  ["algo40", "abba", "", ""],
  [
    "algo19",
    '[["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]',
    "",
    [-3, 0, -2],
  ],
  ["algo19", '[["push",2],["push",2],["pop"],["getMin"]]', "", [2]],
  ["algo24", "[3,9,20,null,null,15,7]", "", 3],
  ["algo24", "[1,null,2,3]", "", 3],
  ["algo25", "[1,null,2,3]", "", [1, 2, null, null, 3]],
  ["algo26", "[[1,2],[1,null,2]]", "", false],
  ["algo26", "[[1,2,3],[1,2,3]]", "", true],
  ["algo26", "[[],[]]", "", true],
  ["algo27", "[1,2,3,4,5]", "", 3],
  ["algo41", "[1,null,2,3]", "", [1, 2, 3]],
  ["algo28", "[3,9,20,null,null,15,7]", "", [[3], [9, 20], [15, 7]]],
  ["algo42", "[3,9,20,null,null,15,7]", "", 2],
  ["algo42", "[2,null,3,null,4]", "", 3],
  ["algo29", "[[1,1,0,0],[1,0,0,1],[0,0,1,1]]", "", 2],
  ["algo29", '[["1","0"],["0","1"]]', "", 2],
  ["algo30", "[[2,1,1],[1,1,0],[0,1,1]]", "", 4],
  ["algo30", "[[2,1,1],[0,1,1],[1,0,1]]", "", -1],
  ["algo30", "[[1]]", "", -1],
  ["algo30", "[[0,2]]", "", 0],
  [
    "algo43",
    "[[1,1,1],[1,1,0],[1,0,1]]",
    "1,1,2",
    [
      [2, 2, 2],
      [2, 2, 0],
      [2, 0, 1],
    ],
  ],
  ["algo43", "[[0,0,0]]", "0,0,0", [[0, 0, 0]]],
  ["algo33", "2,3,6,7", "7", [[2, 2, 3], [7]]],
  ["algo33", "2", "1", []],
  ["algo34", "3", "", ["((()))", "(()())", "(())()", "()(())", "()()()"]],
  ["algo44", "2", "", ["00", "01", "10", "11"]],
  ["algo44", "0", "", [""]],
  ["algo34", "0", "", [""]],
])("computes %s(%s)", (id, input, parameter, expected) => {
  expect(result(String(id), String(input), String(parameter))).toEqual(expected);
});

const arrays = (n: number): number[][] =>
  n ? arrays(n - 1).flatMap((a) => [-1, 0, 1].map((v) => [...a, v])) : [[]];
it("checks temperatures and list operations against independent array oracles", () => {
  for (const values of [0, 1, 2, 3, 4].flatMap(arrays)) {
    const raw = JSON.stringify(values);
    expect(result("algo21", raw)).toEqual([...values].reverse());
    expect(result("algo20", raw)).toEqual(
      values.map((v, i) => {
        const offset = values.slice(i + 1).findIndex((other) => other > v);
        return offset < 0 ? 0 : offset + 1;
      })
    );
    for (let pos = -1; pos < values.length; pos++)
      expect(result("algo23", raw, String(pos))).toBe(pos >= 0);
    const first = values.slice(0, 2).sort((a, b) => a - b),
      second = values.slice(2).sort((a, b) => a - b);
    expect(result("algo22", JSON.stringify([first, second]))).toEqual(
      [...values].sort((a, b) => a - b)
    );
  }
});

it("enumerates all subsets and permutations exactly once", () => {
  for (let n = 0; n <= 4; n++) {
    const values = Array.from({ length: n }, (_, i) => i + 1),
      raw = JSON.stringify(values);
    const subsets = result("algo31", raw);
    const expected = Array.from({ length: 2 ** n }, (_, mask) =>
      JSON.stringify(values.filter((_, i) => mask & (1 << i)))
    );
    if (!Array.isArray(subsets)) throw new Error("Expected subsets");
    expect(new Set(subsets.map((subset) => JSON.stringify(subset)))).toEqual(new Set(expected));
    expect(subsets.length).toBe(2 ** n);
    const permutations = result("algo32", raw);
    if (!Array.isArray(permutations)) throw new Error("Expected permutations");
    expect(permutations.length).toBe(values.reduce((factorial, v) => factorial * v, 1));
    expect(new Set(permutations.map((p) => JSON.stringify(p))).size).toBe(permutations.length);
    for (const permutation of permutations) {
      if (!Array.isArray(permutation)) throw new Error("Expected permutation");
      expect([...permutation].sort()).toEqual(values);
    }
  }
});

it("retains independent graph snapshots and real next pointers", () => {
  const reverse = trace("algo21", "1,2,3");
  expect(reverse[0].structure!.edges).toEqual([
    { from: "0", to: "1", label: "next" },
    { from: "1", to: "2", label: "next" },
  ]);
  expect(reverse.at(-1)!.structure!.edges).toEqual([
    { from: "1", to: "0", label: "next" },
    { from: "2", to: "1", label: "next" },
  ]);
  expect(trace("algo23", "1", "0")[0].structure!.edges).toEqual([
    { from: "0", to: "0", label: "next" },
  ]);
  const branches = trace("algo33", "2,3,6,7", "7");
  expect(branches[0].structure!.nodes).toHaveLength(1);
  expect(
    branches.some((step) => step.structure!.nodes.some((node) => node.state === "rejected"))
  ).toBe(true);
  expect(branches.some((step) => step.title === "Возврат · отменяем выбор")).toBe(true);
});

it("bounds worst-case permitted decision trees and validates edge endpoints", () => {
  for (const [id, input, parameter] of [
    ["algo31", "1,2,3,4,5", ""],
    ["algo32", "1,2,3,4", ""],
    ["algo33", "1,2,3,4", "10"],
    ["algo34", "3", ""],
    ["algo44", "4", ""],
  ]) {
    const steps = trace(id, input, parameter);
    expect(steps.length).toBeLessThan(1500);
    for (const step of steps) {
      const nodes = step.structure!.nodes,
        ids = new Set(nodes.map((node) => node.id));
      expect(nodes.length).toBeLessThan(500);
      expect(ids.size).toBe(nodes.length);
      for (const edge of step.structure!.edges) {
        expect(ids.has(edge.from)).toBe(true);
        expect(ids.has(edge.to)).toBe(true);
      }
    }
  }
});

describe("structured input validation", () => {
  it.each([
    ["algo18", "a", ""],
    ["algo19", '[["pop"]]', ""],
    ["algo19", '[["top"]]', ""],
    ["algo19", '[["push","1"]]', ""],
    ["algo19", '[["push",1],["pop"],["getMin"]]', ""],
    ["algo21", "1.5", ""],
    ["algo22", "[[2,1],[3]]", ""],
    ["algo22", "[[1]]", ""],
    ["algo23", "[]", "0"],
    ["algo23", "1,2", "2"],
    ["algo23", "1,2", ""],
    ["algo24", "[1,null,null,2]", ""],
    ["algo24", "[null,1]", ""],
    ["algo24", '["1"]', ""],
    ["algo26", "[[1],[2],[3]]", ""],
    ["algo29", "[]", ""],
    ["algo29", "[[1],[1,0]]", ""],
    ["algo29", "[[2]]", ""],
    ["algo30", "[[3]]", ""],
    ["algo43", "[[1]]", "1,0,2"],
    ["algo43", "[[1]]", ",0,2"],
    ["algo31", "1,1", ""],
    ["algo31", "1,2,3,4,5,6", ""],
    ["algo32", "1,2,3,4,5", ""],
    ["algo33", "0,1", "2"],
    ["algo33", "-1,2", "3"],
    ["algo33", "1,2", "11"],
    ["algo34", "4", ""],
    ["algo44", "5", ""],
    ["algo44", "", ""],
  ])("rejects invalid %s: %s / %s", (id, input, parameter) => {
    expect(parseAlgorithmInput(getAlgorithmDefinition(id)!, input, parameter).ok).toBe(false);
  });
});

it("records explicit immutable before/after stack operations", () => {
  const steps = trace("algo40", "abba");
  const operations = steps.filter((step) => step.structure?.stackAction);
  expect(operations.map((step) => step.structure!.stackAction!.kind)).toEqual([
    "push",
    "push",
    "pop",
    "pop",
  ]);
  expect(operations[2].structure!.stackAction!.before[0].values).toEqual(["a", "b"]);
  expect(operations[2].structure!.stacks![0].values).toEqual(["a"]);
  expect(operations[2].structure!.stackAction!.items).toEqual([{ lane: 0, value: "b" }]);
  expect(steps[0].structure!.stacks![0].values).toEqual([]);
  expect(steps.at(-1)!.structure!.stackAction).toBeUndefined();
  const min = trace("algo19", '[["push",3],["push",1],["pop"],["getMin"]]');
  const pop = min.find((step) => step.structure?.stackAction?.kind === "pop")!;
  expect(pop.structure!.stackAction!.before.map((stack) => stack.values)).toEqual([
    [3, 1],
    [3, 1],
  ]);
  expect(pop.structure!.stacks!.map((stack) => stack.values)).toEqual([[3], [3]]);
});
