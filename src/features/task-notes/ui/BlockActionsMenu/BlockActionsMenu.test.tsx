import { fireEvent, render, screen } from "@testing-library/react";
import { Editor } from "@tiptap/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BlockTarget } from "../../lib/blockActions";
import { createNoteExtensions } from "../../lib/noteExtensions";
import { BlockActionsMenu } from "./BlockActionsMenu";

const ANCHOR = new DOMRect(0, 0, 24, 24);

const createEditor = (markdown: string): Editor =>
  new Editor({ extensions: createNoteExtensions(), content: markdown, contentType: "markdown" });

const firstBlock = (editor: Editor): BlockTarget => ({ node: editor.state.doc.child(0), pos: 0 });

describe("BlockActionsMenu", () => {
  let editor: Editor;

  afterEach(() => editor.destroy());

  const renderMenu = (markdown: string, onClose = vi.fn()): ReturnType<typeof vi.fn> => {
    editor = createEditor(markdown);
    render(
      <BlockActionsMenu
        editor={editor}
        target={firstBlock(editor)}
        anchor={ANCHOR}
        onClose={onClose}
      />
    );
    return onClose;
  };

  it("duplicates the block and closes", () => {
    const onClose = renderMenu("# Заголовок\n\nтекст");

    fireEvent.click(screen.getByRole("menuitem", { name: "Дублировать" }));

    expect(editor.getMarkdown().trimEnd()).toBe("# Заголовок\n\n# Заголовок\n\nтекст");
    expect(onClose).toHaveBeenCalled();
  });

  it("deletes the block", () => {
    renderMenu("первый\n\nвторой");

    fireEvent.click(screen.getByRole("menuitem", { name: "Удалить" }));

    expect(editor.getMarkdown().trimEnd()).toBe("второй");
  });

  it("turns the block into another one from the submenu", () => {
    renderMenu("текст");

    fireEvent.click(screen.getByRole("menuitem", { name: "Преобразовать в" }));
    fireEvent.click(screen.getByRole("option", { name: /Цитата/ }));

    expect(editor.getMarkdown().trimEnd()).toBe("> текст");
  });

  it("colours the block text and background from the submenu", () => {
    renderMenu("текст");

    fireEvent.click(screen.getByRole("menuitem", { name: "Цвет" }));
    const [textRed] = screen.getAllByRole("option", { name: "Красный" });
    fireEvent.click(textRed);

    expect(editor.getMarkdown().trimEnd()).toBe('<span data-color="red">текст</span>');
  });

  it("walks the menu with the keyboard and closes on Escape", () => {
    const onClose = renderMenu("текст");
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(editor.getMarkdown().trimEnd()).toBe("текст\n\nтекст");

    fireEvent.keyDown(menu, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("offers no turn-into for a table", () => {
    renderMenu("| a | b |\n| --- | --- |\n| 1 | 2 |");

    expect(screen.queryByRole("menuitem", { name: "Преобразовать в" })).not.toBeInTheDocument();
  });
});
