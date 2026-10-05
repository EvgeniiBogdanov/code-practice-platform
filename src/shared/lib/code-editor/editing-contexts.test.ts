import { describe, expect, it } from "vitest";
import { getEmbeddedRegion, getMarkupContext } from "./markup-context";
import { getCompletions } from "./snippetsEngine";
import { highlightCode } from "./highlighter/codeHighlighter";

const complete = (code: string, filepath = "App.tsx") =>
  getCompletions(code, code.length, { filepath }).items;

describe("markup context with template literals", () => {
  it("keeps a JSX child expression open across a template interpolation", () => {
    const code = "const a = <div>{`t ${x}`}z</div>;";
    const context = getMarkupContext(code, "App.tsx");
    expect(context.tags.map((tag) => `${tag.closing ? "/" : ""}${tag.name}`)).toEqual([
      "div",
      "/div",
    ]);
    expect(context.openTags).toEqual([]);
    expect(context.mode).toBe("code");
    // The template is code: text starts only after the closing `}` of the expression.
    expect(context.textRanges[0].start).toBe(code.indexOf("}z") + 1);
  });

  it("highlights markup that follows a template inside a JSX child", () => {
    const html = highlightCode("const a = <div>{`t ${x}`}<b>y</b></div>;", "a.jsx");
    expect(html).toContain('class="hl-tag">b</span>');
  });

  it("keeps generic arrow parameters out of markup", () => {
    for (const source of ["<const T,>(a: T) => a", "<T = any>(x: T) => x"]) {
      expect(getMarkupContext(`const f = ${source};`, "App.tsx").tags).toEqual([]);
    }
  });
});

describe("JSX props of custom components", () => {
  it("offers DOM props for intrinsic tags only; components get typed props from TypeScript", () => {
    expect(complete("<button on").map((item) => item.label)).toContain("onClick");
    expect(complete("<Card ")).toEqual([]);
    expect(complete("<Card cl")).toEqual([]);
    expect(complete("<Foo.Bar ")).toEqual([]);
  });
});

describe("completions inside <script> and <style> of HTML", () => {
  const html = (body: string): string => `<!DOCTYPE html>\n${body}`;

  it("completes JavaScript members in a script and rebases the replaced range", () => {
    const code = html("<script>\n  console.lo\n</script>");
    const cursor = code.indexOf("lo") + 2;
    const log = getCompletions(code, cursor, { filepath: "index.html" }).items.find(
      (item) => item.label === "log"
    );
    expect(log).toBeDefined();
    expect(code.slice(log?.replaceStart, log?.replaceEnd)).toBe("lo");
  });

  it("completes CSS properties in a style block", () => {
    const code = html("<style>\n  .a {\n    col\n  }\n</style>");
    const items = getCompletions(code, code.indexOf("col") + 3, { filepath: "index.html" }).items;
    expect(items.map((item) => item.label)).toContain("color");
  });

  it("does not offer Emmet or tags in script text, but keeps them in the body", () => {
    const script = html("<script>\n  div\n</script>");
    const inScript = getCompletions(script, script.indexOf("div") + 3, { filepath: "index.html" });
    expect(inScript.items.some((item) => item.insertText.startsWith("<div"))).toBe(false);
    const body = html("<body>div</body>");
    const inBody = getCompletions(body, body.indexOf("div") + 3, { filepath: "index.html" });
    expect(inBody.items.some((item) => item.insertText.startsWith("<div"))).toBe(true);
  });

  it("finds the embedded region by position", () => {
    const code = "<p></p><script>let a</script>";
    expect(getEmbeddedRegion(code, code.indexOf("let"), "x.html")?.language).toBe("javascript");
    expect(getEmbeddedRegion(code, 1, "x.html")).toBeNull();
    expect(getEmbeddedRegion(code, code.indexOf("let"), "x.tsx")).toBeNull();
  });
});

describe("CSS completion contexts", () => {
  const css = (code: string) => getCompletions(code, code.length, { filepath: "a.css" }).items;

  it("completes pseudo-classes after a selector and values after a property", () => {
    expect(css("a:hov").map((item) => item.label)).toContain(":hover");
    expect(css("a:hov").some((item) => item.kind === "value")).toBe(false);
    expect(css(".a {\n  display:fl").map((item) => item.label)).toContain("flex");
    expect(css(".a {\n  display: fl").map((item) => item.label)).toContain("flex");
  });

  it("does not add a second semicolon before an existing one", () => {
    const code = ".a { display: fl; }";
    const items = getCompletions(code, code.indexOf("fl") + 2, { filepath: "a.css" }).items;
    expect(items.find((item) => item.label === "flex")?.insertText).toBe("flex");
    expect(css(".a { display: fl").find((item) => item.label === "flex")?.insertText).toBe("flex;");
  });
});
