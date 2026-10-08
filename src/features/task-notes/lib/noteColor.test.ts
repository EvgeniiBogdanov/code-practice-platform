import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it } from "vitest";
import { createNoteExtensions } from "./noteExtensions";

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

describe("setNoteColor on a selection", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("colours only the selected words and keeps the rest plain", () => {
    editor = createEditor("Создать один файл");
    editor.commands.setTextSelection({ from: 1, to: 8 });

    editor.commands.setNoteColor({ color: "orange" });

    expect(editor.getMarkdown().trimEnd()).toBe(
      '<span data-color="orange">Создать</span> один файл'
    );
  });

  it("adds a background to a coloured selection without losing the text colour", () => {
    editor = createEditor("Создать один файл");
    editor.commands.setTextSelection({ from: 1, to: 8 });

    editor.commands.setNoteColor({ color: "orange" });
    editor.commands.setNoteColor({ background: "yellow" });

    expect(editor.getMarkdown().trimEnd()).toBe(
      '<span data-color="orange" data-background="yellow">Создать</span> один файл'
    );
  });

  it("clears the mark once both colours are gone", () => {
    editor = createEditor("Создать один файл");
    editor.commands.setTextSelection({ from: 1, to: 8 });
    editor.commands.setNoteColor({ color: "red", background: "blue" });

    editor.commands.setNoteColor({ color: null });
    editor.commands.setNoteColor({ background: null });

    expect(editor.getMarkdown().trimEnd()).toBe("Создать один файл");
  });
});
