import { Extension } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { BlockTarget } from "./blockActions";

export const DRAG_SOURCE_CLASS = "note-drag-source";

const dragSourceKey = new PluginKey<DecorationSet>("noteDragSource");

/** Marks the block being dragged, so the page can dim it. */
export const DragSource = Extension.create({
  name: "dragSource",

  addProseMirrorPlugins() {
    return [
      new Plugin<DecorationSet>({
        key: dragSourceKey,
        state: {
          init: () => DecorationSet.empty,
          apply: (tr, decorations) => {
            const marked: BlockTarget | null | undefined = tr.getMeta(dragSourceKey);
            if (marked === undefined) return decorations.map(tr.mapping, tr.doc);
            return marked
              ? DecorationSet.create(tr.doc, [
                  Decoration.node(marked.pos, marked.pos + marked.node.nodeSize, {
                    class: DRAG_SOURCE_CLASS,
                  }),
                ])
              : DecorationSet.empty;
          },
        },
        props: { decorations: (state) => dragSourceKey.getState(state) },
      }),
    ];
  },
});

export const markDragSource = (editor: Editor, block: BlockTarget | null): void => {
  editor.view.dispatch(
    editor.state.tr.setMeta(dragSourceKey, block).setMeta("addToHistory", false)
  );
};
