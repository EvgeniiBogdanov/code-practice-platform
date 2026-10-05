import { describe, it, expect } from "vitest";
import { highlightCode, highlightCSS, highlightHTML } from "./codeHighlighter";

describe("JS/TS highlighting regressions", () => {
  it("treats / after ++ and -- as division, not a regex", () => {
    const result = highlightCode("const x = a++ / 2; const y = /re/.test(x);", "a.js");
    expect(result).not.toContain('class="hl-regex">/ 2');
    expect(result).toContain('class="hl-regex">/re/</span>');
  });

  it("does not read a self-closing tag after an expression attribute as a regex", () => {
    const result = highlightCode("const a = <A b={1} /><div/>;", "a.jsx");
    expect(result).not.toContain("hl-regex");
  });

  it("highlights fragment openers", () => {
    const result = highlightCode("const a = <>x</>;", "a.jsx");
    expect(result.match(/hl-tag-punct/g)).toHaveLength(4);
  });

  it.each([
    "const f = <const T,>(a: T) => a;",
    "const f = <T = any>(x: T) => x;",
    "const f = <T extends object>(x: T) => x;",
    "const f = <T,>(x: T) => x;",
  ])("keeps TSX generic arrow parameters out of markup: %s", (code) => {
    expect(highlightCode(code, "a.tsx")).not.toContain("hl-tag-punct");
  });

  it("keeps type arguments of a TSX component inside its tag", () => {
    const result = highlightCode("const a = <Foo<string> a={1} />;", "a.tsx");
    expect(result).toContain('class="hl-attr">a</span>');
  });

  it("does not color contextual keywords used as identifiers", () => {
    const result = highlightCode("const r = type + 1;\nconst q = type ? a : b;", "a.ts");
    expect(result).not.toContain('class="hl-kw">type</span>');
  });

  it("highlights accessors, private names and decorators", () => {
    const result = highlightCode(
      "@Injectable()\nclass A { #x = 1; get x() { return this.#x; } }\nget(url);",
      "a.ts"
    );
    expect(result).toContain('class="hl-fn">@Injectable</span>');
    expect(result).toContain('class="hl-kw">get</span>');
    expect(result).toContain('class="hl-prop">#x</span>');
    expect(result).toContain('class="hl-fn">get</span>');
  });

  it("does not color declared names as built-in types", () => {
    const result = highlightCode("const object = {}; function number() {}", "a.ts");
    expect(result).not.toContain("hl-type");
  });
});

describe("CSS highlighting regressions", () => {
  it("does not start a // comment inside url()", () => {
    const result = highlightCSS("a { background: url(http://a.com/x.png); color: red; }");
    expect(result).not.toContain("hl-cm");
    expect(result).toContain('class="hl-css-prop">color</span>');
  });

  it("highlights compact declarations as properties and values", () => {
    const result = highlightCSS("a{color:red;margin:0 auto;transition:all .3s}");
    expect(result).toContain('class="hl-css-prop">color</span>');
    expect(result).toContain('class="hl-css-prop">margin</span>');
    expect(result).not.toContain("hl-css-selector");
  });

  it("keeps nested pseudo selectors and at-rules", () => {
    const result = highlightCSS("@media (min-width: 1px) { a:hover { color: red } }");
    expect(result).toContain('class="hl-css-selector">:hover</span>');
    expect(result).not.toContain('class="hl-css-prop">a</span>');
  });

  it("treats an unterminated block comment as a comment", () => {
    expect(highlightCSS("a { /* open")).toContain('class="hl-cm">/* open</span>');
  });
});

describe("HTML highlighting regressions", () => {
  it("highlights unquoted attribute values as values", () => {
    const result = highlightHTML("<div id=x class=a-b>t</div>");
    expect(result).toContain('class="hl-str">x</span>');
    expect(result).toContain('class="hl-attr">class</span>');
    expect(result).toContain('class="hl-str">a-b</span>');
  });

  it("does not highlight data scripts as JavaScript", () => {
    const html = '<script type="text/template">const a = 1;</script>';
    expect(highlightHTML(html)).not.toContain('class="hl-kw"');
    expect(highlightHTML('<script type="module">const a = 1;</script>')).toContain(
      'class="hl-kw">const</span>'
    );
  });
});

describe("synthetic problems", () => {
  it("never underlines a failure of the analysis itself", () => {
    const result = highlightCode("const a = 1;", "a.ts", {
      problems: [
        { line: 1, col: 1, start: 0, end: 0, message: "", severity: "warning", synthetic: true },
      ],
    });
    expect(result).not.toContain("hl-squiggly");
  });
});

describe("template literal output", () => {
  it("emits one span per run of plain text and splits it only at a selection edge", () => {
    const code = "const s = `hello world`;";
    expect(highlightCode(code, "a.js").match(/class="hl-str"/g)).toHaveLength(1);

    const start = code.indexOf("world");
    const selected = highlightCode(code, "a.js", {
      multiSelections: [{ start, end: start + 5 }],
    });
    expect(selected).toContain('<span class="hl-str">`hello </span>');
    expect(selected).toContain('<span class="hl-str hl-multi-selected">world</span>');
    expect(selected).toContain('<span class="hl-str">`</span>');
  });
});
