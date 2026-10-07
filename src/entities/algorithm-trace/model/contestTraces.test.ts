import { describe, expect, it } from "vitest";
import { getAlgorithmDefinition } from "../config/algorithmDefinitions";
import { parseAlgorithmInput } from "../lib/parseAlgorithmInput";
import type { TraceStep } from "./algorithmTrace";

const trace = (id: string, raw: string, parameter = ""): readonly TraceStep[] => {
  const definition = getAlgorithmDefinition(id)!;
  const parsed = parseAlgorithmInput(definition, raw, parameter);
  if (!parsed.ok) throw new Error(`${id} ${raw}: ${parsed.error}`);
  return definition.build(parsed.input);
};
const result = (id: string, raw: string, parameter = ""): TraceStep["result"] =>
  trace(id, raw, parameter).at(-1)!.result;
const rejected = (id: string, raw: string, parameter = ""): boolean =>
  !parseAlgorithmInput(getAlgorithmDefinition(id)!, raw, parameter).ok;
const product = <T>(items: readonly T[], length: number): T[][] =>
  length === 0
    ? [[]]
    : product(items, length - 1).flatMap((prefix) => items.map((item) => [...prefix, item]));
const sortedArrays = (values: readonly number[], maxLength: number): number[][] =>
  [...Array(maxLength + 1).keys()]
    .flatMap((length) => product(values, length))
    .filter((array) => array.every((n, i) => i === 0 || n >= array[i - 1]));

describe("array and merge traces", () => {
  it("finds disappeared numbers like a brute-force oracle", () => {
    for (let n = 1; n <= 5; n++) {
      product(
        [...Array(n).keys()].map((i) => i + 1),
        n
      ).forEach((nums) => {
        const expected = Array.from({ length: n }, (_, i) => i + 1).filter(
          (v) => !nums.includes(v)
        );
        expect(result("algo45", nums.join(", "))).toEqual(expected);
      });
    }
  });

  it("marks cells negative and keeps visited cells settled", () => {
    const steps = trace("algo45", "4, 3, 2, 7, 8, 2, 3, 1");
    expect(steps.some((step) => step.values.some((value) => Number(value) < 0))).toBe(true);
    expect(steps.at(-1)!.settled).toEqual([0, 1, 2, 3, 6, 7]);
  });

  it("matches the best seat distance by brute force", () => {
    for (let length = 2; length <= 8; length++) {
      product([0, 1], length)
        .filter((seats) => seats.includes(0) && seats.includes(1))
        .forEach((seats) => {
          const expected = Math.max(
            ...seats.flatMap((seat, i) =>
              seat === 1
                ? []
                : [Math.min(...seats.flatMap((other, j) => (other === 1 ? [Math.abs(i - j)] : [])))]
            )
          );
          expect(result("algo46", seats.join(", "))).toBe(expected);
        });
    }
  });

  it("computes the symmetric difference of sorted arrays", () => {
    const arrays = sortedArrays([0, 1, 2, 3], 4);
    arrays.forEach((a) =>
      arrays.forEach((b) => {
        const expected = [0, 1, 2, 3].filter((value) => a.includes(value) !== b.includes(value));
        expect(result("algo47", JSON.stringify([a, b]))).toEqual(expected);
      })
    );
  });

  it("builds the result row only from values that appear in exactly one array", () => {
    const last = trace("algo47", "[[1,2,3,5],[2,3,4,6]]").at(-1)!;
    const row = last.structure!.nodes.filter((node) => node.id.startsWith("r"));
    expect(row.map((node) => node.value)).toEqual([1, 4, 5, 6]);
    expect(last.structure!.nodes.filter((node) => node.state === "rejected")).toHaveLength(4);
  });

  it("finds the longest palindromic substring", () => {
    for (let length = 1; length <= 8; length++) {
      product(["a", "b"], length).forEach((letters) => {
        const text = letters.join("");
        let longest = 0;
        for (let i = 0; i < length; i++)
          for (let j = i; j < length; j++) {
            const part = text.slice(i, j + 1);
            if (part === [...part].reverse().join("")) longest = Math.max(longest, part.length);
          }
        const found = result("algo48", text) as string;
        expect(found.length).toBe(longest);
        expect(text.includes(found)).toBe(true);
        expect(found).toBe([...found].reverse().join(""));
      });
    }
    expect(result("algo48", "babad")).toBe("bab");
    expect(result("algo48", "cbbd")).toBe("bb");
  });

  it("finds the smallest common element of three sorted arrays", () => {
    const arrays = sortedArrays([0, 1, 2], 3);
    arrays.forEach((a) =>
      arrays.forEach((b) =>
        arrays.forEach((c) => {
          const common = [0, 1, 2].find((v) => a.includes(v) && b.includes(v) && c.includes(v));
          expect(result("algo51", JSON.stringify([a, b, c]))).toBe(common ?? null);
        })
      )
    );
  });

  it("expands ranges like split and flatMap", () => {
    const tokens = ["1", "3-5", "7-7", "0-2", "10"];
    [0, 1, 2, 3]
      .flatMap((length) => product(tokens, length))
      .forEach((parts) => {
        const expected = parts.flatMap((part) => {
          const [start, end = start] = part.split("-").map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        });
        expect(result("algo57", parts.join(","))).toEqual(expected);
      });
  });
});

