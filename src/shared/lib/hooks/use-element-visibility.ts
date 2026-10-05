import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export interface UseElementVisibilityResult<T extends Element> {
  /** Callback ref: re-subscribes the observer whenever the node is mounted, replaced or removed. */
  ref: Dispatch<SetStateAction<T | null>>;
  element: T | null;
  /** `true` while the element intersects the viewport; also `true` when it is not mounted. */
  isVisible: boolean;
}

/** Tracks live viewport visibility of an element that may remount (conditional render, `key`, fullscreen). */
export function useElementVisibility<
  T extends Element = HTMLDivElement,
>(): UseElementVisibilityResult<T> {
  const [element, setElement] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref: setElement, element, isVisible };
}
