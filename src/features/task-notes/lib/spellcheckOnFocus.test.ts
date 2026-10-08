import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { createNoteExtensions } from "./noteExtensions";

describe("spellcheck on focus", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("keeps spellcheck off while the note is only being read", () => {
    editor = new Editor({ extensions: createNoteExtensions(), content: "оштбка" });

    expect(editor.view.dom).toHaveAttribute("spellcheck", "false");
  });

  it("turns it on while the editor has focus and off again when focus leaves", () => {
    editor = new Editor({ extensions: createNoteExtensions(), content: "оштбка" });

    editor.view.dom.dispatchEvent(new FocusEvent("focus"));
    expect(editor.view.dom).toHaveAttribute("spellcheck", "true");

    editor.view.dom.dispatchEvent(new FocusEvent("blur"));
    expect(editor.view.dom).toHaveAttribute("spellcheck", "false");
  });
});
