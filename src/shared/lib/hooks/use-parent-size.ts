import { useState, useLayoutEffect, useRef, type RefObject } from "react";

export interface ElementDimensions {
  width: number;
  height: number;
}

export function useParentSize<T extends HTMLElement = HTMLDivElement>(
  initialDimensions: ElementDimensions = { width: 0, height: 0 }
): [RefObject<T | null>, ElementDimensions] {
  const targetRef = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<ElementDimensions>(initialDimensions);

  useLayoutEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const measure = (): void => {
      const rect = node.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      setDimensions((prev) => {
        if (prev.width === width && prev.height === height) {
          return prev;
        }
        return { width, height };
      });
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((): void => {
        measure();
      });
      observer.observe(node);
      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  return [targetRef, dimensions];
}
