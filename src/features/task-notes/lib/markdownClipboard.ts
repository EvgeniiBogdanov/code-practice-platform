import { Extension } from "@tiptap/core";
import { Slice } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { applyCodeLanguageLabels } from "./codeLanguageHints";

/** Pastes from editors that attach styled HTML to what is really plain source text. */
const SOURCE_EDITOR_MIME = "vscode-editor-data";
const CODE_FENCE = /^\s*(?:```|~~~)/m;
/** ProseMirror marks the html of its own copies with this attribute. */
const OWN_SLICE_MARK = "data-pm-slice";

/**
 * The note is shown as rich text, but the clipboard speaks markdown:
 * copying a selection puts its markdown source into `text/plain`,
 * and pasting plain markdown text turns it back into blocks.
 */
export const MarkdownClipboard = Extension.create({
  name: "markdownClipboard",

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: new PluginKey("markdownClipboard"),
        props: {
          clipboardTextSerializer: (slice, view) => {
            const { $from, $to } = view.state.selection;
            const single = slice.content.firstChild;
            const isPartOfLine =
              slice.content.childCount === 1 &&
              single?.isTextblock &&
              $from.sameParent($to) &&
              !($from.parentOffset === 0 && $to.parentOffset === $to.parent.content.size);

            // A few words copied out of a heading or list item should stay plain text.
            const blocks =
              isPartOfLine && single
                ? [{ type: "paragraph", content: single.content.toJSON() ?? [] }]
                : slice.content.toJSON();

            return editor.markdown?.serialize({ type: "doc", content: blocks }).trimEnd() ?? "";
          },

          // A language label above pasted code becomes the code block's language.
          transformPasted: (slice) =>
            new Slice(applyCodeLanguageLabels(slice.content), slice.openStart, slice.openEnd),

          handlePaste: (view, event) => {
            const data = event.clipboardData;
            const text = data?.getData("text/plain");
            if (!data || !text) return false;
            if (view.state.selection.$from.parent.type.spec.code) return false;

            // Rich html is parsed as such, unless the text is markdown source (it has code fences):
            // rendered html loses the code's language, the fence keeps it. Copies from this editor
            // carry their own structure and always go the html way.
            const html = data.getData("text/html");
            const isSourceText =
              !data.types.includes("text/html") ||
              data.types.includes(SOURCE_EDITOR_MIME) ||
              (CODE_FENCE.test(text) && !html.includes(OWN_SLICE_MARK));
            if (!isSourceText) return false;

            event.preventDefault();
            return editor.commands.insertContent(text, { contentType: "markdown" });
          },
        },
      }),
    ];
  },
});
