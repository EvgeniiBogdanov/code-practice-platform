import type { Extensions, NodeViewRenderer } from "@tiptap/core";
import { Markdown } from "@tiptap/markdown";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import { BlockShortcuts } from "./blockShortcuts";
import { DragSource } from "./dragSource";
import { MarkdownClipboard } from "./markdownClipboard";
import { createNoteCodeBlock } from "./noteCodeBlock";
import { NoteColor } from "./noteColor";
import { SpellcheckOnFocus } from "./spellcheckOnFocus";

const HEADING_PLACEHOLDER = "Заголовок";
const LINE_PLACEHOLDER = "Напишите что-нибудь или нажмите «/», чтобы выбрать блок…";

/** Everything the note editor can hold. Each node and mark has a markdown form, so the note stays markdown at rest. */
export interface NoteExtensionsOptions {
  /** How code blocks are drawn; plain `<pre>` when left out. */
  codeBlockView?: NodeViewRenderer;
  extra?: Extensions;
}

export const createNoteExtensions = ({
  codeBlockView,
  extra = [],
}: NoteExtensionsOptions = {}): Extensions => [
  StarterKit.configure({
    // Markdown has no underline.
    underline: false,
    // Replaced below: same fences, plus a language, highlighting and an editable code window.
    codeBlock: false,
    link: { openOnClick: false },
  }),
  createNoteCodeBlock(codeBlockView),
  TaskList,
  TaskItem.configure({ nested: true }),
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    // Only lines of text get a hint: an empty code block (or any node with its own look) must
    // not show it through behind its window.
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return HEADING_PLACEHOLDER;
      return node.type.name === "paragraph" ? LINE_PLACEHOLDER : "";
    },
  }),
  Markdown.configure({ markedOptions: { gfm: true } }),
  MarkdownClipboard,
  NoteColor,
  DragSource,
  SpellcheckOnFocus,
  BlockShortcuts,
  ...extra,
];
