import { describe, it, expect } from "vitest";
import { fuzzyScore } from "./fuzzyMatcher";

describe("fuzzyScore", () => {
  it("matches a subsequence that starts a word, like VS Code", () => {
    expect(fuzzyScore("getNameOfDeclaration", "gfd")?.matches).toEqual([0, 8, 9]);
    expect(fuzzyScore("getDefaultFormatCodeSettings", "gfd")).not.toBeNull();
  });

  it("rejects a first letter in the middle of a word", () => {
    expect(fuzzyScore("dialog", "log")).toBeNull();
    expect(fuzzyScore("console", "xyz")).toBeNull();
  });

  it("prefers word starts and consecutive runs", () => {
    const prefix = fuzzyScore("console", "con")?.score ?? 0;
    const scattered = fuzzyScore("customOrderName", "con")?.score ?? 0;
    expect(prefix).toBeGreaterThan(scattered);
    expect(fuzzyScore("getElementById", "gEBI")?.matches).toEqual([0, 3, 10, 12]);
  });

  it("matches everything for an empty query", () => {
    expect(fuzzyScore("anything", "")).toEqual({ score: 0, matches: [] });
  });
});
