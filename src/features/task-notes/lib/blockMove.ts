import type { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { Selection } from "@tiptap/pm/state";
import { getRemovableRange, type BlockTarget } from "./blockActions";
import { getTopLevelBlock, isListItem, resolveBlock } from "./blockPosition";

/** Where a dragged block would land, and what the drop line is drawn against. */
export interface DropSlot {
  insertPos: number;
  /** A list item dropped outside a list of its own kind gets a fresh list around it. */
  wrapperType: string | null;
  /** The block whose edge the drop line is drawn on. */
  anchor: BlockTarget;
  placeAfter: boolean;
}

/**
 * Resolves a drop next to `target`. A list item dropped by another item of its kind joins that
 * list; anything else lands beside the whole top-level block, which keeps lists intact.
 * Returns null where the drop would change nothing or put a block inside itself.
 */
export const getDropSlot = (
  doc: Node,
  source: BlockTarget,
  target: BlockTarget,
  placeAfter: boolean
): DropSlot | null => {
  const sourceEnd = source.pos + source.node.nodeSize;
  const isSibling = isListItem(source.node) && target.node.type === source.node.type;
  const anchor = isSibling ? target : getTopLevelBlock(doc, target);
  const insertPos = placeAfter ? anchor.pos + anchor.node.nodeSize : anchor.pos;

  const isInsideSource = anchor.pos >= source.pos && anchor.pos < sourceEnd;
  const isStayingPut =
    !isSibling && !isListItem(source.node) && (insertPos === source.pos || insertPos === sourceEnd);
  const isSameSpot = isSibling && (insertPos === source.pos || insertPos === sourceEnd);
  if (isInsideSource || isStayingPut || isSameSpot) return null;

  const wrapperType =
    !isSibling && isListItem(source.node) ? doc.resolve(source.pos).parent.type.name : null;
  return { insertPos, wrapperType, anchor, placeAfter };
};

/** Moves the block into the slot, then puts the caret in it. */
export const moveBlock = (editor: Editor, source: BlockTarget, slot: DropSlot): void => {
  const { tr, schema } = editor.state;
  const { from, to } = getRemovableRange(editor, source);
  if (slot.insertPos > from && slot.insertPos < to) return;

  const wrapper = slot.wrapperType ? schema.nodes[slot.wrapperType] : null;
  const content = wrapper ? wrapper.create(null, source.node) : source.node;

  // Whichever side changes first must leave the other side's position untouched.
  const isInsertingBefore = slot.insertPos <= from;
  const landedAt = isInsertingBefore ? slot.insertPos : slot.insertPos - (to - from);
  if (isInsertingBefore) tr.delete(from, to).insert(slot.insertPos, content);
  else tr.insert(slot.insertPos, content).delete(from, to);

  const caret = landedAt + (wrapper ? 2 : 1);
  editor.view.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(caret), 1)).scrollIntoView());
};

/** Moves the block holding the caret one place up or down, like Notion's Ctrl/⌘+Shift+↑/↓. */
export const shiftBlock = (editor: Editor, direction: -1 | 1): boolean => {
  const { doc, selection } = editor.state;
  const source = resolveBlock(doc, selection.from);
  if (!source) return false;

  const $source = doc.resolve(source.pos);
  const sibling = $source.parent.maybeChild($source.index() + direction);
  if (!sibling) return false;

  const siblingPos =
    direction < 0 ? source.pos - sibling.nodeSize : source.pos + source.node.nodeSize;
  const slot = getDropSlot(doc, source, { node: sibling, pos: siblingPos }, direction > 0);
  if (slot) moveBlock(editor, source, slot);
  return true;
};
