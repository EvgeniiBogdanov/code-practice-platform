import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { createNoteExtensions } from "../../lib/noteExtensions";
import { BlockMenuExtension, markBlockMenuOpenedByButton } from "./blockMenuExtension";

const createEditor = (): Editor =>
  new Editor({
    extensions: createNoteExtensions({ extra: [BlockMenuExtension] }),
    content: "<p></p>",
  });

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe("block menu opened with the + button", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("takes its slash back when the menu closes without a choice", async () => {
    editor = createEditor();
    markBlockMenuOpenedByButton(editor);
    editor.chain().focus().insertContent("/").run();
    await tick();
    expect(editor.getText()).toBe("/");

    // Leaving the line closes the menu (the same exit as a click outside or Escape).
    editor.commands.insertContentAt(editor.state.doc.content.size, { type: "paragraph" });
    editor.commands.focus("end");
    await tick();
    await tick();

    expect(editor.getText()).not.toContain("/");
  });

  it("leaves a slash the person typed themselves", async () => {
    editor = createEditor();
    editor.chain().focus().insertContent("/").run();
    editor.commands.insertContentAt(editor.state.doc.content.size, { type: "paragraph" });
    editor.commands.focus("end");
    await tick();
    await tick();

    expect(editor.getText()).toContain("/");
  });

  it("closes at the first press outside, takes its lone slash along and keeps typed text", async () => {
    editor = createEditor();
    editor.chain().focus().insertContent("/").run();
    await tick();

    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(editor.getText()).not.toContain("/");

    editor.chain().focus().insertContent("/заг").run();
    await tick();
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(editor.getText()).toContain("/заг");
  });
});
