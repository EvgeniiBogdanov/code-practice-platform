export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipCoords {
  top: number;
  left: number;
  actualSide: TooltipSide;
  arrowLeft?: number;
  arrowTop?: number;
}

interface PositionParams {
  triggerRect: DOMRect;
  contentRect: DOMRect;
  viewportWidth: number;
  viewportHeight: number;
  side: TooltipSide;
  align: TooltipAlign;
  sideOffset: number;
}

const resolveSideCollision = (
  side: TooltipSide,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  sideOffset: number,
  viewportWidth: number,
  viewportHeight: number
): TooltipSide => {
  if (
    side === "bottom" &&
    triggerRect.bottom + sideOffset + contentRect.height > viewportHeight - 8
  ) {
    if (triggerRect.top - sideOffset - contentRect.height > 8) return "top";
  } else if (side === "top" && triggerRect.top - sideOffset - contentRect.height < 8) {
    if (triggerRect.bottom + sideOffset + contentRect.height < viewportHeight - 8) return "bottom";
  } else if (
    side === "right" &&
    triggerRect.right + sideOffset + contentRect.width > viewportWidth - 8
  ) {
    if (triggerRect.left - sideOffset - contentRect.width > 8) return "left";
  } else if (side === "left" && triggerRect.left - sideOffset - contentRect.width < 8) {
    if (triggerRect.right + sideOffset + contentRect.width < viewportWidth - 8) return "right";
  }
  return side;
};

const calculateMainAxis = (
  targetSide: TooltipSide,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  sideOffset: number
): { top: number; left: number } => {
  if (targetSide === "bottom") {
    return { top: triggerRect.bottom + sideOffset, left: 0 };
  }
  if (targetSide === "top") {
    return { top: triggerRect.top - contentRect.height - sideOffset, left: 0 };
  }
  if (targetSide === "left") {
    return { top: 0, left: triggerRect.left - contentRect.width - sideOffset };
  }
  return { top: 0, left: triggerRect.right + sideOffset };
};

const calculateCrossAxis = (
  targetSide: TooltipSide,
  align: TooltipAlign,
  triggerRect: DOMRect,
  contentRect: DOMRect
): { topOffset: number; leftOffset: number } => {
  if (targetSide === "top" || targetSide === "bottom") {
    if (align === "start") return { topOffset: 0, leftOffset: triggerRect.left };
    if (align === "end") return { topOffset: 0, leftOffset: triggerRect.right - contentRect.width };
    return {
      topOffset: 0,
      leftOffset: triggerRect.left + triggerRect.width / 2 - contentRect.width / 2,
    };
  }

  if (align === "start") return { topOffset: triggerRect.top, leftOffset: 0 };
  if (align === "end") return { topOffset: triggerRect.bottom - contentRect.height, leftOffset: 0 };
  return {
    topOffset: triggerRect.top + triggerRect.height / 2 - contentRect.height / 2,
    leftOffset: 0,
  };
};

const calculateArrowOffsets = (
  actualSide: TooltipSide,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  finalTop: number,
  finalLeft: number
): { arrowLeft?: number; arrowTop?: number } => {
  if (actualSide === "top" || actualSide === "bottom") {
    const rawArrowLeft = triggerRect.left + triggerRect.width / 2 - finalLeft;
    const maxOffset = Math.max(10, contentRect.width - 10);
    return { arrowLeft: Math.round(Math.max(10, Math.min(maxOffset, rawArrowLeft))) };
  }
  const rawArrowTop = triggerRect.top + triggerRect.height / 2 - finalTop;
  const maxOffset = Math.max(8, contentRect.height - 8);
  return { arrowTop: Math.round(Math.max(8, Math.min(maxOffset, rawArrowTop))) };
};

export const calculateTooltipPosition = ({
  triggerRect,
  contentRect,
  viewportWidth,
  viewportHeight,
  side,
  align,
  sideOffset,
}: PositionParams): TooltipCoords => {
  const actualSide = resolveSideCollision(
    side,
    triggerRect,
    contentRect,
    sideOffset,
    viewportWidth,
    viewportHeight
  );

  const main = calculateMainAxis(actualSide, triggerRect, contentRect, sideOffset);
  const cross = calculateCrossAxis(actualSide, align, triggerRect, contentRect);

  let top = actualSide === "left" || actualSide === "right" ? cross.topOffset : main.top;
  let left = actualSide === "top" || actualSide === "bottom" ? cross.leftOffset : main.left;

  const pad = 8;
  if (left < pad) left = pad;
  if (left + contentRect.width > viewportWidth - pad) {
    left = viewportWidth - contentRect.width - pad;
  }
  if (top < pad) top = pad;
  if (top + contentRect.height > viewportHeight - pad) {
    top = viewportHeight - contentRect.height - pad;
  }

  const finalTop = Math.round(top);
  const finalLeft = Math.round(left);
  const { arrowLeft, arrowTop } = calculateArrowOffsets(
    actualSide,
    triggerRect,
    contentRect,
    finalTop,
    finalLeft
  );

  return { top: finalTop, left: finalLeft, actualSide, arrowLeft, arrowTop };
};
