import type { CaretCoordinates } from "./caretCoordinates";

/**
 * The highlight layer renders one element per line, positioned exactly like the textarea
 * text. Once linked, measurements read that laid-out DOM instead of building a mirror of
 * the document, so they cost one line, not the whole file.
 */
const lineLayers = new WeakMap<HTMLTextAreaElement, HTMLElement>();

/** Links a textarea to the element whose children are its rendered lines; returns the unlink. */
export const linkLineLayer = (textarea: HTMLTextAreaElement, lines: HTMLElement): (() => void) => {
  lineLayers.set(textarea, lines);
  return () => {
    if (lineLayers.get(textarea) === lines) lineLayers.delete(textarea);
  };
};

let lineStartsCache: { text: string; starts: number[] } = { text: "", starts: [0] };

const getLineStarts = (text: string): number[] => {
  if (lineStartsCache.text === text) return lineStartsCache.starts;
  const starts = [0];
  for (let index = text.indexOf("\n"); index !== -1; index = text.indexOf("\n", index + 1)) {
    starts.push(index + 1);
  }
  lineStartsCache = { text, starts };
  return starts;
};

const findLineIndex = (starts: number[], offset: number): number => {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (starts[middle] <= offset) low = middle;
    else high = middle - 1;
  }
  return low;
};

interface LinePoint {
  line: HTMLElement;
  lineStart: number;
}

/**
 * The rendered line holding `offset`, or null when the layer shows other text there.
 * Only the text before the offset has to match: an input handler measures the new value
 * before React renders it, and a character typed at the caret does not move its column.
 */
const getRenderedLine = (textarea: HTMLTextAreaElement, offset: number): LinePoint | null => {
  const lines = lineLayers.get(textarea);
  if (!lines?.isConnected) return null;
  const text = textarea.value;
  const starts = getLineStarts(text);
  if (lines.children.length !== starts.length) return null;
  const index = findLineIndex(starts, offset);
  const line = lines.children[index];
  if (!(line instanceof HTMLElement)) return null;
  const lineStart = starts[index];
  if (!line.textContent?.startsWith(text.slice(lineStart, offset))) return null;
  return { line, lineStart };
};

/** Text node and offset inside it for a column of a rendered line. */
const locateColumn = (line: HTMLElement, column: number): { node: Text; offset: number } | null => {
  const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
  let remaining = column;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent?.length ?? 0;
    if (remaining < length && node instanceof Text) return { node, offset: remaining };
    remaining -= length;
  }
  return null;
};

export const getLayerCoordinates = (
  textarea: HTMLTextAreaElement,
  cursorPos: number
): CaretCoordinates | null => {
  const point = getRenderedLine(textarea, cursorPos);
  const layer = point?.line.parentElement?.parentElement;
  if (!point || !layer) return null;
  // The character after the caret, as the mirror marks it; a line end measures its newline.
  const target = locateColumn(point.line, cursorPos - point.lineStart);
  if (!target) return null;
  const range = document.createRange();
  // Engines without layout (jsdom) cannot measure a range: the mirror answers instead.
  if (typeof range.getBoundingClientRect !== "function") return null;
  range.setStart(target.node, target.offset);
  range.setEnd(target.node, target.offset + 1);
  const rect = range.getBoundingClientRect();
  if (rect.height === 0) return null;
  const layerRect = layer.getBoundingClientRect();
  const top = rect.top - layerRect.top + layer.scrollTop;
  return {
    top,
    left: rect.left - layerRect.left + layer.scrollLeft,
    lineHeight: rect.height,
    lineBottom: top + rect.height,
  };
};

const getTextOffsetIn = (root: Node, target: Node, offset: number): number | null => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let total = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node === target) return total + offset;
    total += node.textContent?.length ?? 0;
  }
  return null;
};

/** Document offset of a point inside a rendered line: only that line's text is walked. */
export const getLineOffset = (
  textarea: HTMLTextAreaElement,
  node: Node,
  offset: number
): number | null => {
  const lines = lineLayers.get(textarea);
  const line = node.parentElement?.closest("code > *");
  if (!lines || !(line instanceof HTMLElement) || line.parentElement !== lines) return null;
  const starts = getLineStarts(textarea.value);
  if (lines.children.length !== starts.length) return null;
  const inLine = getTextOffsetIn(line, node, offset);
  if (inLine === null) return null;
  return starts[Array.prototype.indexOf.call(lines.children, line)] + inLine;
};

/** Heights of the rendered lines, or null while the layer shows other text. */
export const getLayerLineHeights = (textarea: HTMLTextAreaElement): number[] | null => {
  const lines = lineLayers.get(textarea);
  if (!lines?.isConnected || lines.children.length !== getLineStarts(textarea.value).length) {
    return null;
  }
  return Array.from(lines.children, (line) => line.getBoundingClientRect().height);
};
