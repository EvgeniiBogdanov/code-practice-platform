export interface CaretCoordinates {
  top: number;
  left: number;
  lineHeight: number;
  lineBottom: number;
}

export type PopupPlacement = "top" | "bottom";

export interface PopupPositionResult {
  top: number;
  left: number;
  placement: PopupPlacement;
  maxHeight: number;
}

export interface CalculatePopupPositionParams {
  caret: CaretCoordinates;
  textarea: HTMLTextAreaElement;
  itemsCount: number;
  /** VS Code keeps the suggest widget on one side while it is open, so it never jumps. */
  lockedPlacement?: PopupPlacement;
}

const DROPDOWN_WIDTH = 320;
const DROPDOWN_MAX_HEIGHT = 220;
const ITEM_HEIGHT = 29;
/** Footer with the item description plus the list padding. */
const DROPDOWN_CHROME = 38;
const GAP = 6;
const MARGIN_X = 8;
const MIN_POPUP_HEIGHT = 80;

let mirrorDiv: HTMLDivElement | null = null;

const getFallbackCoordinates = (
  textarea: HTMLTextAreaElement,
  cursorPos: number,
  computed: CSSStyleDeclaration | null
): CaretCoordinates => {
  const parsedFontSize = computed ? parseFloat(computed.fontSize) || 13 : 13;
  const parsedLineHeight = computed
    ? parseFloat(computed.lineHeight) || Math.round(parsedFontSize * 1.6)
    : Math.round(parsedFontSize * 1.6);
  const paddingTop = computed ? parseFloat(computed.paddingTop) || 14 : 14;
  const paddingLeft = computed ? parseFloat(computed.paddingLeft) || 16 : 16;
  const charWidth = parsedFontSize * 0.6;

  const textBefore = textarea.value.substring(0, cursorPos);
  const lines = textBefore.split("\n");
  const currentLineIdx = lines.length - 1;
  const currentColIdx = lines[currentLineIdx].length;

  const top = paddingTop + currentLineIdx * parsedLineHeight;
  const left = paddingLeft + currentColIdx * charWidth;

  return {
    top,
    left,
    lineHeight: parsedLineHeight,
    lineBottom: top + parsedLineHeight,
  };
};

export const getCaretCoordinates = (
  textarea: HTMLTextAreaElement,
  cursorPos: number
): CaretCoordinates => {
  const computed = typeof window !== "undefined" ? window.getComputedStyle(textarea) : null;

  if (typeof document === "undefined" || !computed) {
    return getFallbackCoordinates(textarea, cursorPos, computed);
  }

  if (!mirrorDiv) {
    mirrorDiv = document.createElement("div");
    mirrorDiv.id = "code-editor-caret-mirror";
    mirrorDiv.setAttribute("aria-hidden", "true");
    document.body.appendChild(mirrorDiv);
  }

  mirrorDiv.style.position = "absolute";
  mirrorDiv.style.top = "-99999px";
  mirrorDiv.style.left = "-99999px";
  mirrorDiv.style.visibility = "hidden";
  mirrorDiv.style.pointerEvents = "none";
  mirrorDiv.style.overflow = "hidden";
  mirrorDiv.style.boxSizing = computed.boxSizing;
  mirrorDiv.style.width = `${textarea.clientWidth}px`;
  mirrorDiv.style.paddingTop = computed.paddingTop;
  mirrorDiv.style.paddingRight = computed.paddingRight;
  mirrorDiv.style.paddingBottom = computed.paddingBottom;
  mirrorDiv.style.paddingLeft = computed.paddingLeft;
  mirrorDiv.style.borderStyle = computed.borderStyle;
  mirrorDiv.style.borderWidth = computed.borderWidth;
  mirrorDiv.style.fontFamily = computed.fontFamily;
  mirrorDiv.style.fontSize = computed.fontSize;
  mirrorDiv.style.lineHeight = computed.lineHeight;
  mirrorDiv.style.letterSpacing = computed.letterSpacing;
  mirrorDiv.style.wordSpacing = computed.wordSpacing;
  mirrorDiv.style.tabSize = computed.tabSize;
  mirrorDiv.style.whiteSpace = computed.whiteSpace;
  mirrorDiv.style.wordWrap = computed.wordWrap;
  mirrorDiv.style.wordBreak = computed.wordBreak;

  const textBefore = textarea.value.substring(0, cursorPos);

  mirrorDiv.textContent = "";

  const textNodeBefore = document.createTextNode(textBefore);
  const markerSpan = document.createElement("span");
  markerSpan.textContent = textarea.value.substring(cursorPos, cursorPos + 1) || "\u200b";

  // Text after the caret cannot move it, so it is left out: laying out the whole file for
  // every measurement made each caret move cost as much as the document is long.
  mirrorDiv.appendChild(textNodeBefore);
  mirrorDiv.appendChild(markerSpan);

  // In test environments without a layout engine, offsetTop/offsetLeft will be 0
  if (markerSpan.offsetTop === 0 && markerSpan.offsetLeft === 0 && textBefore.length > 0) {
    return getFallbackCoordinates(textarea, cursorPos, computed);
  }

  const top = markerSpan.offsetTop;
  const left = markerSpan.offsetLeft;
  const parsedFontSize = parseFloat(computed.fontSize) || 13;
  const lineHeight =
    markerSpan.offsetHeight || parseFloat(computed.lineHeight) || Math.round(parsedFontSize * 1.6);

  return {
    top,
    left,
    lineHeight,
    lineBottom: top + lineHeight,
  };
};

