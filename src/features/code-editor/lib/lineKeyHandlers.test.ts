import { describe, expect, it, vi } from "vitest";
import type React from "react";
import { handleLineCommands } from "./lineKeyHandlers";

const press = (
  key: Partial<React.KeyboardEvent<HTMLTextAreaElement>> & { key: string },
  code: string,
  selection: [number, number] = [0, 0],
  options?: { smartHome?: boolean }
) => {
  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.setSelectionRange(selection[0], selection[1]);
  const applyEdit = vi.fn();
  const preventDefault = vi.fn();
  const handled = handleLineCommands(
    {
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      preventDefault,
      ...key,
    } as React.KeyboardEvent<HTMLTextAreaElement>,
    textarea,
    code,
    applyEdit,
    2,
    options
  );
  return { handled, applyEdit, preventDefault, textarea };
};

describe("handleLineCommands", () => {
  it("deletes the line on Ctrl+Shift+K and Cmd+Shift+K", () => {
    for (const mod of [{ ctrlKey: true }, { metaKey: true }]) {
      const { handled, applyEdit } = press({ key: "K", shiftKey: true, ...mod }, "a\nb\nc", [2, 2]);
      expect(handled).toBe(true);
      expect(applyEdit).toHaveBeenCalledWith("a\nc", 2, 2);
    }
  });

  it("opens a line above on Ctrl+Shift+Enter", () => {
    const { applyEdit } = press({ key: "Enter", ctrlKey: true, shiftKey: true }, "  x", [3, 3]);
    expect(applyEdit).toHaveBeenCalledWith("  \n  x", 2, 2);
  });

  it("indents and outdents the selected lines with Ctrl+] and Ctrl+[", () => {
    expect(press({ key: "]", ctrlKey: true }, "a\nb", [0, 3]).applyEdit).toHaveBeenCalledWith(
      "  a\n  b",
      0,
      7
    );
    expect(press({ key: "[", ctrlKey: true }, "  a", [2, 2]).applyEdit).toHaveBeenCalledWith(
      "a",
      0,
      0
    );
  });

  it("moves Home between the first character and column 0 without editing", () => {
    const first = press({ key: "Home" }, "  abc", [4, 4]);
    expect(first.handled).toBe(true);
    expect(first.textarea.selectionStart).toBe(2);
    expect(first.applyEdit).not.toHaveBeenCalled();
    expect(press({ key: "Home" }, "  abc", [2, 2]).textarea.selectionStart).toBe(0);
  });

  it("extends the selection on Shift+Home from the anchor", () => {
    const { textarea } = press({ key: "Home", shiftKey: true }, "  abc", [4, 4]);
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([2, 4]);
    expect(textarea.selectionDirection).toBe("backward");
  });

  it("leaves Home to the browser when word wrap is on, and ignores other keys", () => {
    expect(press({ key: "Home" }, "  abc", [4, 4], { smartHome: false }).handled).toBe(false);
    expect(press({ key: "x", ctrlKey: true }, "abc").handled).toBe(false);
    expect(press({ key: "k", shiftKey: true }, "abc").handled).toBe(false);
    expect(press({ key: "K", shiftKey: true, ctrlKey: true, altKey: true }, "abc").handled).toBe(
      false
    );
  });
});
