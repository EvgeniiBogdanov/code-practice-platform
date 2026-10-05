import { useLayoutEffect, useRef, useState } from "react";
import {
  clampWidgetLeft,
  resolveWidgetPlacement,
  type PopupPlacement,
} from "../lib/caret-coordinates";

/** Edges of the anchor line and its left offset inside the editor viewport. */
export interface ContentWidgetAnchor {
  top: number;
  bottom: number;
  left: number;
}

export interface ContentWidgetLayout<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  placement: PopupPlacement;
  left: number;
}

/**
 * Measures a hover-like widget after render and places it the way VS Code places
 * content widgets: above the anchor line, below when there is no room, and never
 * past the right edge of the editor.
 */
export const useContentWidgetLayout = <T extends HTMLElement>(
  anchor: ContentWidgetAnchor,
  contentKey: unknown
): ContentWidgetLayout<T> => {
  const ref = useRef<T>(null);
  const [layout, setLayout] = useState<{ placement: PopupPlacement; left: number }>({
    placement: "top",
    left: anchor.left,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const viewport = element.offsetParent;
    const next = {
      placement: resolveWidgetPlacement({
        height: element.offsetHeight,
        lineTop: anchor.top,
        lineBottom: anchor.bottom,
        viewportHeight: viewport?.clientHeight ?? Infinity,
      }),
      left: clampWidgetLeft(anchor.left, element.offsetWidth, viewport?.clientWidth ?? Infinity),
    };
    setLayout((prev) =>
      prev.placement === next.placement && prev.left === next.left ? prev : next
    );
  }, [anchor.top, anchor.bottom, anchor.left, contentKey]);

  return { ref, ...layout };
};
