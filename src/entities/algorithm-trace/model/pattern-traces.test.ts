import { describe, expect, it } from "vitest";
import { getAlgorithmDefinition } from "../config/algorithm-definitions";
import { parseAlgorithmInput } from "../lib/parse-algorithm-input";
import type { TraceStep } from "./algorithm-trace";

const trace = (id: string, raw: string, parameter = ""): readonly TraceStep[] => {
  const definition = getAlgorithmDefinition(id)!;
  const parsed = parseAlgorithmInput(definition, raw, parameter);
  if (!parsed.ok) throw new Error(parsed.error);
  return definition.build(parsed.input);
};
const result = (id: string, values: readonly number[], parameter = ""): TraceStep["result"] =>
  trace(id, JSON.stringify(values), parameter).at(-1)!.result;
const arrays = (length: number): number[][] =>
  length === 0
    ? [[]]
    : arrays(length - 1).flatMap((prefix) => [-1, 0, 2].map((value) => [...prefix, value]));

describe("pattern trace correctness", () => {
  it("compares hash and prefix algorithms with exhaustive independent oracles", () => {
    [0, 1, 2, 3, 4].flatMap(arrays).forEach((values) => {
      expect(result("algo6", values)).toBe(values.some((value, i) => values.indexOf(value) < i));
      expect(result("algo39", values)).toEqual(
        values.map((_, i) => values.slice(0, i + 1).reduce((a, b) => a + b, 0))
      );
      expect(result("algo13", values)).toBe(
        values.findIndex(
          (_, i) =>
            values.slice(0, i).reduce((a, b) => a + b, 0) ===
            values.slice(i + 1).reduce((a, b) => a + b, 0)
        )
      );
      for (const target of [-2, 0, 1, 4]) {
        let count = 0;
        values.forEach((_, left) =>
          values.forEach((_, right) => {
            if (
              right >= left &&
              values.slice(left, right + 1).reduce((a, b) => a + b, 0) === target
            )
              count++;
          })
        );
        expect(result("algo12", values, String(target))).toBe(count);
        const pair = result("algo4", values, String(target));
        const exists = values.some((value, i) =>
          values.some((other, j) => j > i && value + other === target)
        );
        expect(Array.isArray(pair) && pair.length === 2).toBe(exists);
        if (Array.isArray(pair) && pair.length) {
          expect(typeof pair[0]).toBe("number");
          expect(typeof pair[1]).toBe("number");
          if (typeof pair[0] === "number" && typeof pair[1] === "number") {
            expect(pair[0]).toBeLessThan(pair[1]);
            expect(values[pair[0]] + values[pair[1]]).toBe(target);
          }
        }
      }
      values.forEach((_, left) =>
        values.forEach((_, right) => {
          if (right >= left)
            expect(result("algo11", values, `${left}, ${right}`)).toBe(
              values.slice(left, right + 1).reduce((a, b) => a + b, 0)
            );
        })
      );
    });
  });

  it("checks both numeric windows against all contiguous subarrays", () => {
    [1, 2, 3, 4].flatMap(arrays).forEach((values) => {
      for (let k = 1; k <= values.length; k++) {
        const sums = values
          .slice(0, values.length - k + 1)
          .map((_, i) => values.slice(i, i + k).reduce((a, b) => a + b, 0));
        expect(result("algo9", values, String(k))).toBe(Math.max(...sums) / k);
      }
      const positive = values.map((value) => value + 2);
      for (const target of [1, 4, 9, 99]) {
        const lengths = positive.flatMap((_, left) =>
          positive.flatMap((_, right) =>
            right >= left && positive.slice(left, right + 1).reduce((a, b) => a + b, 0) >= target
              ? [right - left + 1]
              : []
          )
        );
        expect(result("algo10", positive, String(target))).toBe(
          lengths.length ? Math.min(...lengths) : 0
        );
      }
    });
  });

  it("checks exact search, insertion and every rotation", () => {
    for (let n = 0; n <= 10; n++) {
      const values = Array.from({ length: n }, (_, i) => i * 2 - 5);
      for (let target = -6; target <= 16; target++) {
        expect(result("algo14", values, String(target))).toBe(values.indexOf(target));
        const index = values.findIndex((value) => value >= target);
        expect(result("algo15", values, String(target))).toBe(index === -1 ? n : index);
        for (let shift = 0; shift < n; shift++) {
          const rotated = [...values.slice(shift), ...values.slice(0, shift)];
          expect(result("algo17", rotated, String(target))).toBe(rotated.indexOf(target));
        }
      }
    }
    for (let n = 1; n <= 16; n++) {
      for (let bad = 1; bad <= n; bad++) {
        const steps = trace("algo16", String(n), String(bad));
        expect(steps.at(-1)!.result).toBe(bad);
        steps.forEach((step) => {
          expect(step.band!.start).toBeLessThanOrEqual(bad - 1);
          expect(step.band!.end).toBeGreaterThanOrEqual(bad - 1);
        });
      }
    }
  });

  it("checks string multiplicities, groups and longest unique substrings", () => {
    const texts = ["", " ", "a", "aaaa", "abba", "pwwkew", "a b a", "AaA"];
    for (const text of texts) {
      const lengths = [...text].flatMap((_, left) =>
        [...text].flatMap((_, right) => {
          const substring = text.slice(left, right + 1);
          return right >= left && new Set(substring).size === substring.length
            ? [substring.length]
            : [];
        })
      );
      expect(trace("algo8", text).at(-1)!.result).toBe(Math.max(0, ...lengths));
      for (const other of [...texts, text.split("").reverse().join("")]) {
        expect(trace("algo5", text, other).at(-1)!.result).toBe(
          text.split("").sort().join("") === other.split("").sort().join("")
        );
      }
    }
    const steps = trace("algo7", '["eat", "tea", "tan", "ate", "nat", "bat", "", ""]');
    expect(steps.at(-1)!.result).toEqual([
      ["eat", "tea", "ate"],
      ["tan", "nat"],
      ["bat"],
      ["", ""],
    ]);
    expect(steps[0].panels![0].entries).toEqual([]);
    expect(
      steps.find((step) => step.line === "map.get(key).push(str)")!.panels![0].entries[0].value
    ).toBe('["eat"]');
  });
});

it.each([
  ["algo9", "[]", "1"],
  ["algo9", "1,2", "0"],
  ["algo9", "1,2", "3"],
  ["algo10", "0,1", "1"],
  ["algo10", "1,2", "0"],
  ["algo10", "-1,2", "2"],
  ["algo11", "1,2", "0,2"],
  ["algo11", "1,2", "1,0"],
  ["algo11", "1,2", ",1"],
  ["algo11", "[]", "0,0"],
  ["algo16", "0", "1"],
  ["algo16", "17", "1"],
  ["algo16", "5", "6"],
  ["algo17", "2,1,3", "1"],
  ["algo17", "1,1,2", "1"],
  ["algo7", '["123456789"]', ""],
  ["algo7", '[1,"a"]', ""],
  ["algo5", "a", "я"],
])("rejects invalid %s input %s / %s", (id, raw, parameter) => {
  expect(parseAlgorithmInput(getAlgorithmDefinition(id)!, raw, parameter).ok).toBe(false);
});
