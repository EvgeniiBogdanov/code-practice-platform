import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  calculateTooltipPosition,
  TooltipAlign,
  TooltipCoords,
  TooltipSide,
} from "./calculateTooltipPosition";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface UseTooltipPositionParams {
  isOpen: boolean;
  triggerRef: MutableRefObject<HTMLElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  side: TooltipSide;
  align: TooltipAlign;
  sideOffset: number;
}

export const useTooltipPosition = ({
  isOpen,
  triggerRef,
  contentRef,
  side,
  align,
  sideOffset,
}: UseTooltipPositionParams) => {
  const [coords, setCoords] = useState<TooltipCoords>({
    top: -9999,
    left: -9999,
    actualSide: side,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const newCoords = calculateTooltipPosition({
      triggerRect: triggerRef.current.getBoundingClientRect(),
      contentRect: contentRef.current.getBoundingClientRect(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      side,
      align,
      sideOffset,
    });

    setCoords(newCoords);
  }, [side, align, sideOffset, triggerRef, contentRef]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition, true);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return coords;
};
