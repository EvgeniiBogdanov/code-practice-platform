import { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { afterEach, describe, expect, it } from "vitest";
import type { BlockTarget } from "./blockActions";
import { getDropSlot, moveBlock, shiftBlock } from "./blockMove";
import { resolveBlock } from "./blockPosition";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

/** The nth node of the given type, as the block a handle would point at. */
const findBlock = (editor: Editor, typeName: string, nth = 0): BlockTarget => {
  const found: BlockTarget[] = [];
  editor.state.doc.descendants((node: Node, pos: number) => {
    if (node.type.name === typeName) found.push({ node, pos });
  });
  return found[nth];
};

const markdown = (editor: Editor): string => editor.getMarkdown().trimEnd();

/** Drags `source` next to `target` the way the handle does. Returns false when nothing would move. */
const drop = (
  editor: Editor,
  source: BlockTarget,
  target: BlockTarget,
  placeAfter: boolean
): boolean => {
  const slot = getDropSlot(editor.state.doc, source, target, placeAfter);
  if (slot) moveBlock(editor, source, slot);
  return slot !== null;
};

describe("resolveBlock", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("treats a quote, a table and a paragraph as one top-level block each", () => {
    editor = createEditor("> цитата\n\nабзац\n\n| a | b |\n| --- | --- |\n| 1 | 2 |");
    const { doc } = editor.state;
    const quoteText = findBlock(editor, "blockquote").pos + 2;
    const cell = findBlock(editor, "tableCell").pos + 2;

    expect(resolveBlock(doc, quoteText)?.node.type.name).toBe("blockquote");
    expect(resolveBlock(doc, cell)?.node.type.name).toBe("table");
    expect(resolveBlock(doc, findBlock(editor, "paragraph", 1).pos + 1)?.node.type.name).toBe(
      "paragraph"
    );
  });

  it("picks the innermost list item, so every bullet is a block of its own", () => {
    editor = createEditor("- внешний\n  - вложенный\n- второй");
    const nested = findBlock(editor, "listItem", 1);

    expect(resolveBlock(editor.state.doc, nested.pos + 3)).toEqual(nested);
  });
});

describe("moving blocks", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("moves a block down below another one, and up above it", () => {
    editor = createEditor("один\n\nдва\n\nтри");

    expect(
      drop(editor, findBlock(editor, "paragraph", 0), findBlock(editor, "paragraph", 2), true)
    ).toBe(true);
    expect(markdown(editor)).toBe("два\n\nтри\n\nодин");

    drop(editor, findBlock(editor, "paragraph", 2), findBlock(editor, "paragraph", 0), false);
    expect(markdown(editor)).toBe("один\n\nдва\n\nтри");
  });

  it("does nothing when the block is dropped where it already stands", () => {
    editor = createEditor("один\n\nдва");
    const first = findBlock(editor, "paragraph", 0);
    const second = findBlock(editor, "paragraph", 1);

    expect(drop(editor, first, first, false)).toBe(false);
    expect(drop(editor, first, first, true)).toBe(false);
    expect(drop(editor, first, second, false)).toBe(false);
    expect(markdown(editor)).toBe("один\n\nдва");
  });

  it("reorders bullets inside their list", () => {
    editor = createEditor("- раз\n- два\n- три");

    drop(editor, findBlock(editor, "listItem", 0), findBlock(editor, "listItem", 2), true);

    expect(markdown(editor)).toBe("- два\n- три\n- раз");
  });

  it("moves a bullet to another nesting level", () => {
    editor = createEditor("- раз\n  - вложенный\n- два");

    drop(editor, findBlock(editor, "listItem", 2), findBlock(editor, "listItem", 1), true);

    expect(markdown(editor)).toBe("- раз\n  - вложенный\n  - два");
  });

  it("puts a bullet dragged out of its list into a list of its own", () => {
    editor = createEditor("- раз\n- два\n\nабзац");

    drop(editor, findBlock(editor, "listItem", 0), findBlock(editor, "paragraph", 2), true);

    expect(markdown(editor)).toBe("- два\n\nабзац\n\n- раз");
  });

  it("drops a paragraph beside a whole list, never into its middle", () => {
    editor = createEditor("абзац\n\n- раз\n- два\n- три");

    drop(editor, findBlock(editor, "paragraph", 0), findBlock(editor, "listItem", 1), false);

    expect(markdown(editor)).toBe("абзац\n\n- раз\n- два\n- три");
    expect(
      drop(editor, findBlock(editor, "paragraph", 0), findBlock(editor, "listItem", 1), true)
    ).toBe(true);
    expect(markdown(editor)).toBe("- раз\n- два\n- три\n\nабзац");
  });

  it("removes the old list when its last bullet leaves", () => {
    editor = createEditor("- единственный\n\nабзац");

    drop(editor, findBlock(editor, "listItem"), findBlock(editor, "paragraph", 1), true);

    expect(markdown(editor)).toBe("абзац\n\n- единственный");
  });

  it("refuses to drop a block into itself", () => {
    editor = createEditor("- внешний\n  - вложенный");
    const outer = findBlock(editor, "listItem", 0);
    const inner = findBlock(editor, "listItem", 1);

    expect(drop(editor, outer, inner, true)).toBe(false);
  });

  it("keeps a task a task when it moves", () => {
    editor = createEditor("- [ ] задача\n\nабзац");

    drop(editor, findBlock(editor, "taskItem"), findBlock(editor, "paragraph", 1), true);

    expect(markdown(editor)).toBe("абзац\n\n- [ ] задача");
  });

  it("moves the block under the caret with the keyboard shortcut", () => {
    editor = createEditor("один\n\nдва\n\nтри");
    editor.commands.setTextSelection(findBlock(editor, "paragraph", 1).pos + 1);

    expect(shiftBlock(editor, -1)).toBe(true);
    expect(markdown(editor)).toBe("два\n\nодин\n\nтри");

    expect(shiftBlock(editor, 1)).toBe(true);
    expect(markdown(editor)).toBe("один\n\nдва\n\nтри");
    expect(editor.state.selection.$from.parent.textContent).toBe("два");
  });

  it("leaves the shortcut alone at the edges of the page", () => {
    editor = createEditor("один\n\nдва");
    editor.commands.setTextSelection(1);

    expect(shiftBlock(editor, -1)).toBe(false);
  });
});
