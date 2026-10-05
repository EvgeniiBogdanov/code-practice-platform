import { describe, it, expect } from "vitest";
import { getCompletions } from "./snippetsEngine";
import { expandSnippet } from "./snippets/snippetExpander";
import { JS_SNIPPETS } from "./languages/javascriptKnowledge";
import { REACT_SNIPPETS } from "./languages/reactKnowledge";
import { getLanguageId, getLanguageCapabilities } from "./languages/languageDetector";

describe("Language Detector & Capabilities", () => {
  it("resolves pure JavaScript files correctly", () => {
    expect(getLanguageId("solution.js")).toBe("javascript");
    expect(getLanguageId("src/algorithms/tasks/1_TwoSum.js")).toBe("javascript");
    const caps = getLanguageCapabilities("javascript");
    expect(caps.supportsJsx).toBe(true);
    expect(caps.supportsEmmet).toBe(false);
    expect(caps.supportsReactHooks).toBe(false);
    expect(caps.supportsTypeScript).toBe(false);
  });

  it("resolves React JSX files correctly", () => {
    expect(getLanguageId("App.jsx")).toBe("javascriptreact");
    const caps = getLanguageCapabilities("javascriptreact");
    expect(caps.supportsJsx).toBe(true);
    expect(caps.supportsReactHooks).toBe(true);
    expect(caps.supportsTypeScript).toBe(false);
  });

  it("resolves TypeScript and TSX files correctly", () => {
    expect(getLanguageId("types.ts")).toBe("typescript");
    expect(getLanguageId("Component.tsx")).toBe("typescriptreact");
    const tsCaps = getLanguageCapabilities("typescript");
    expect(tsCaps.supportsTypeScript).toBe(true);
    expect(tsCaps.supportsJsx).toBe(false);
    const tsxCaps = getLanguageCapabilities("typescriptreact");
    expect(tsxCaps.supportsTypeScript).toBe(true);
    expect(tsxCaps.supportsJsx).toBe(true);
    expect(tsxCaps.supportsReactHooks).toBe(true);
  });

  it("resolves CSS, HTML and SQL files correctly", () => {
    expect(getLanguageId("styles.css")).toBe("css");
    expect(getLanguageId("index.html")).toBe("html");
    expect(getLanguageId("query.sql")).toBe("sql");
  });
});

describe("Pure JavaScript Completions (VS Code 1-to-1)", () => {
  it("does NOT suggest React hooks in .js files", () => {
    const res = getCompletions("use", 3, { filepath: "1_TwoSum.js" });
    const labels = res.items.map((i) => i.label);
    expect(labels).not.toContain("useState");
    expect(labels).not.toContain("useEffect");
    expect(labels).not.toContain("useCallback");
    expect(labels).not.toContain("useMemo");
    expect(labels).not.toContain("useRef");
  });

  it("does NOT suggest React snippets in .js files", () => {
    const snipRes = getCompletions("rfce", 4, { filepath: "solution.js" });
    expect(snipRes.items.map((i) => i.prefix)).not.toContain("rfce");
  });

  it("does NOT suggest TypeScript utility types in .js files", () => {
    const res = getCompletions("Partial", 7, { filepath: "solution.js" });
    expect(res.items.map((i) => i.label)).not.toContain("Partial<T>");
  });

  it("suggests JS snippets, keywords, globals and member completions in .js files", () => {
    const clgRes = getCompletions("clg", 3, { filepath: "solution.js" });
    expect(clgRes.items.some((i) => i.prefix === "clg")).toBe(true);

    const mathRes = getCompletions("Math.", 5, { filepath: "solution.js" });
    const mathLabels = mathRes.items.map((i) => i.label);
    expect(mathLabels).toContain("max");
    expect(mathLabels).toContain("min");
    expect(mathLabels).toContain("floor");

    // Members of other receivers come from the TypeScript service, not from the name.
    for (const receiver of ["arr", "data", "value", "e", "target", "user"]) {
      expect(
        getCompletions(`${receiver}.`, receiver.length + 1, { filepath: "solution.js" }).items
      ).toEqual([]);
    }
  });
});

describe("Snippet Expansion VS Code Parity", () => {
  it("expands clg snippet to console.log() without filename artifact", () => {
    const clgSnippet = JS_SNIPPETS.find((s) => s.prefix === "clg");
    expect(clgSnippet).toBeDefined();
    if (!clgSnippet) return;

    const res = expandSnippet("clg", 3, clgSnippet, "clg", {
      filepath: "5_Abstraction.js",
      title: "5_Абстракция.js",
    });

    expect(res.newCode).toBe("console.log();");
    expect(res.newCursorPos).toBe(12);
    expect(res.newCode).not.toContain("5Abstraction");
    expect(res.newCode).not.toContain("5_Абстракция");
  });

  it("expands React component snippets with component name", () => {
    const rfceSnippet = REACT_SNIPPETS.find((s) => s.prefix === "rfce");
    expect(rfceSnippet).toBeDefined();
    if (!rfceSnippet) return;

    const res = expandSnippet("rfce", 4, rfceSnippet, "rfce", {
      filepath: "UserCard.jsx",
    });

    expect(res.newCode).toContain("export default function UserCard()");
  });
});

