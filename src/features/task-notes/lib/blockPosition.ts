import type { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import type { BlockTarget } from "./blockActions";

/** How far (px) outside a block its margins still count as hovering it. */
const HOVER_SLACK = 6;
/** The pointer is aimed this far inside the content, past list markers, to land on the text. */
const PROBE_OFFSET = 48;

export const isListItem = (node: Node): boolean =>
  node.type.name === "listItem" || node.type.name === "taskItem";

/**
 * The block a document position belongs to. A block is a top-level node (a quote, table or
 * code block is one block) or a list item at any depth, so each bullet moves on its own.
 */
export const resolveBlock = (doc: Node, pos: number): BlockTarget | null => {
  const $pos = doc.resolve(pos);
  for (let depth = $pos.depth; depth >= 1; depth -= 1) {
    const node = $pos.node(depth);
    if (depth === 1 || isListItem(node)) return { node, pos: $pos.before(depth) };
  }
  return $pos.nodeAfter ? { node: $pos.nodeAfter, pos } : null;
};

/** The top-level block that contains the target (the target itself when it already is one). */
export const getTopLevelBlock = (doc: Node, target: BlockTarget): BlockTarget => {
  const $pos = doc.resolve(target.pos);
  return $pos.depth === 0 ? target : { node: $pos.node(1), pos: $pos.before(1) };
};

export const getBlockDom = (editor: Editor, { pos }: BlockTarget): HTMLElement | null => {
  const dom = editor.view.nodeDOM(pos);
  return dom instanceof HTMLElement ? dom : null;
};

export interface BlockMetrics {
  rect: DOMRect;
  /** Height of the first line of text, which the handle is centred on. */
  lineHeight: number;
  paddingTop: number;
  /** Width the list marker takes to the left of the item's box. */
  markerWidth: number;
}

const DEFAULT_LINE_HEIGHT = 24;

export const measureBlock = (editor: Editor, target: BlockTarget): BlockMetrics | null => {
  const dom = getBlockDom(editor, target);
  if (!dom) return null;
  // A node view is wrapped once more; the block's own box and typography are on the inner wrapper.
  const box = dom.querySelector<HTMLElement>(":scope > [data-node-view-wrapper]") ?? dom;
  const style = getComputedStyle(box);
  const listStyle =
    dom.parentElement && isListItem(target.node) ? getComputedStyle(dom.parentElement) : null;
  return {
    rect: box.getBoundingClientRect(),
    lineHeight: parseFloat(style.lineHeight) || DEFAULT_LINE_HEIGHT,
    paddingTop: parseFloat(style.paddingTop) || 0,
    markerWidth: listStyle ? parseFloat(listStyle.paddingLeft) || 0 : 0,
  };
};

interface FindBlockOptions {
  /**
   * Outside the blocks (blank space around or between them) a strict lookup finds nothing,
   * while a lenient one takes the nearest block: what a drag needs to drop at the very top or end.
   */
  isStrict: boolean;
}

/** The block on the pointer's row, wherever the pointer is horizontally, gutter included. */
export const findBlockAt = (
  editor: Editor,
  clientY: number,
  { isStrict }: FindBlockOptions
): BlockTarget | null => {
  const { view } = editor;
  const content = view.dom.getBoundingClientRect();
  const probe = {
    left: Math.min(content.left + PROBE_OFFSET, content.right - 1),
    top: isStrict ? clientY : Math.min(Math.max(clientY, content.top + 1), content.bottom - 1),
  };
  const hit = view.posAtCoords(probe);
  if (!hit) return null;

  const atom = hit.inside >= 0 ? view.state.doc.nodeAt(hit.inside) : null;
  const target = resolveBlock(view.state.doc, atom?.isAtom && !atom.isText ? hit.inside : hit.pos);
  if (!target || !isStrict) return target;

  const dom = getBlockDom(editor, target);
  if (!dom) return null;
  const { top, bottom } = dom.getBoundingClientRect();
  const style = getComputedStyle(dom);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  const isOnRow =
    clientY >= top - marginTop - HOVER_SLACK && clientY <= bottom + marginBottom + HOVER_SLACK;
  return isOnRow ? target : null;
};
