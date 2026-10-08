import { describe, expect, it } from "vitest";
import { getHighlightRanges } from "./codeHighlightRanges";

describe("getHighlightRanges", () => {
  it("maps highlighter tokens back to offsets in the code", () => {
    const code = "const a = 1;";

    const ranges = getHighlightRanges(code, "js");

    const keyword = ranges.find((range) => code.slice(range.from, range.to) === "const");
    expect(keyword?.className).toContain("hl-kw");
    expect(ranges.every((range) => range.from < range.to && range.to <= code.length)).toBe(true);
  });

  it("colours by the chosen language", () => {
    const code = "a { color: red; }";

    expect(getHighlightRanges(code, "css").length).toBeGreaterThan(0);
    expect(
      getHighlightRanges(code, "css").some((range) => range.className.includes("hl-css"))
    ).toBe(true);
  });

  it("leaves plain text, an empty block and a missing language uncoloured", () => {
    expect(getHighlightRanges("const a = 1;", null)).toEqual([]);
    expect(getHighlightRanges("const a = 1;", "notepad")).toEqual([]);
    expect(getHighlightRanges("", "js")).toEqual([]);
  });
});
