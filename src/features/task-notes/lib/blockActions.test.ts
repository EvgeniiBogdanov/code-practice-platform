import { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { afterEach, describe, expect, it } from "vitest";
import {
  colorBlock,
  convertBlock,
  deleteBlock,
  duplicateBlock,
  getBlockColors,
  type BlockTarget,
} from "./blockActions";
import { BLOCK_ITEMS, CONVERT_ITEMS } from "./blockItems";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

/** The first node of the given type, as the block the menu would act on. */
const findBlock = (editor: Editor, typeName: string, nth = 0): BlockTarget => {
  const found: BlockTarget[] = [];
  editor.state.doc.descendants((node: Node, pos: number) => {
    if (node.type.name === typeName) found.push({ node, pos });
  });
  return found[nth];
};

const markdown = (editor: Editor): string => editor.getMarkdown().trimEnd();

describe("block actions", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("duplicates a block right below itself", () => {
    editor = createEditor("# Заголовок\n\nтекст");

    duplicateBlock(editor, findBlock(editor, "heading"));

    expect(markdown(editor)).toBe("# Заголовок\n\n# Заголовок\n\nтекст");
  });

  it("deletes a block", () => {
    editor = createEditor("первый\n\nвторой");

    deleteBlock(editor, findBlock(editor, "paragraph"));

    expect(markdown(editor)).toBe("второй");
  });

  it("deletes a whole list when its last item goes", () => {
    editor = createEditor("до\n\n- единственный\n\nпосле");

    deleteBlock(editor, findBlock(editor, "listItem"));

    expect(markdown(editor)).toBe("до\n\nпосле");
  });

  it("keeps an editable paragraph when the last block is deleted", () => {
    editor = createEditor("один");

    deleteBlock(editor, findBlock(editor, "paragraph"));

    expect(editor.state.doc.childCount).toBe(1);
    expect(editor.state.doc.firstChild?.type.name).toBe("paragraph");
  });

  it.each([
    ["heading2", "## "],
    ["blockquote", "> "],
    ["orderedList", "1. "],
    ["codeBlock", "```"],
  ])("turns a bullet item into %s without touching its neighbours", (id, prefix) => {
    editor = createEditor("- раз\n- два\n- три");
    const item = BLOCK_ITEMS.find((candidate) => candidate.id === id);

    if (item) convertBlock(editor, findBlock(editor, "listItem", 1), item);

    const result = markdown(editor);
    expect(result).toContain("- раз");
    expect(result).toContain("- три");
    expect(result).toContain(`${prefix}${id === "codeBlock" ? "" : "два"}`);
  });

  it("turns a heading into a task and a quote into text", () => {
    editor = createEditor("## Сделать");
    convertBlock(
      editor,
      findBlock(editor, "heading"),
      BLOCK_ITEMS.find((item) => item.id === "taskList")!
    );
    expect(markdown(editor)).toBe("- [ ] Сделать");

    editor.destroy();
    editor = createEditor("> цитата");
    convertBlock(
      editor,
      findBlock(editor, "blockquote"),
      BLOCK_ITEMS.find((item) => item.id === "paragraph")!
    );
    expect(markdown(editor)).toBe("цитата");
  });

  it("does not offer table or divider as a target for turning into", () => {
    expect(CONVERT_ITEMS.map((item) => item.id)).not.toContain("table");
    expect(CONVERT_ITEMS.map((item) => item.id)).not.toContain("divider");
  });

  it("colours a block, keeps its text marks and stores it as markdown", () => {
    editor = createEditor("Привет **жирный** мир");

    colorBlock(editor, findBlock(editor, "paragraph"), { color: "red" });
    colorBlock(editor, findBlock(editor, "paragraph"), { background: "yellow" });

    expect(getBlockColors(findBlock(editor, "paragraph"))).toEqual({
      color: "red",
      background: "yellow",
    });
    const stored = markdown(editor);
    expect(stored).toContain('<span data-color="red" data-background="yellow">');
    expect(stored).toContain("**жирный**");

    // Reload from the stored markdown: colours come back, markup does not leak into the text.
    const reloaded = createEditor(stored);
    expect(getBlockColors(findBlock(reloaded, "paragraph"))).toEqual({
      color: "red",
      background: "yellow",
    });
    expect(reloaded.getText()).toBe("Привет жирный мир");
    reloaded.destroy();
  });

  it("removes one colour and then the other", () => {
    editor = createEditor("текст");
    colorBlock(editor, findBlock(editor, "paragraph"), { color: "blue", background: "green" });

    colorBlock(editor, findBlock(editor, "paragraph"), { color: null });
    expect(getBlockColors(findBlock(editor, "paragraph"))).toEqual({
      color: null,
      background: "green",
    });

    colorBlock(editor, findBlock(editor, "paragraph"), { background: null });
    expect(markdown(editor)).toBe("текст");
  });
});
