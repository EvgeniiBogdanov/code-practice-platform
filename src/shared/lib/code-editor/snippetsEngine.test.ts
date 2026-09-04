import { describe, it, expect } from "vitest";
import { getCompletions } from "./snippetsEngine";
import { lintJavaScriptCode } from "./codeLinter";
import { expandSnippet } from "./snippets/snippetExpander";
import { JS_SNIPPETS } from "./languages/javascriptKnowledge";
import { REACT_SNIPPETS } from "./languages/reactKnowledge";
import { getLanguageId, getLanguageCapabilities } from "./languages/languageDetector";

describe("Language Detector & Capabilities", () => {
  it("resolves pure JavaScript files correctly", () => {
    expect(getLanguageId("solution.js")).toBe("javascript");
    expect(getLanguageId("src/algorithms/tasks/1_TwoSum.js")).toBe("javascript");
    const caps = getLanguageCapabilities("javascript");
    expect(caps.supportsJsx).toBe(false);
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

  it("does NOT suggest JSX tags or snippets in .js files", () => {
    const res = getCompletions("<", 1, { filepath: "solution.js" });
    const labels = res.items.map((i) => i.label);
    expect(labels).not.toContain("<div>");
    expect(labels).not.toContain("<button>");

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

    const arrRes = getCompletions("arr.", 4, { filepath: "solution.js" });
    const arrLabels = arrRes.items.map((i) => i.label);
    expect(arrLabels).toContain("map");
    expect(arrLabels).toContain("filter");
    expect(arrLabels).toContain("reduce");

    const reduceItem = arrRes.items.find((i) => i.label === "reduce");
    expect(reduceItem?.insertText).toBe("reduce()");
    expect(reduceItem?.cursorOffset).toBe(7);

    const mapItem = arrRes.items.find((i) => i.label === "map");
    expect(mapItem?.insertText).toBe("map()");
    expect(mapItem?.cursorOffset).toBe(4);

    const filterItem = arrRes.items.find((i) => i.label === "filter");
    expect(filterItem?.insertText).toBe("filter()");
    expect(filterItem?.cursorOffset).toBe(7);
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

describe("Linter Scoping by Environment", () => {
  it("does NOT trigger React missing import in pure JS files", () => {
    const jsLint = lintJavaScriptCode("function test() { const val = useState; }", {
      filepath: "1_TwoSum.js",
    });
    expect(jsLint.problems.some((p) => p.rule === "missing-import")).toBe(false);
  });

  it("triggers missing import in React JSX files", () => {
    const jsxLint = lintJavaScriptCode(
      "export default function App() { useState(0); return <div />; }",
      {
        filepath: "App.jsx",
      }
    );
    expect(jsxLint.problems.some((p) => p.symbol === "useState")).toBe(true);
  });

  it("does NOT trigger TypeScript type missing import in pure JSX files", () => {
    const jsxLint = lintJavaScriptCode(
      "export default function App() { return <p>Работает через Context</p>; }",
      {
        filepath: "App.jsx",
      }
    );
    expect(jsxLint.problems.some((p) => p.symbol === "Context")).toBe(false);
  });

  it("does NOT trigger duplicate identifier for sequential for loops with let i", () => {
    const code = `
function hashJoin(users, orders) {
  for (let i = 0; i < orders.length; i++) {}
  for (let i = 0; i < users.length; i++) {}
}
`;
    const lint = lintJavaScriptCode(code, { filepath: "solution.js" });
    const dups = lint.problems.filter((p) => p.rule === "duplicate-identifier");
    expect(dups).toEqual([]);
  });

  it("does NOT trigger any errors for js242 HashMapJoinApiResponses solution", () => {
    const code = `
const hashJoin = (users, orders, options = {}) => {
  const ordersMap = new Map();
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
  }
  const result = new Array(users.length);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
  }
  return result;
};
`;
    const lint = lintJavaScriptCode(code, {
      filepath: "src/javascript/solutions/12_collections_map/level3/24_HashMapJoinApiResponses.js",
    });
    const errors = lint.problems.filter((p) => p.severity === "error");
    expect(errors).toEqual([]);
  });
});