export const calculatePopupPosition = ({
  caret,
  textarea,
  itemsCount,
  lockedPlacement,
}: CalculatePopupPositionParams): PopupPositionResult => {
  const scrollTop = textarea.scrollTop;
  const scrollLeft = textarea.scrollLeft;
  const clientHeight = textarea.clientHeight || 400;
  const clientWidth = textarea.clientWidth || 800;

  const viewportLineTop = caret.top - scrollTop;
  const viewportLineBottom = caret.lineBottom - scrollTop;
  const viewportCaretLeft = caret.left - scrollLeft;

  const estimatedHeight = Math.min(
    Math.max(itemsCount * ITEM_HEIGHT + DROPDOWN_CHROME, MIN_POPUP_HEIGHT),
    DROPDOWN_MAX_HEIGHT
  );

  const spaceBelow = clientHeight - viewportLineBottom - GAP;
  const spaceAbove = viewportLineTop - GAP;

  let placement: PopupPlacement = "bottom";
  let top = 0;
  let maxHeight = DROPDOWN_MAX_HEIGHT;
  const fitsBelow = spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove;

  if (lockedPlacement ? lockedPlacement === "bottom" : fitsBelow) {
    placement = "bottom";
    top = Math.round(viewportLineBottom + GAP);
    maxHeight = Math.min(
      DROPDOWN_MAX_HEIGHT,
      Math.max(MIN_POPUP_HEIGHT, Math.round(spaceBelow - 4))
    );
  } else {
    placement = "top";
    top = Math.round(viewportLineTop - GAP);
    maxHeight = Math.min(
      DROPDOWN_MAX_HEIGHT,
      Math.max(MIN_POPUP_HEIGHT, Math.round(spaceAbove - 4))
    );
  }

  const maxLeft = Math.max(MARGIN_X, clientWidth - DROPDOWN_WIDTH - MARGIN_X);
  const left = Math.round(Math.max(MARGIN_X, Math.min(viewportCaretLeft, maxLeft)));

  return {
    top,
    left,
    placement,
    maxHeight,
  };
};

export interface WidgetPlacementParams {
  height: number;
  lineTop: number;
  lineBottom: number;
  viewportHeight: number;
}

/** VS Code content widgets (hover, parameter hints): above the line, below when it has no room. */
export const resolveWidgetPlacement = ({
  height,
  lineTop,
  lineBottom,
  viewportHeight,
}: WidgetPlacementParams): PopupPlacement => {
  const fitsAbove = lineTop - GAP >= height;
  const fitsBelow = viewportHeight - lineBottom - GAP >= height;
  return fitsAbove || !fitsBelow ? "top" : "bottom";
};

/** Shifts a widget left so it stays inside the editor, as VS Code does at the right edge. */
export const clampWidgetLeft = (left: number, width: number, viewportWidth: number): number =>
  Math.max(0, Math.min(left, viewportWidth - width - MARGIN_X));

interface CaretPoint {
  node: Node;
  offset: number;
}

