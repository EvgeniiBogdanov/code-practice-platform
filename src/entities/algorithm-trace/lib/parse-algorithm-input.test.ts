import { describe, expect, it } from "vitest";
import { parseAlgorithmInput } from "./parse-algorithm-input";

describe("visualization input validation", () => {
  it.each(["[1,2,3]", "1, 2, 3", "[]", "", "-999,0,999"])("accepts %j", (input) => {
    expect(parseAlgorithmInput({ inputKind: "array" }, input, "").ok).toBe(true);
  });
  it.each([
    "1,,2",
    "[1,]",
    "null",
    "{}",
    '"2"',
    "true",
    "[1,[2]]",
    "[1.2]",
    "[1000]",
    "[1e300]",
    "NaN",
    Array(17).fill(1).join(","),
    "<script>alert(1)</script>",
  ])("rejects %j", (input) => {
    expect(parseAlgorithmInput({ inputKind: "array" }, input, "").ok).toBe(false);
  });
  it("rejects unsorted input without silently changing it", () => {
    expect(parseAlgorithmInput({ inputKind: "sorted" }, "3,1,2", "").ok).toBe(false);
    expect(parseAlgorithmInput({ inputKind: "sorted" }, "-1,-1,0", "").ok).toBe(true);
  });
  it.each(["", " ", "abc", "1.5", "Infinity", "1000"])(
    "validates the scalar parameter %j",
    (parameter) => {
      expect(
        parseAlgorithmInput({ inputKind: "array", parameter: "val" }, "1,2", parameter).ok
      ).toBe(false);
    }
  );
  it("preserves spaces and punctuation and rejects unsupported strings", () => {
    expect(parseAlgorithmInput({ inputKind: "text" }, " A,b a ", "")).toEqual({
      ok: true,
      input: { values: [], parameter: 0, text: " A,b a " },
    });
    for (const text of ["а", "🙂", "\n", "a".repeat(33)])
      expect(parseAlgorithmInput({ inputKind: "text" }, text, "").ok).toBe(false);
  });
});
