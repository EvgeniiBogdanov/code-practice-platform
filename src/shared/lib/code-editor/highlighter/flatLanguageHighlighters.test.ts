import { describe, expect, it } from "vitest";
import { highlightCode } from "./codeHighlighter";

/** The text of every `<span class="…">` that carries a class matching `className`. */
const spans = (html: string, className: string): string[] =>
  [...html.matchAll(/<span class="([^"]*)">([^<]*)<\/span>/g)]
    .filter(([, classes]) => classes.split(" ").includes(className))
    .map(([, , text]) => text);

describe("JSON highlighting", () => {
  const json = '{ "name": "Ann", "age": 30, "ok": true, "none": null, "tags": ["a"] }';

  it("tells keys from string values and colours numbers, literals and punctuation", () => {
    const html = highlightCode(json, "json");

    expect(spans(html, "hl-prop")).toEqual(['"name"', '"age"', '"ok"', '"none"', '"tags"']);
    expect(spans(html, "hl-str")).toEqual(['"Ann"', '"a"']);
    expect(spans(html, "hl-num")).toEqual(["30"]);
    expect(spans(html, "hl-bool")).toEqual(["true", "null"]);
    expect(spans(html, "hl-punct")).toContain("{");
  });

  it("does not colour JavaScript pasted into a JSON block as JavaScript", () => {
    const html = highlightCode("const sum = (a, b) => a + b;", "json");

    expect(spans(html, "hl-kw")).toEqual([]);
    expect(spans(html, "hl-fn")).toEqual([]);
    expect(html.replace(/<[^>]+>/g, "")).toBe("const sum = (a, b) =&gt; a + b;");
  });

  it("keeps the code intact and handles comments (JSONC)", () => {
    const code = '{\n  // note\n  "a": -1.5e3\n}';

    const html = highlightCode(code, "json");

    expect(html.replace(/<[^>]+>/g, "")).toBe(code);
    expect(spans(html, "hl-cm")).toEqual(["// note"]);
    expect(spans(html, "hl-num")).toEqual(["-1.5e3"]);
  });
});

describe("Shell highlighting", () => {
  it("colours comments, keywords, commands, flags, variables and strings", () => {
    const code = '# build\nif [ -n "$HOME" ]; then\n  npm run build --silent && echo ok\nfi';

    const html = highlightCode(code, "bash");

    expect(spans(html, "hl-cm")).toEqual(["# build"]);
    expect(spans(html, "hl-kw")).toEqual(["if", "then", "fi"]);
    expect(spans(html, "hl-fn")).toEqual(["npm", "echo"]);
    expect(spans(html, "hl-attr")).toEqual(["-n", "--silent"]);
    expect(spans(html, "hl-str")).toEqual(['"$HOME"']);
    expect(html.replace(/<[^>]+>/g, "")).toBe(code.replace(/&/g, "&amp;"));
  });

  it("resolves sh, bash and zsh to the same highlighter", () => {
    const code = "echo $PATH";

    expect(highlightCode(code, "sh")).toBe(highlightCode(code, "bash"));
    expect(highlightCode(code, "zsh")).toBe(highlightCode(code, "bash"));
    expect(spans(highlightCode(code, "sh"), "hl-prop")).toEqual(["$PATH"]);
  });
});