describe("stack parsing traces", () => {
  it("simplifies paths like the reference algorithm", () => {
    const segments = ["a", "b", ".", "..", "", "..."];
    [1, 2, 3, 4]
      .flatMap((length) => product(segments, length))
      .forEach((parts) => {
        const path = `/${parts.join("/")}`;
        const stack: string[] = [];
        path.split("/").forEach((part) => {
          if (part === "..") stack.pop();
          else if (part && part !== ".") stack.push(part);
        });
        expect(result("algo49", path)).toBe(`/${stack.join("/")}`);
      });
  });

  it("decodes nested strings", () => {
    const cases: readonly (readonly [string, string])[] = [
      ["3[a]2[bc]", "aaabcbc"],
      ["3[a2[c]]", "accaccacc"],
      ["2[abc]3[cd]ef", "abcabccdcdcdef"],
      ["10[a]", "aaaaaaaaaa"],
      ["abc", "abc"],
      ["2[a2[b2[c]]]", "abccbccabccbcc"],
      ["a2[b]c", "abbc"],
    ];
    cases.forEach(([encoded, decoded]) => expect(result("algo50", encoded)).toBe(decoded));
  });

  it("evaluates expressions with precedence and truncating division", () => {
    const evaluate = (expression: string): number => {
      const tokens = expression.replace(/\s+/g, "").match(/\d+|[-+*/]/g)!;
      const terms: number[] = [Number(tokens[0])];
      for (let i = 1; i < tokens.length; i += 2) {
        const value = Number(tokens[i + 1]);
        const operator = tokens[i];
        if (operator === "*") terms[terms.length - 1] *= value;
        else if (operator === "/")
          terms[terms.length - 1] = Math.trunc(terms[terms.length - 1] / value);
        else terms.push(operator === "+" ? value : -value);
      }
      return terms.reduce((sum, term) => sum + term, 0);
    };
    const numbers = ["1", "2", "3", "7", "10"];
    const operators = ["+", "-", "*", "/"];
    [1, 2, 3].forEach((count) =>
      product(numbers, count).forEach((nums) =>
        product(operators, count - 1).forEach((ops) => {
          const expression = nums.map((num, i) => num + (ops[i] ?? "")).join("");
          expect(result("algo58", expression), expression).toBe(evaluate(expression));
        })
      )
    );
    expect(result("algo58", " 3+5 / 2 ")).toBe(5);
    expect(result("algo58", "14-3/2")).toBe(13);
  });
});

describe("graph traces", () => {
  const edgeSubsets = (n: number): number[][][] => {
    const all = Array.from({ length: n }, (_, a) =>
      Array.from({ length: n }, (_, b) => [a, b]).filter(([x, y]) => x !== y)
    ).flat();
    return product([0, 1], all.length).map((mask) => all.filter((_, i) => mask[i] === 1));
  };
  const hasOrder = (n: number, pairs: number[][]): boolean => {
    const permutations = (items: number[]): number[][] =>
      items.length <= 1
        ? [items]
        : items.flatMap((item, i) =>
            permutations(items.filter((_, j) => j !== i)).map((rest) => [item, ...rest])
          );
    return permutations(Array.from({ length: n }, (_, i) => i)).some((order) =>
      pairs.every(([course, need]) => order.indexOf(need) < order.indexOf(course))
    );
  };

  it("detects cycles in every graph with up to four courses", () => {
    for (let n = 1; n <= 4; n++) {
      edgeSubsets(n).forEach((pairs) => {
        expect(
          result("algo52", JSON.stringify(pairs), String(n)),
          `${n} ${JSON.stringify(pairs)}`
        ).toBe(hasOrder(n, pairs));
      });
    }
  });

  it("marks only cyclic courses as rejected at the end", () => {
    const last = trace("algo52", "[[1,0],[2,1],[1,2]]", "3").at(-1)!;
    expect(last.result).toBe(false);
    expect(
      last.structure!.nodes.filter((node) => node.state === "rejected").map((n) => n.value)
    ).toEqual([1, 2]);
    expect(last.structure!.nodes.find((node) => node.value === 0)?.state).toBe("done");
  });

  it("finds the critical path length for every forward dependency set", () => {
    [
      [3, 1, 4, 2],
      [1, 1, 1, 1],
      [2, 5, 1, 3],
    ].forEach((times) => {
      const forward = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ];
      product([0, 1], forward.length).forEach((mask) => {
        const relations = forward.filter((_, i) => mask[i] === 1);
        const memo = new Map<number, number>();
        const finish = (course: number): number => {
          if (!memo.has(course)) {
            const before = relations
              .filter(([, next]) => next === course)
              .map(([prev]) => finish(prev));
            memo.set(course, times[course - 1] + Math.max(0, ...before));
          }
          return memo.get(course)!;
        };
        const expected = Math.max(...[1, 2, 3, 4].map(finish));
        expect(result("algo53", JSON.stringify(relations), times.join(", "))).toBe(expected);
      });
    });
  });

  it("keeps graph node ids unique and every edge pointing at an existing node", () => {
    ["algo52", "algo53"].forEach((id) => {
      const definition = getAlgorithmDefinition(id)!;
      definition.examples.forEach((example) => {
        trace(id, example.input, example.parameter ?? "").forEach((step) => {
          const ids = step.structure!.nodes.map((node) => node.id);
          expect(new Set(ids).size).toBe(ids.length);
          step.structure!.edges.forEach((edge) => {
            expect(ids).toContain(edge.from);
            expect(ids).toContain(edge.to);
          });
        });
      });
    });
  });
});

