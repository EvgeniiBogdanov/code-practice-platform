import { describe, expect, it } from "vitest";
import { getAutoCloseTagEdit, getMarkupContext } from "./markup-context";
import { getCompletions } from "./snippetsEngine";
import { highlightCode } from "./highlighter/codeHighlighter";

const complete = (code: string, filepath = "App.tsx") =>
  getCompletions(code, code.length, { filepath }).items;

describe("markup editing by file type", () => {
  it.each(["App.jsx", "App.tsx", "index.html"])(
    "expands bare and composed abbreviations in %s",
    (filepath) => {
      expect(complete("div", filepath)[0]).toMatchObject({
        insertText: "<div></div>",
        cursorOffset: 5,
      });
      expect(complete("p", filepath)[0]?.insertText).toBe("<p></p>");
      expect(complete("ul>li*2", filepath)[0]?.insertText.match(/<li>/g)).toHaveLength(2);
      expect(complete("(header>h1{Title})+main", filepath)[0]?.insertText).toContain(
        "<h1>Title</h1>"
      );
    }
  );

  it("uses JSX attributes and HTML attributes independently", () => {
    expect(complete("div.panel")[0]?.insertText).toBe('<div className="panel"></div>');
    expect(complete("div.panel", "index.html")[0]?.insertText).toBe('<div class="panel"></div>');
    expect(complete("label[for=field]")[0]?.insertText).toContain('htmlFor="field"');
    expect(complete("input", "index.html")[0]?.insertText).not.toContain("/>");
    expect(complete("input")[0]?.insertText).toContain("/>");
  });

  it.each([
    "main.js",
    "main.mjs",
    "main.cjs",
    "main.ts",
    "main.mts",
    "main.cts",
    "main.json",
    "main.css",
    "main.txt",
    "main.md",
  ])("does not inject JSX in %s", (filepath) => {
    expect(complete("div", filepath).some((item) => item.insertText.includes("<div"))).toBe(false);
    expect(getAutoCloseTagEdit("<div>", 5, filepath)).toBeNull();
    expect(highlightCode("<div>", filepath)).not.toContain('class="hl-tag-punct');
  });

  it.each([
    'const text = "div',
    "// div",
    "/* div",
    "const text = `div",
    "const div",
    "const count = a + div",
    "value.div",
    '<div title="div',
  ])("does not expand markup in %s", (code) => {
    expect(complete(code).some((item) => item.label.includes("Emmet"))).toBe(false);
  });

  it("offers markup after return and inside children", () => {
    expect(complete("return div")[0]?.insertText).toBe("<div></div>");
    expect(complete("<section>div")[0]?.insertText).toBe("<div></div>");
    expect(complete('<div title="https://example.org">span')[0]?.insertText).toBe("<span></span>");
  });

  it.each([
    ["<div>", "<div></div>"],
    ["return <Panel>", "return <Panel></Panel>"],
    ["<UI.Card>", "<UI.Card></UI.Card>"],
    ["<my-element>", "<my-element></my-element>"],
    ["<>", "<></>"],
    ['<div title="a > b">', '<div title="a > b"></div>'],
    [
      '<button\n onClick={() => { alert("hello"); }}>',
      '<button\n onClick={() => { alert("hello"); }}></button>',
    ],
    ["<div>{items.map(item => <span>", "<div>{items.map(item => <span></span>"],
    ["<img>", "<img></img>"],
  ])("closes %s", (code, expected) => {
    expect(getAutoCloseTagEdit(code, code.length, "App.tsx")).toEqual({
      newCode: expected,
      newCursor: code.length,
    });
  });

  it.each([
    "<input />",
    "</div>",
    'const text = "<div>',
    "// <div>",
    "/* <div>",
    "const text = `<div>",
    "const re = /<div>",
    "a < b >",
    "const fn = <T,>",
    '<div title="x >',
    "<div test={a >",
    "<div render={() =>",
    "<div>{a >",
  ])("does not close %s", (code) => {
    expect(getAutoCloseTagEdit(code, code.length, "App.tsx")).toBeNull();
  });

  it("does not duplicate existing closers but respects same-name ancestors", () => {
    expect(getAutoCloseTagEdit("<div></div>", 5, "App.jsx")).toBeNull();
    expect(getAutoCloseTagEdit("<div><div></div>", 10, "App.jsx")?.newCode).toBe(
      "<div><div></div></div>"
    );
  });

  it("keeps HTML void elements and raw text separate from JSX", () => {
    expect(getAutoCloseTagEdit("<input>", 7, "index.html")).toBeNull();
    expect(getAutoCloseTagEdit("<IMG>", 5, "index.html")).toBeNull();
    expect(getAutoCloseTagEdit("<!-- <div>", 10, "index.html")).toBeNull();
    expect(getAutoCloseTagEdit('<script>const x = "<div>', 23, "index.html")).toBeNull();
  });

  it("tracks nested attribute expressions and their outer tag", () => {
    const code = "<Card render={() => <span />}>";
    expect(getAutoCloseTagEdit(code, code.length, "App.tsx")?.newCode).toBe(code + "</Card>");
    expect(getMarkupContext("<div><span></span>", "App.jsx").openTags).toEqual(["div"]);
  });
});

describe("additional markup boundaries", () => {
  it("does not mistake TSX type arguments for the end of a component", () => {
    expect(getAutoCloseTagEdit("<List<string>", 13, "App.tsx")).toBeNull();
    expect(getAutoCloseTagEdit("<List<string>>", 14, "App.tsx")?.newCode).toBe(
      "<List<string>></List>"
    );
  });
  it("does not use a future sibling's closer", () => {
    expect(getAutoCloseTagEdit("<div><div></div>", 5, "App.jsx")?.newCode).toBe(
      "<div></div><div></div>"
    );
  });
  it("skips raw HTML contents and resumes markup after them", () => {
    const code = '<script>"<fake>"</script><main>';
    expect(getAutoCloseTagEdit(code, code.length, "index.html")?.newCode).toBe(code + "</main>");
    expect(getAutoCloseTagEdit("<DIV></div>", 5, "index.html")).toBeNull();
  });
});

it("completes props across line breaks without leaking them into expressions", () => {
  expect(complete("<button\n  on").map((item) => item.label)).toContain("onClick");
  expect(complete("<button disabled={value >").map((item) => item.label)).not.toContain("onClick");
});
