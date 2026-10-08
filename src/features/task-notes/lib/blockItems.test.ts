import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { BLOCK_ITEMS, filterBlockItems } from "./blockItems";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (markdown = ""): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

describe("filterBlockItems", () => {
  it("returns every block for an empty query", () => {
    expect(filterBlockItems("")).toHaveLength(BLOCK_ITEMS.length);
  });

  it("matches titles and keywords, in either language", () => {
    expect(filterBlockItems("цит").map((item) => item.id)).toEqual(["blockquote"]);
    expect(filterBlockItems("todo").map((item) => item.id)).toEqual(["taskList"]);
    expect(filterBlockItems("zzz")).toEqual([]);
  });
});

describe("BLOCK_ITEMS", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it.each([
    ["heading1", "# "],
    ["heading2", "## "],
    ["heading3", "### "],
    ["bulletList", "- "],
    ["orderedList", "1. "],
    ["taskList", "- [ ] "],
    ["blockquote", "> "],
    ["codeBlock", "```"],
  ])("turns an empty line into %s, stored as markdown %j", (id, prefix) => {
    editor = createEditor("text");
    const item = BLOCK_ITEMS.find((candidate) => candidate.id === id);

    item?.apply(editor.chain().focus()).run();

    expect(editor.getMarkdown().trimEnd().startsWith(prefix)).toBe(true);
  });

  it("inserts a table and a divider", () => {
    editor = createEditor();
    BLOCK_ITEMS.find((item) => item.id === "table")
      ?.apply(editor.chain().focus())
      .run();
    expect(editor.getMarkdown()).toContain("| --- | --- | --- |");

    editor.destroy();
    editor = createEditor();
    BLOCK_ITEMS.find((item) => item.id === "divider")
      ?.apply(editor.chain().focus())
      .run();
    expect(editor.getMarkdown()).toContain("---");
  });
});
