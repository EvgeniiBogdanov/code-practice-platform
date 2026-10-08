import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

/** The classes the highlighter puts on the code block's text. */
const decoratedHtml = (editor: Editor): string => editor.view.dom.innerHTML;

describe("note code block", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("keeps the fence language through markdown and back", () => {
    editor = createEditor("```js\nconst a = 1;\n```");

    expect(editor.getJSON().content?.[0].attrs?.language).toBe("js");
    expect(editor.getMarkdown().trimEnd()).toBe("```js\nconst a = 1;\n```");
  });

  it("highlights the block by its language, and not without one", () => {
    editor = createEditor("```js\nconst a = 1;\n```");
    expect(decoratedHtml(editor)).toContain("hl-kw");

    editor.commands.updateAttributes("codeBlock", { language: null });
    expect(decoratedHtml(editor)).not.toContain("hl-kw");

    editor.commands.updateAttributes("codeBlock", { language: "css" });
    expect(decoratedHtml(editor)).not.toContain("hl-kw");
  });

  it("recolours as the code is typed", () => {
    editor = createEditor("```js\nlet\n```");
    editor.commands.focus("end");

    editor.commands.insertContent(" x = 1");

    expect(editor.getMarkdown()).toContain("let x = 1");
    expect(decoratedHtml(editor)).toContain("hl-kw");
  });

  it("indents with Tab inside a code block only", () => {
    editor = createEditor("```js\na\n```");
    editor.commands.setTextSelection(1);

    editor.view.someProp("handleKeyDown", (handle) =>
      handle(editor.view, new KeyboardEvent("keydown", { key: "Tab" }))
    );

    expect(editor.getText().trimEnd()).toBe("  a");
  });

  it("selects only the code on Ctrl/⌘+A, and the whole page on the second press", () => {
    editor = createEditor("до\n\n```js\nconst a = 1;\nlet b;\n```\n\nпосле");
    let codeStart = 0;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "codeBlock") codeStart = pos;
    });
    editor.commands.setTextSelection(codeStart + 3);
    const pressSelectAll = (): void => {
      editor.view.someProp("handleKeyDown", (handle) =>
        handle(editor.view, new KeyboardEvent("keydown", { key: "a", ctrlKey: true }))
      );
    };

    pressSelectAll();
    const { from, to } = editor.state.selection;
    expect(editor.state.doc.textBetween(from, to)).toBe("const a = 1;\nlet b;");

    pressSelectAll();
    expect(editor.state.selection.from).toBeLessThanOrEqual(codeStart);
    expect(editor.state.selection.to).toBeGreaterThan(codeStart + 20);
  });

  it("shows no line hint behind an empty code block", () => {
    editor = createEditor("");

    editor.commands.toggleCodeBlock();

    const block = editor.view.dom.firstElementChild;
    expect(block?.getAttribute("data-placeholder")).toBe("");
  });
});
