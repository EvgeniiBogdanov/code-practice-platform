import { Extension, type Editor } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import {
  Suggestion,
  SuggestionPluginKey,
  exitSuggestion,
  type SuggestionOptions,
} from "@tiptap/suggestion";
import { filterBlockItems, type BlockItem } from "../../lib/blockItems";
import { BlockMenu, type BlockMenuHandle } from "./BlockMenu";

/** Editors whose open block menu was started by the "+" button, not by typing "/". */
const openedByButton = new WeakSet<Editor>();

/**
 * Call right before the button inserts its "/". If the menu then closes without a choice, that
 * "/" is removed again: the person never typed it, so it must not stay behind as stray text.
 * (A "/" they typed is removed only when they close the menu by clicking away.)
 */
export const markBlockMenuOpenedByButton = (editor: Editor): void => {
  openedByButton.add(editor);
};

const suggestion: Omit<SuggestionOptions<BlockItem>, "editor"> = {
  char: "/",
  items: ({ query }) => [...filterBlockItems(query)],
  command: ({ editor, range, props }) => {
    openedByButton.delete(editor);
    props.apply(editor.chain().focus().deleteRange(range)).run();
  },
  render: () => {
    let renderer: ReactRenderer<BlockMenuHandle> | null = null;
    let unmount: (() => void) | null = null;
    let currentEditor: Editor | null = null;

    /**
     * A press anywhere outside the menu closes it at once. Clicks inside the editor do not close
     * it by themselves (the caret may stay on the "/"), which took several clicks to get rid of it.
     * A lone "/" goes with the menu; anything typed after it is the person's text and stays.
     */
    const closeOnOutsidePress = (event: PointerEvent): void => {
      const editor = currentEditor;
      if (!editor || (event.target instanceof Node && renderer?.element.contains(event.target))) {
        return;
      }
      const range = SuggestionPluginKey.getState(editor.state)?.range;
      if (range && editor.state.doc.textBetween(range.from, range.to) === "/") {
        editor.chain().deleteRange(range).run();
      } else {
        exitSuggestion(editor.view);
      }
    };

    return {
      onStart: (props) => {
        currentEditor = props.editor;
        document.addEventListener("pointerdown", closeOnOutsidePress, true);
        renderer = new ReactRenderer(BlockMenu, {
          editor: props.editor,
          props: { items: props.items, onSelect: props.command },
        });
        unmount = props.mount(renderer.element);
      },
      onUpdate: (props) => {
        renderer?.updateProps({ items: props.items, onSelect: props.command });
      },
      onKeyDown: ({ event }) => renderer?.ref?.onKeyDown(event) ?? false,
      onExit: ({ editor, range }) => {
        document.removeEventListener("pointerdown", closeOnOutsidePress, true);
        currentEditor = null;
        if (openedByButton.delete(editor)) {
          // Closed some other way (Esc, leaving the line) without a choice: the button's "/" goes.
          // Not inside this update, which cannot dispatch.
          setTimeout(() => {
            if (editor.isDestroyed) return;
            const { doc } = editor.state;
            if (range.to <= doc.content.size && doc.textBetween(range.from, range.to) === "/") {
              editor.chain().deleteRange(range).run();
            }
          }, 0);
        }
        unmount?.();
        renderer?.destroy();
        renderer = null;
        unmount = null;
      },
    };
  },
};

/** Typing "/" on a line opens the list of blocks that line can become. */
export const BlockMenuExtension = Extension.create({
  name: "blockMenu",

  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...suggestion })];
  },
});