describe("React JSX Completions (.jsx)", () => {
  it("suggests React hooks and JSX tags in .jsx files", () => {
    const hookRes = getCompletions("use", 3, { filepath: "App.jsx" });
    const hookLabels = hookRes.items.map((i) => i.label);
    expect(hookLabels).toContain("useState");
    expect(hookLabels).toContain("useEffect");

    const tagRes = getCompletions("<", 1, { filepath: "App.jsx" });
    const tagLabels = tagRes.items.map((i) => i.label);
    expect(tagLabels).toContain("<div>");
    expect(tagLabels).toContain("<button>");
  });

  it("suggests JSX props when typing in tag", () => {
    const propRes = getCompletions("<button on", 10, { filepath: "App.jsx" });
    expect(propRes.items.map((i) => i.label)).toContain("onClick");
  });

  it("does NOT suggest TypeScript utility types in .jsx files", () => {
    const res = getCompletions("Partial", 7, { filepath: "App.jsx" });
    expect(res.items.map((i) => i.label)).not.toContain("Partial<T>");
  });
});

describe("TypeScript Completions (.ts vs .tsx)", () => {
  it("suggests TS types in .ts files but NOT JSX tags", () => {
    const tsRes = getCompletions("Partial", 7, { filepath: "types.ts" });
    expect(tsRes.items.map((i) => i.label)).toContain("Partial<T>");

    const tagRes = getCompletions("<", 1, { filepath: "types.ts" });
    expect(tagRes.items.map((i) => i.label)).not.toContain("<div>");

    const hookRes = getCompletions("use", 3, { filepath: "types.ts" });
    expect(hookRes.items.map((i) => i.label)).not.toContain("useState");
  });

  it("suggests both TS types, React hooks, and JSX tags in .tsx files", () => {
    const tsRes = getCompletions("Partial", 7, { filepath: "Component.tsx" });
    expect(tsRes.items.map((i) => i.label)).toContain("Partial<T>");

    const hookRes = getCompletions("use", 3, { filepath: "Component.tsx" });
    expect(hookRes.items.map((i) => i.label)).toContain("useState");

    const tagRes = getCompletions("<", 1, { filepath: "Component.tsx" });
    expect(tagRes.items.map((i) => i.label)).toContain("<div>");
  });
});

describe("CSS, HTML, and SQL Completions", () => {
  it("suggests CSS properties and values in .css files", () => {
    const propRes = getCompletions("disp", 4, { filepath: "styles.css" });
    expect(propRes.items.map((i) => i.label)).toContain("display");

    const valRes = getCompletions("display: fl", 11, { filepath: "styles.css" });
    expect(valRes.items.map((i) => i.label)).toContain("flex");
  });

  it("suggests HTML tags and snippets in .html files", () => {
    const snipRes = getCompletions("!", 1, { filepath: "index.html" });
    expect(snipRes.items.map((i) => i.prefix)).toContain("!");

    const tagRes = getCompletions("<", 1, { filepath: "index.html" });
    expect(tagRes.items.map((i) => i.label)).toContain("<div>");
  });

  it("suggests SQL keywords in .sql files", () => {
    const sqlRes = getCompletions("SEL", 3, { filepath: "query.sql" });
    expect(sqlRes.items.map((i) => i.label)).toContain("SELECT");
  });
});

describe("Snippet tab stops", () => {
  const snippet = (prefix: string) => {
    const found = [...JS_SNIPPETS, ...REACT_SNIPPETS].find((item) => item.prefix === prefix);
    if (!found) throw new Error(`missing snippet ${prefix}`);
    return found;
  };

  it("selects the first placeholder and visits fields in order, ending on $0", () => {
    const code = "fn";
    const res = expandSnippet(code, 2, snippet("fn"), "fn");
    expect(res.newCode).toBe("function name(params) {\n  \n}");
    expect(res.newCode.slice(res.newCursorPos, res.newSelectionEnd)).toBe("name");
    expect(res.tabStops.map(({ start, end }) => res.newCode.slice(start, end))).toEqual([
      "name",
      "params",
      "",
    ]);
    expect(res.tabStops[2].start).toBe(res.newCode.indexOf("\n  \n") + 3);
  });

  it("indents continuation lines like the line the snippet starts on", () => {
    const code = "function a() {\n    trycatch";
    const res = expandSnippet(code, code.length, snippet("trycatch"), "trycatch");
    expect(res.newCode).toBe(
      "function a() {\n    try {\n      \n    } catch (error) {\n      console.error(error);\n    }"
    );
    expect(res.newCursorPos).toBe(res.newCode.indexOf("{\n      \n") + 8);
  });
});
