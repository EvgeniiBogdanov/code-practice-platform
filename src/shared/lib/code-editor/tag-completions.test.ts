import { describe, expect, expectTypeOf, it } from "vitest";
import type { JSX } from "react";
import { getCompletions } from "./snippetsEngine";
import { getAutoCloseTagEdit, HTML_VOID_TAGS } from "./markup-context";
import { REACT_INTRINSIC_TAG_NAMES } from "./languages/react-intrinsic-tags";
import { HTML_DATA_PROVIDER, MARKUP_TAGS } from "./languages/markup-tags";

const complete = (
  code: string,
  filepath: string,
  cursor = code.length
): ReturnType<typeof getCompletions> => getCompletions(code, cursor, { filepath });

it("covers all installed React intrinsic elements and VS Code HTML tags", () => {
  expectTypeOf<
    Exclude<keyof JSX.IntrinsicElements, (typeof REACT_INTRINSIC_TAG_NAMES)[number]>
  >().toEqualTypeOf<never>();
  const names = new Set(MARKUP_TAGS.map(({ name }) => name));
  for (const tag of HTML_DATA_PROVIDER.provideTags()) expect(names.has(tag.name)).toBe(true);
});

describe.each(["index.html", "App.jsx", "App.tsx"])("complete tag vocabulary in %s", (filepath) => {
  it.each(MARKUP_TAGS.map(({ name }) => name))("expands, suggests and closes %s", (name) => {
    // Explicit child context also covers tags that are JS keywords (var, switch).
    const prefix = filepath.endsWith("html") ? "" : "<section>";
    const abbreviation = complete(prefix + name, filepath).items.find(
      (item) => item.prefix === name && item.label.includes("Emmet")
    );
    expect(abbreviation, name).toBeDefined();
    expect(abbreviation?.insertText).toContain(`<${name}`);
    if (!HTML_VOID_TAGS.has(name)) expect(abbreviation?.insertText).toContain(`</${name}>`);
    const suggestions = complete(prefix + "<" + name, filepath).items;
    expect(
      suggestions.some((item) => item.insertText === name),
      name
    ).toBe(true);
    const opening = prefix + `<${name}>`;
    const edit = getAutoCloseTagEdit(opening, opening.length, filepath);
    if (filepath.endsWith("html") && HTML_VOID_TAGS.has(name)) expect(edit).toBeNull();
    else expect(edit?.newCode).toBe(opening + `</${name}>`);
  });
});

it.each(["index.html", "App.jsx", "App.tsx"])(
  "supports partial names and Emmet aliases in %s",
  (filepath) => {
    expect(complete("but", filepath).items[0]).toMatchObject({
      insertText: "<button></button>",
      cursorOffset: 8,
      replaceStart: 0,
      replaceEnd: 3,
    });
    expect(complete("button", filepath).items[0]?.insertText).toBe("<button></button>");
    expect(complete("btn", filepath).items[0]?.insertText).toBe("<button></button>");
    expect(complete("input:email", filepath).items[0]?.insertText).toContain('type="email"');
    expect(complete("my-control", filepath).items[0]?.insertText).toBe("<my-control></my-control>");
  }
);

it("replaces the complete tag token when accepting inside a word", () => {
  expect(complete("button", "App.tsx", 3).items[0]).toMatchObject({
    replaceStart: 0,
    replaceEnd: 6,
    insertText: "<button></button>",
  });
});

it("keeps React hooks alongside the SVG use element", () => {
  const items = complete("use", "App.tsx").items;
  expect(items.some((item) => item.prefix === "use" && item.label.includes("Emmet"))).toBe(true);
  expect(items.some((item) => item.label === "useState")).toBe(true);
});

it("uses HTML language service for tag-specific attributes and values", () => {
  expect(complete('<button type="', "index.html").items.map((item) => item.label)).toEqual(
    expect.arrayContaining(["button", "submit", "reset"])
  );
  expect(complete("<details\n op", "index.html").items.map((item) => item.label)).toContain("open");
  expect(complete("<!-- <but", "index.html").items).toEqual([]);
});

it.each([
  "main.js",
  "main.ts",
  "main.mjs",
  "main.cjs",
  "main.mts",
  "main.cts",
  "main.json",
  "main.css",
  "main.txt",
])("does not suggest tag expansions in %s", (filepath) => {
  for (const text of ["button", "but", "dialog", "svg", "path", "my-control", "input:email"]) {
    expect(complete(text, filepath).items.some((item) => item.label.includes("Emmet"))).toBe(false);
  }
});

it.each(["App.jsx", "App.tsx"])("completes the matching closing tag in %s", (filepath) => {
  const code = "<section><button>OK</bu";
  expect(complete(code, filepath).items[0]).toMatchObject({
    insertText: "button>",
    replaceStart: code.length - 2,
    replaceEnd: code.length,
  });
  expect(complete(code + ">", filepath, code.length).items[0]?.replaceEnd).toBe(code.length + 1);
});

it.each(["Math.max", "JSON.parse", "React.useState", "console.log"])(
  "does not replace %s with JSX",
  (code) => {
    expect(complete(code, "App.tsx").items.some((item) => item.label.includes("Emmet"))).toBe(
      false
    );
  }
);

it("supports large Emmet repetitions with the engine's expansion limit", () => {
  const repeated = complete("ul>li*150", "App.tsx").items[0]?.insertText;
  expect(repeated?.match(/<li>/g)).toHaveLength(150);
  const bounded = complete("ul>li*10000000", "App.tsx").items[0]?.insertText;
  expect(bounded?.match(/<li>/g)).toHaveLength(1000);
});
