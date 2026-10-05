import { useLayoutEffect, useState } from "react";
import { measureLineHeights } from "../lib/caret-coordinates";

const sameHeights = (a: number[] | null, b: number[]): boolean =>
  a !== null && a.length === b.length && a.every((height, index) => height === b[index]);

/** Per-line heights while word wrap is on; null keeps the fixed-height gutter. */
export const useWrappedLineHeights = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  enabled: boolean,
  layoutKey: string
): number[] | null => {
  const [heights, setHeights] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!enabled || !textarea || typeof ResizeObserver === "undefined") {
      setHeights(null);
      return;
    }
    // Most edits do not change any row height: keep the array so the gutter does not re-render.
    const measure = (): void => {
      const next = measureLineHeights(textarea);
      setHeights((current) => (sameHeights(current, next) ? current : next));
    };
    measure();
    // Width changes (panels, fullscreen) rewrap lines without changing the text.
    const observer = new ResizeObserver(measure);
    observer.observe(textarea);
    return (): void => observer.disconnect();
  }, [textareaRef, enabled, layoutKey]);

  return heights;
};
