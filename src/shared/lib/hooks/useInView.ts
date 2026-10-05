import { useEffect, useState, type RefCallback } from "react";

export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** Stop observing after the first intersection (default). */
  once?: boolean;
}

/** Flips to `true` when the element enters the viewport. Falls back to `true` without IO support. */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  once = true,
}: UseInViewOptions = {}): [RefCallback<T>, boolean] {
  const [node, setNode] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, once]);

  return [setNode, isInView];
}