describe("dynamic programming traces", () => {
  it("counts stair paths as Fibonacci numbers", () => {
    const fib = [1, 1];
    for (let i = 2; i <= 12; i++) fib.push(fib[i - 1] + fib[i - 2]);
    for (let n = 1; n <= 12; n++) expect(result("algo54", String(n))).toBe(fib[n]);
  });

  it("robs houses like a brute-force subset search", () => {
    for (let length = 1; length <= 5; length++) {
      product([0, 1, 2, 3], length).forEach((nums) => {
        const best = Math.max(
          ...product([0, 1], length)
            .filter((pick) => pick.every((v, i) => !(v && pick[i + 1])))
            .map((pick) => pick.reduce((sum, v, i) => sum + v * nums[i], 0))
        );
        expect(result("algo55", nums.join(", "))).toBe(best);
      });
    }
  });

  it("highlights robbed houses that sum to the answer", () => {
    const last = trace("algo55", "2, 7, 9, 3, 1").at(-1)!;
    expect(last.settled).toEqual([0, 2, 4]);
    expect(last.result).toBe(12);
  });

  it("finds the minimum number of coins like a breadth-first search", () => {
    const sets = [[1], [2], [1, 2, 5], [3, 4], [1, 3, 4], [2, 5, 6], [5]];
    sets.forEach((coins) => {
      for (let amount = 0; amount <= 14; amount++) {
        const distance = new Map<number, number>([[0, 0]]);
        const queue = [0];
        for (let head = 0; head < queue.length; head++)
          coins.forEach((coin) => {
            const next = queue[head] + coin;
            if (next <= amount && !distance.has(next)) {
              distance.set(next, distance.get(queue[head])! + 1);
              queue.push(next);
            }
          });
        expect(result("algo56", coins.join(", "), String(amount))).toBe(distance.get(amount) ?? -1);
      }
    });
  });
});

describe("input validation for contest visualizations", () => {
  it("rejects values outside the documented limits", () => {
    expect(rejected("algo45", "1, 5")).toBe(true);
    expect(rejected("algo46", "1, 1")).toBe(true);
    expect(rejected("algo47", "[[2,1],[1]]")).toBe(true);
    expect(rejected("algo48", "has space")).toBe(true);
    expect(rejected("algo49", "home/")).toBe(true);
    expect(rejected("algo50", "3[a")).toBe(true);
    expect(rejected("algo50", "99[a]")).toBe(true);
    expect(rejected("algo50", "a3")).toBe(true);
    expect(rejected("algo51", "[[1],[2]]")).toBe(true);
    expect(rejected("algo52", "[[1,1]]", "2")).toBe(true);
    expect(rejected("algo52", "[[2,0]]", "2")).toBe(true);
    expect(rejected("algo53", "[[1,2],[2,1]]", "1, 1")).toBe(true);
    expect(rejected("algo54", "13")).toBe(true);
    expect(rejected("algo55", "-1, 2")).toBe(true);
    expect(rejected("algo56", "1, 1", "3")).toBe(true);
    expect(rejected("algo56", "2", "15")).toBe(true);
    expect(rejected("algo57", "5-3")).toBe(true);
    expect(rejected("algo57", "1-999")).toBe(true);
    expect(rejected("algo58", "4/0")).toBe(true);
    expect(rejected("algo58", "1 2")).toBe(true);
  });

  it("accepts every documented example and builds a non-empty trace", () => {
    [
      "algo45",
      "algo46",
      "algo47",
      "algo48",
      "algo49",
      "algo50",
      "algo51",
      "algo52",
      "algo53",
      "algo54",
      "algo55",
      "algo56",
      "algo57",
      "algo58",
    ].forEach((id) => {
      const definition = getAlgorithmDefinition(id)!;
      expect(definition.examples.some((example) => example.isTask)).toBe(true);
      definition.examples.forEach((example) => {
        const steps = trace(id, example.input, example.parameter ?? "");
        expect(steps.length, `${id} ${example.id}`).toBeGreaterThan(1);
        steps.forEach((step) => expect(step.explanation.length).toBeGreaterThan(0));
      });
    });
  });
});
