import type { Editor } from "@tiptap/core";
import { DOMSerializer, type Node } from "@tiptap/pm/model";
import { NodeSelection, Selection } from "@tiptap/pm/state";
import type { BlockItem } from "./blockItems";
import type { NoteColorName } from "./noteColor";

/** A block of the page: the node and the position it starts at. */
export interface BlockTarget {
  node: Node;
  pos: number;
}

export interface BlockColors {
  color: NoteColorName | null;
  background: NoteColorName | null;
}

const MAX_LIFTS = 8;

/** The node range to remove: the block itself, or its parent when the block is the only child. */
export const getRemovableRange = (
  editor: Editor,
  { node, pos }: BlockTarget
): { from: number; to: number } => {
  const $pos = editor.state.doc.resolve(pos);
  let range = { from: pos, to: pos + node.nodeSize };
  for (let depth = $pos.depth; depth > 0 && $pos.node(depth).childCount === 1; depth -= 1) {
    range = { from: $pos.before(depth), to: $pos.after(depth) };
  }
  return range;
};

export const selectBlock = (editor: Editor, { pos }: BlockTarget): void => {
  const { tr } = editor.state;
  editor.view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)));
};

export const deleteBlock = (editor: Editor, target: BlockTarget): void => {
  const { from, to } = getRemovableRange(editor, target);
  editor.chain().focus().deleteRange({ from, to }).run();
};

export const duplicateBlock = (editor: Editor, { node, pos }: BlockTarget): void => {
  editor.view.dispatch(
    editor.state.tr.insert(pos + node.nodeSize, node.copy(node.content)).scrollIntoView()
  );
};

export const toHtml = (editor: Editor, node: Node): string => {
  const wrapper = document.createElement("div");
  wrapper.append(DOMSerializer.fromSchema(editor.schema).serializeNode(node));
  return wrapper.innerHTML;
};

/** Puts the block on the clipboard as markdown text plus html, so it pastes well anywhere. */
export const copyBlock = async (editor: Editor, { node }: BlockTarget): Promise<void> => {
  const markdown =
    editor.markdown?.serialize({ type: "doc", content: [node.toJSON()] }).trimEnd() ?? "";
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([markdown], { type: "text/plain" }),
        "text/html": new Blob([toHtml(editor, node)], { type: "text/html" }),
      }),
    ]);
  } catch {
    await navigator.clipboard.writeText(markdown);
  }
};

export const cutBlock = async (editor: Editor, target: BlockTarget): Promise<void> => {
  await copyBlock(editor, target);
  deleteBlock(editor, target);
};

/** Gets the block out of any list or quote around it and makes it a plain paragraph. */
const flattenBlock = (editor: Editor, { pos }: BlockTarget): void => {
  const { tr } = editor.state;
  editor.view.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(pos + 1), 1)));

  for (let step = 0; step < MAX_LIFTS; step += 1) {
    if (editor.isActive("taskItem")) editor.commands.liftListItem("taskItem");
    else if (editor.isActive("listItem")) editor.commands.liftListItem("listItem");
    else if (editor.isActive("blockquote")) editor.commands.lift("blockquote");
    else break;
  }
  editor.commands.setParagraph();
};

export const convertBlock = (editor: Editor, target: BlockTarget, item: BlockItem): void => {
  flattenBlock(editor, target);
  item.apply(editor.chain().focus()).run();
};

/** Colours of the block's first run of text, which the colour menu marks as current. */
export const getBlockColors = ({ node }: BlockTarget): BlockColors => {
  const current: BlockColors = { color: null, background: null };
  let isFound = false;
  node.descendants((child) => {
    if (isFound) return false;
    const mark = child.marks.find((candidate) => candidate.type.name === "noteColor");
    if (!mark) return true;
    current.color = mark.attrs.color ?? null;
    current.background = mark.attrs.background ?? null;
    isFound = true;
    return false;
  });
  return current;
};

/** Colours all text of the block; a part left out of `colors` keeps its current value. */
export const colorBlock = (
  editor: Editor,
  { node, pos }: BlockTarget,
  colors: Partial<BlockColors>
): void => {
  const markType = editor.schema.marks.noteColor;
  const { tr } = editor.state;

  tr.doc.nodesBetween(pos, pos + node.nodeSize, (child, childPos) => {
    if (!child.isText) return true;
    const existing = child.marks.find((mark) => mark.type === markType);
    const next = {
      color: colors.color === undefined ? (existing?.attrs.color ?? null) : colors.color,
      background:
        colors.background === undefined ? (existing?.attrs.background ?? null) : colors.background,
    };
    tr.removeMark(childPos, childPos + child.nodeSize, markType);
    if (next.color || next.background) {
      tr.addMark(childPos, childPos + child.nodeSize, markType.create(next));
    }
    return false;
  });

  editor.view.dispatch(tr);
};

/** Drops the whole-block highlight so typing afterwards does not replace the block. */
export const releaseBlockSelection = (editor: Editor): void => {
  const { selection, tr } = editor.state;
  if (!(selection instanceof NodeSelection)) return;
  editor.view.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(selection.to), -1)));
};
