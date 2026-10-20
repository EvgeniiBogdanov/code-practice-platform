import { Editor } from "@tiptap/core";
import { SuggestionPluginKey, exitSuggestion } from "@tiptap/suggestion";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { createNoteExtensions } from "../../lib/noteExtensions";
import { BlockMenuExtension, openBlockMenu } from "./blockMenuExtension";

// jsdom lays nothing out, and the "+" menu is placed at the caret, which is measured on a range.
beforeAll(() => {
  Range.prototype.getClientRects = (): DOMRectList =>
    document.createElement("span").getClientRects();
  Range.prototype.getBoundingClientRect = (): DOMRect => new DOMRect();
});

const createEditor = (): Editor =>
  new Editor({
    extensions: createNoteExtensions({ extra: [BlockMenuExtension] }),
    content: "<p></p>",
  });

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe("block menu opened with the + button", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  it("opens on the empty line without typing a slash, showing a filter hint there", () => {
    editor = createEditor();

    openBlockMenu(editor, 1);

    const line = editor.view.dom.querySelector("p");
    expect(editor.getText()).toBe("");
    expect(SuggestionPluginKey.getState(editor.state)).toMatchObject({ active: true, query: "" });
    expect(line).toHaveAttribute("data-placeholder", "Введите для фильтра…");
    expect(line).toHaveClass("is-block-filter");
  });

  it("filters by what is typed on the line and keeps that text when closed", () => {
    editor = createEditor();
    openBlockMenu(editor, 1);

    editor.commands.insertContent("заг");
    expect(SuggestionPluginKey.getState(editor.state)).toMatchObject({
      active: true,
      query: "заг",
    });

    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(SuggestionPluginKey.getState(editor.state)).toMatchObject({ active: false });
    expect(editor.getText()).toBe("заг");
  });

  it("opens again after being closed with Escape", () => {
    editor = createEditor();
    openBlockMenu(editor, 1);
    exitSuggestion(editor.view);
    expect(SuggestionPluginKey.getState(editor.state)).toMatchObject({ active: false });

    openBlockMenu(editor, 1);

    expect(SuggestionPluginKey.getState(editor.state)).toMatchObject({ active: true });
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
