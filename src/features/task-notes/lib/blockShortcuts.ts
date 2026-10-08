import { Extension } from "@tiptap/core";
import { shiftBlock } from "./blockMove";

/** Ctrl/⌘+Shift+↑/↓ moves the block under the caret, as in Notion. */
export const BlockShortcuts = Extension.create({
  name: "blockShortcuts",

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-ArrowUp": ({ editor }) => shiftBlock(editor, -1),
      "Mod-Shift-ArrowDown": ({ editor }) => shiftBlock(editor, 1),
    };
  },
});
