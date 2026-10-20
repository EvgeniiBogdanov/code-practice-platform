import { Extension, type Editor } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { ReactRenderer } from "@tiptap/react";
import {
  Suggestion,
  SuggestionPluginKey,
  exitSuggestion,
  findSuggestionMatch,
  type SuggestionMatch,
  type SuggestionOptions,
  type Trigger,
} from "@tiptap/suggestion";
import { getBlockMenuFilterPos } from "../../lib/blockMenuFilter";
import { filterBlockItems, type BlockItem } from "../../lib/blockItems";
import { BlockMenu, type BlockMenuHandle } from "./BlockMenu";
import styles from "./BlockMenu.module.css";

/** Marks the "+" button's transaction: it may reopen a menu closed with Escape on that line. */
const OPENED_BY_BUTTON = "blockMenuOpenedByButton";

/** Where the "+" button opened the menu: the start of an empty line, whose text is the filter. */
const buttonLines = new WeakMap<Editor, number>();

/**
 * Opens the block menu on the empty line starting at `pos`, like Notion's "+": no "/" lands in the
 * text, the line shows a filter hint, and what is typed there filters the menu.
 */
export const openBlockMenu = (editor: Editor, pos: number): void => {
  buttonLines.set(editor, pos);
  editor.chain().focus().setTextSelection(pos).setMeta(OPENED_BY_BUTTON, true).run();
};

/** The "+" menu matches its line up to the caret; elsewhere a typed "/" opens the menu as usual. */
const findBlockMenuMatch = (editor: Editor, trigger: Trigger): SuggestionMatch => {
  const lineStart = buttonLines.get(editor);
  const { $position } = trigger;
  if (lineStart === undefined || $position.start() !== lineStart) {
    return findSuggestionMatch(trigger);
  }
  const query = $position.parent.textBetween(0, $position.parentOffset);
  // A space ends the filter, as it ends a "/" query.
  if (/\s/.test(query)) return null;
  return { range: { from: lineStart, to: $position.pos }, query, text: query };
};

/** Gives the "+" menu's empty line a class, so its filter hint reads as a field. */
const createFilterLinePlugin = (): Plugin =>
  new Plugin({
    props: {
      decorations: (state) => {
        const pos = getBlockMenuFilterPos(state);
        if (pos === null) return null;
        const $pos = state.doc.resolve(pos);
        return DecorationSet.create(state.doc, [
          Decoration.node($pos.before(), $pos.after(), { class: "is-block-filter" }),
        ]);
      },
    },
  });

const suggestion: Omit<SuggestionOptions<BlockItem>, "editor"> = {
  char: "/",
  items: ({ query }) => [...filterBlockItems(query)],
  shouldResetDismissed: ({ transaction }) => transaction.getMeta(OPENED_BY_BUTTON) === true,
  command: ({ editor, range, props }) => {
    // Otherwise the line, empty again once the filter text goes, would reopen the menu.
    buttonLines.delete(editor);
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
          props: { items: props.items, onSelect: props.command, heading: "Блоки" },
          className: styles.popup,
        });
        unmount = props.mount(renderer.element);
      },
      onUpdate: (props) => {
        renderer?.updateProps({ items: props.items, onSelect: props.command });
      },
      onKeyDown: ({ event }) => renderer?.ref?.onKeyDown(event) ?? false,
      onExit: ({ editor }) => {
        document.removeEventListener("pointerdown", closeOnOutsidePress, true);
        currentEditor = null;
        buttonLines.delete(editor);
        unmount?.();
        renderer?.destroy();
        renderer = null;
        unmount = null;
      },
    };
  },
};

/** "/" on a line, or the "+" button next to an empty one, opens the list of blocks it can become. */
export const BlockMenuExtension = Extension.create({
  name: "blockMenu",

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      Suggestion({
        editor,
        ...suggestion,
        findSuggestionMatch: (trigger) => findBlockMenuMatch(editor, trigger),
      }),
      createFilterLinePlugin(),
    ];
  },
});
