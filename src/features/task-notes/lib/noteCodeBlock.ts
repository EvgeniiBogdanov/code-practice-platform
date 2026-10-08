import type { NodeViewRenderer } from "@tiptap/core";
import CodeBlock from "@tiptap/extension-code-block";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { getHighlightRanges } from "./codeHighlightRanges";
import { detectCodeLanguage } from "./codeLanguageHints";

const INDENT = "  ";

const highlightKey = new PluginKey<DecorationSet>("noteCodeHighlight");

/** Colours every code block with the viewer's highlighter, for the language chosen on the block. */
const createHighlightPlugin = (typeName: string): Plugin<DecorationSet> =>
  new Plugin<DecorationSet>({
    key: highlightKey,
    state: {
      init: (_config, state) => buildDecorations(state.doc, typeName),
      apply: (tr, decorations) =>
        tr.docChanged ? buildDecorations(tr.doc, typeName) : decorations.map(tr.mapping, tr.doc),
    },
    props: { decorations: (state) => highlightKey.getState(state) },
  });

const buildDecorations = (
  doc: Parameters<typeof DecorationSet.create>[0],
  typeName: string
): DecorationSet => {
  const decorations: Decoration[] = [];
  doc.descendants((node, pos) => {
    if (node.type.name !== typeName) return true;
    for (const { from, to, className } of getHighlightRanges(
      node.textContent,
      node.attrs.language
    )) {
      // Text of the block starts right after its opening token.
      decorations.push(Decoration.inline(pos + 1 + from, pos + 1 + to, { class: className }));
    }
    return false;
  });
  return DecorationSet.create(doc, decorations);
};

/**
 * The note's code block: markdown fences with a language, highlighting, Tab to indent, and an
 * optional node view that wraps it in the shared code window.
 */
export const createNoteCodeBlock = (nodeView?: NodeViewRenderer): typeof CodeBlock =>
  CodeBlock.extend({
    addNodeView: nodeView ? () => nodeView : undefined,

    addAttributes() {
      return {
        ...this.parent?.(),
        // Also reads the markers other sites use (`lang-js`, `highlight-source-js`, `data-language`).
        language: {
          default: null,
          rendered: false,
          parseHTML: (element: HTMLElement): string | null => detectCodeLanguage(element),
        },
      };
    },

    addProseMirrorPlugins() {
      return [...(this.parent?.() ?? []), createHighlightPlugin(this.name)];
    },

    addKeyboardShortcuts() {
      const isInCode = (): boolean => this.editor.isActive(this.name);
      return {
        ...this.parent?.(),
        // Select all stays inside the code; pressed again, with all of it selected, it takes the page.
        "Mod-a": ({ editor }) => {
          if (!isInCode()) return false;
          const { selection } = editor.state;
          const from = selection.$from.start();
          const to = selection.$from.end();
          if (selection.from === from && selection.to === to) return false;
          return editor.commands.setTextSelection({ from, to });
        },
        Tab: ({ editor }) => (isInCode() ? editor.commands.insertContent(INDENT) : false),
        "Shift-Tab": ({ editor }) => {
          if (!isInCode()) return false;
          const { $from } = editor.state.selection;
          const lineStart =
            $from.start() + $from.parent.textContent.lastIndexOf("\n", $from.parentOffset - 1) + 1;
          const hasIndent =
            editor.state.doc.textBetween(lineStart, lineStart + INDENT.length) === INDENT;
          return hasIndent
            ? editor.commands.deleteRange({ from: lineStart, to: lineStart + INDENT.length })
            : true;
        },
      };
    },
  });