const getCaretPointFromPoint = (x: number, y: number): CaretPoint | null => {
  if (typeof document.caretPositionFromPoint === "function") {
    const position = document.caretPositionFromPoint(x, y);
    return position ? { node: position.offsetNode, offset: position.offset } : null;
  }
  if (typeof document.caretRangeFromPoint === "function") {
    const range = document.caretRangeFromPoint(x, y);
    return range ? { node: range.startContainer, offset: range.startOffset } : null;
  }
  return null;
};

const getTextOffset = (root: HTMLElement, target: Node, offset: number): number | null => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let total = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node === target) return total + offset;
    total += node.textContent?.length ?? 0;
  }
  return null;
};

const isPointInsideCharacter = (point: CaretPoint, x: number, y: number): boolean => {
  const length = point.node.textContent?.length ?? 0;
  if (point.offset >= length) return false;
  const range = document.createRange();
  range.setStart(point.node, point.offset);
  range.setEnd(point.node, point.offset + 1);
  const rect = range.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};

/** Monospace metrics from the computed style, for engines without caret hit-testing. */
const getOffsetFromMetrics = (
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number
): number | null => {
  const computed = window.getComputedStyle(textarea);
  const fontSize = parseFloat(computed.fontSize) || 13;
  const lineHeight = parseFloat(computed.lineHeight) || fontSize * 1.6;
  const rect = textarea.getBoundingClientRect();
  const x = clientX - rect.left - (parseFloat(computed.paddingLeft) || 0) + textarea.scrollLeft;
  const y = clientY - rect.top - (parseFloat(computed.paddingTop) || 0) + textarea.scrollTop;
  const lines = textarea.value.split("\n");
  const lineIndex = Math.floor(y / lineHeight);
  const column = Math.floor(x / (fontSize * 0.6));
  if (y < 0 || x < 0 || lineIndex >= lines.length || column >= lines[lineIndex].length) return null;
  let offset = column;
  for (let i = 0; i < lineIndex; i++) offset += lines[i].length + 1;
  return offset;
};

/**
 * Returns the document offset of the character under the pointer, or null when
 * the pointer is past a line end. The highlight layer mirrors the textarea
 * exactly, so hit-testing it handles font size, tabs and word wrap.
 */
export const getOffsetFromPoint = (
  textarea: HTMLTextAreaElement,
  layer: HTMLElement | null,
  clientX: number,
  clientY: number
): number | null => {
  if (!layer || (!document.caretPositionFromPoint && !document.caretRangeFromPoint)) {
    return getOffsetFromMetrics(textarea, clientX, clientY);
  }
  // The textarea sits above the layer; let the hit test fall through for one call.
  const pointerEvents = textarea.style.pointerEvents;
  textarea.style.pointerEvents = "none";
  const point = getCaretPointFromPoint(clientX, clientY);
  textarea.style.pointerEvents = pointerEvents;
  if (!point || !layer.contains(point.node) || !isPointInsideCharacter(point, clientX, clientY)) {
    return null;
  }
  return getTextOffset(layer, point.node, point.offset);
};

/**
 * Heights of each logical line when the textarea wraps, measured on a mirror
 * with the same width and typography, so the gutter can follow wrapped rows.
 */
export const measureLineHeights = (textarea: HTMLTextAreaElement): number[] => {
  const computed = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  mirror.setAttribute("aria-hidden", "true");
  Object.assign(mirror.style, {
    position: "absolute",
    top: "-99999px",
    left: "-99999px",
    visibility: "hidden",
    boxSizing: computed.boxSizing,
    width: `${textarea.clientWidth}px`,
    paddingLeft: computed.paddingLeft,
    paddingRight: computed.paddingRight,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    lineHeight: computed.lineHeight,
    letterSpacing: computed.letterSpacing,
    tabSize: computed.tabSize,
    whiteSpace: computed.whiteSpace,
    wordWrap: computed.wordWrap,
    wordBreak: computed.wordBreak,
  });
  const rows = textarea.value.split("\n").map((line) => {
    const row = document.createElement("div");
    row.textContent = line || "\u200b";
    return row;
  });
  mirror.append(...rows);
  document.body.appendChild(mirror);
  const heights = rows.map((row) => row.offsetHeight);
  mirror.remove();
  return heights;
};
