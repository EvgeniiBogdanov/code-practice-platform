import { useEffect, useRef, type RefObject } from "react";

const AMPLITUDE_PX = 8;

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Idle bobbing written to `--drift-y` from the main thread. A CSS transform animation would be
 * composited: the layer is rasterised once and then resampled at sub-pixel offsets, which smears
 * text. Main-thread updates are re-rasterised every frame, so the card stays sharp.
 */
export const useFloatDrift = <T extends HTMLElement>(
  periodSeconds: number,
  phaseSeconds: number
): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let frame = 0;
    const render = (now: number): void => {
      const progress = (now / 1000 + phaseSeconds) / periodSeconds;
      const lift = (1 - Math.cos(progress * 2 * Math.PI)) / 2;
      node.style.setProperty("--drift-y", `${(-AMPLITUDE_PX * lift).toFixed(2)}px`);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [periodSeconds, phaseSeconds]);

  return ref;
};
