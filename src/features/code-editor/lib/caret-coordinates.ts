export interface CaretCoordinates {
  top: number;
  left: number;
  lineHeight: number;
  lineBottom: number;
}

export interface PopupPositionResult {
  top: number;
  left: number;
  placement: "top" | "bottom";
  maxHeight: number;
}

export interface CalculatePopupPositionParams {
  caret: CaretCoordinates;
  textarea: HTMLTextAreaElement;
  itemsCount: number;
}

const DROPDOWN_WIDTH = 280;
const DROPDOWN_MAX_HEIGHT = 220;
const ITEM_HEIGHT = 32;
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
  const textAfter = textarea.value.substring(cursorPos);

  mirrorDiv.textContent = "";

  const textNodeBefore = document.createTextNode(textBefore);
  const markerSpan = document.createElement("span");
  markerSpan.textContent = textarea.value.substring(cursorPos, cursorPos + 1) || "\u200b";
  const textNodeAfter = document.createTextNode(textAfter);

  mirrorDiv.appendChild(textNodeBefore);
  mirrorDiv.appendChild(markerSpan);
  mirrorDiv.appendChild(textNodeAfter);

  // In test environments without a layout engine, offsetTop/offsetLeft will be 0
  if (markerSpan.offsetTop === 0 && markerSpan.offsetLeft === 0 && textBefore.length > 0) {
    return getFallbackCoordinates(textarea, cursorPos, computed);
  }

  const top = markerSpan.offsetTop;
  const left = markerSpan.offsetLeft;
  const parsedFontSize = parseFloat(computed.fontSize) || 13;
  const lineHeight =
    markerSpan.offsetHeight ||
    parseFloat(computed.lineHeight) ||
    Math.round(parsedFontSize * 1.6);

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
}: CalculatePopupPositionParams): PopupPositionResult => {
  const scrollTop = textarea.scrollTop;
  const scrollLeft = textarea.scrollLeft;
  const clientHeight = textarea.clientHeight || 400;
  const clientWidth = textarea.clientWidth || 800;

  const viewportLineTop = caret.top - scrollTop;
  const viewportLineBottom = caret.lineBottom - scrollTop;
  const viewportCaretLeft = caret.left - scrollLeft;

  const estimatedHeight = Math.min(
    Math.max(itemsCount * ITEM_HEIGHT + 8, MIN_POPUP_HEIGHT),
    DROPDOWN_MAX_HEIGHT
  );

  const spaceBelow = clientHeight - viewportLineBottom - GAP;
  const spaceAbove = viewportLineTop - GAP;

  let placement: "top" | "bottom" = "bottom";
  let top = 0;
  let maxHeight = DROPDOWN_MAX_HEIGHT;

  if (spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove) {
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
