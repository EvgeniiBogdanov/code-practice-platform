import { describe, expect, it } from "vitest";
import { highlightCode } from "./codeHighlighter";
import { splitHighlightedLines } from "./splitHighlightedLines";

const textOf = (html: string): string => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent ?? "";
};

describe("splitHighlightedLines", () => {
  it("returns one entry per source line, empty lines included", () => {
    expect(splitHighlightedLines("a\n\nb")).toEqual(["a", "", "b"]);
    expect(splitHighlightedLines("a\n")).toEqual(["a", ""]);
  });

  it("closes a token at the line end and reopens it on the next line", () => {
    expect(splitHighlightedLines('<span class="hl-cmt">/* a\nb */</span> x')).toEqual([
      '<span class="hl-cmt">/* a</span>',
      '<span class="hl-cmt">b */</span> x',
    ]);
  });

  it("keeps nested tags balanced on every line", () => {
    const lines = splitHighlightedLines('<span class="a"><span class="b">1\n2</span>3\n4</span>');
    expect(lines).toEqual([
      '<span class="a"><span class="b">1</span></span>',
      '<span class="a"><span class="b">2</span>3</span>',
      '<span class="a">4</span>',
    ]);
  });

  it.each([
    ["main.jsx", "const s = `a\n${b}\nc`;\n/* x\n y */\nconst el = <div>\n  text\n</div>;"],
    ["styles.css", "/* a\nb */\n.a {\n  color: red;\n}"],
    ["index.html", "<div>\n  <!-- a\n  b -->\n</div>"],
  ])("preserves the text of every line of %s", (filepath, code) => {
    const lines = splitHighlightedLines(highlightCode(code, filepath));
    expect(lines.map(textOf)).toEqual(code.split("\n"));
  });
});
