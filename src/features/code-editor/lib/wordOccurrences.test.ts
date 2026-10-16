import { describe, expect, it } from "vitest";
import { MARKUP_WORD, findWordOccurrences } from "./wordOccurrences";

const words = (code: string, ranges: Array<{ start: number; end: number }>): string[] =>
  ranges.map(({ start, end }) => code.slice(start, end));

describe("findWordOccurrences", () => {
  it("finds whole words only", () => {
    const code = "count counter count_x count";
    const ranges = findWordOccurrences(code, 2);
    expect(ranges).toEqual([
      { start: 0, end: 5 },
      { start: 22, end: 27 },
    ]);
  });

  it("uses the word that ends at the caret", () => {
    const code = "a = value; value";
    expect(words(code, findWordOccurrences(code, "a = value".length))).toEqual(["value", "value"]);
  });

  it("returns nothing between words", () => {
    expect(findWordOccurrences("a  +  b", 3)).toEqual([]);
  });

  it("treats a dashed class name as one word in markup", () => {
    const code = '.card-title {}\n.card {}\n<div class="card-title">';
    expect(words(code, findWordOccurrences(code, 3, MARKUP_WORD))).toEqual([
      "card-title",
      "card-title",
    ]);
  });
});
