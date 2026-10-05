import { describe, expect, it } from "vitest";
import {
  MAX_MATCHES,
  findMatches,
  getAdjacentMatch,
  getLineStartOffset,
  replaceAll,
  replaceMatch,
  type FindOptions,
} from "./findReplace";

const plain: FindOptions = { caseSensitive: false, wholeWord: false, regex: false };

describe("findMatches", () => {
  it("finds every occurrence, ignoring case by default", () => {
    expect(findMatches("Foo foo FOO", "foo", plain).matches).toEqual([
      { start: 0, end: 3 },
      { start: 4, end: 7 },
      { start: 8, end: 11 },
    ]);
    expect(findMatches("Foo foo", "foo", { ...plain, caseSensitive: true }).matches).toHaveLength(
      1
    );
  });

  it("treats the query literally unless regex is on", () => {
    expect(findMatches("a.b axb", "a.b", plain).matches).toHaveLength(1);
    expect(findMatches("a.b axb", "a.b", { ...plain, regex: true }).matches).toHaveLength(2);
  });

  it("matches whole words only, with $ and _ as word characters", () => {
    const whole = { ...plain, wholeWord: true };
    expect(findMatches("get getter _get get$ get", "get", whole).matches).toEqual([
      { start: 0, end: 3 },
      { start: 21, end: 24 },
    ]);
  });

  it("reports an invalid regex instead of throwing", () => {
    const result = findMatches("abc", "(", { ...plain, regex: true });
    expect(result.matches).toEqual([]);
    expect(result.error).toBeTruthy();
  });

  it("skips empty matches and returns nothing for an empty query", () => {
    expect(findMatches("abc", "x*", { ...plain, regex: true }).matches).toEqual([]);
    expect(findMatches("abc", "", plain)).toEqual({ matches: [], error: null });
  });

  it("anchors ^ and $ per line and caps the number of matches", () => {
    expect(findMatches("a\na", "^a$", { ...plain, regex: true }).matches).toHaveLength(2);
    expect(findMatches("x".repeat(MAX_MATCHES + 50), "x", plain).matches).toHaveLength(MAX_MATCHES);
  });
});

describe("getAdjacentMatch", () => {
  const matches = [
    { start: 2, end: 4 },
    { start: 10, end: 12 },
  ];

  it("walks forward and backward and wraps around", () => {
    expect(getAdjacentMatch(matches, 0, 1)).toBe(0);
    expect(getAdjacentMatch(matches, 5, 1)).toBe(1);
    expect(getAdjacentMatch(matches, 11, 1)).toBe(0);
    expect(getAdjacentMatch(matches, 12, -1)).toBe(0);
    expect(getAdjacentMatch(matches, 2, -1)).toBe(1);
    expect(getAdjacentMatch([], 0, 1)).toBe(-1);
  });
});

describe("replaceMatch and replaceAll", () => {
  it("replaces one match and reports the inserted range", () => {
    const result = replaceMatch("a foo b", { start: 2, end: 5 }, "foo", "barbaz", plain);
    expect(result).toEqual({ newCode: "a barbaz b", inserted: { start: 2, end: 8 } });
  });

  it("keeps $ literal in plain mode and expands groups in regex mode", () => {
    expect(replaceMatch("a1", { start: 1, end: 2 }, "1", "$&$&", plain)?.newCode).toBe("a$&$&");
    const regex = { ...plain, regex: true };
    expect(
      replaceMatch("john smith", { start: 0, end: 10 }, "(\\w+) (\\w+)", "$2, $1", regex)?.newCode
    ).toBe("smith, john");
  });

  it("replaces all matches, also when the replacement contains the query", () => {
    expect(replaceAll("a a a", "a", "aa", plain)).toEqual({ newCode: "aa aa aa", count: 3 });
    expect(replaceAll("x", "y", "z", plain)).toEqual({ newCode: "x", count: 0 });
    expect(replaceAll("a1 b22", "\\d+", "#", { ...plain, regex: true }).newCode).toBe("a# b#");
  });
});

describe("getLineStartOffset", () => {
  it("returns the start of a line and clamps to the document", () => {
    const code = "ab\ncd\nef";
    expect(getLineStartOffset(code, 1)).toBe(0);
    expect(getLineStartOffset(code, 2)).toBe(3);
    expect(getLineStartOffset(code, 3)).toBe(6);
    expect(getLineStartOffset(code, 99)).toBe(6);
    expect(getLineStartOffset(code, 0)).toBe(0);
  });
});
