import { describe, expect, it } from "vitest";
import { findMatchingBracketPair } from "./bracketMatcher";

describe("findMatchingBracketPair", () => {
  it("pairs the bracket under or before the caret", () => {
    expect(findMatchingBracketPair("f(a[0])", 1)).toEqual([1, 6]);
    expect(findMatchingBracketPair("f(a[0])", 7)).toEqual([1, 6]);
    expect(findMatchingBracketPair("f(a[0])", 3)).toEqual([3, 5]);
  });

  it("returns null for no bracket or an unmatched one", () => {
    expect(findMatchingBracketPair("abc", 1)).toBeNull();
    expect(findMatchingBracketPair("f(a", 1)).toBeNull();
  });

  it("ignores brackets in strings and comments, in both directions", () => {
    const code = 'f("(", /* ) */ x) // )';
    expect(findMatchingBracketPair(code, 1)).toEqual([1, 16]);
    expect(findMatchingBracketPair(code, 17)).toEqual([1, 16]);
  });

  it("is not derailed by an apostrophe in a comment or prose", () => {
    const code = "// don't\nif (a) {\n  b();\n}";
    const open = code.indexOf("{");
    expect(findMatchingBracketPair(code, open)).toEqual([open, code.length - 1]);
    expect(findMatchingBracketPair(code, code.length)).toEqual([open, code.length - 1]);
  });

  it("handles escaped quotes", () => {
    const code = 'f("a\\")", b)';
    expect(findMatchingBracketPair(code, 1)).toEqual([1, code.length - 1]);
  });

  it("treats template expressions as code and template text as text", () => {
    const code = "x = `a ) ${f(1)} (`;";
    const open = code.indexOf("f(") + 1;
    expect(findMatchingBracketPair(code, open)).toEqual([open, open + 2]);
    const brace = code.indexOf("${") + 1;
    expect(findMatchingBracketPair(code, brace)).toEqual([brace, code.indexOf("}")]);
    expect(findMatchingBracketPair(code, code.indexOf(") ${"))).toBeNull();
  });

  it("recovers after a stray bracket", () => {
    const code = "{ ( }";
    expect(findMatchingBracketPair(code, 0)).toEqual([0, 4]);
  });
});
