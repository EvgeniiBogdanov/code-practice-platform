import { useEffect } from "react";

const DURATION_MS = 650;
/** A wheel pause longer than this ends a gesture, so the next event may start a new step. */
const QUIET_GAP_MS = 90;
/** A delta this much larger than the previous one marks a fresh flick on top of inertia. */
const SPIKE_RATIO = 1.6;
const SPIKE_MIN_PX = 40;
const EDGE_PX = 2;
/** A scene overflowing the viewport by less than this is treated as one screen. */
const OVERFLOW_TOLERANCE_PX = 48;
/** Scenes taller than this share of the viewport are scrolled natively inside. */
const TALL_SCENE_RATIO = 1.15;
const SCENE_SELECTOR = "main > section";
const SCROLLING_ATTRIBUTE = "data-scene-scrolling";
const ENABLED_QUERY =
  "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
const LINE_HEIGHT_PX = 16;

/** Starts at full speed (no sluggish ease-in) and settles softly. */
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

interface Scene {
  top: number;
  height: number;
}

const readScenes = (): Scene[] =>
  Array.from(document.querySelectorAll<HTMLElement>(SCENE_SELECTOR), (element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height };
  });

/**
 * One wheel gesture = one scene. A light scroll glides to the neighbouring scene with an eased
 * tween, a hard fling or trackpad inertia cannot skip further because the gesture is locked until
 * the wheel goes quiet. Touch and keyboard keep the native CSS scroll snapping
 * (`mandatory` + `scroll-snap-stop: always`). Scenes much taller than the viewport scroll natively.
 */
export const useSceneScroll = (): void => {
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(ENABLED_QUERY);
    const root = document.documentElement;
    let isAnimating = false;
    let animationDirection: 1 | -1 = 1;
    let lastDirection = 0;
    let lastWheelAt = 0;
    let lastAbsDelta = 0;
    /** The current gesture scrolls inside a tall scene and is left to the browser. */
    let isNativeGesture = false;
    let frame = 0;

    const animateTo = (target: number): void => {
      window.cancelAnimationFrame(frame);
      const from = window.scrollY;
      animationDirection = target > from ? 1 : -1;
      const startedAt = performance.now();
      isAnimating = true;
      root.setAttribute(SCROLLING_ATTRIBUTE, "");

      const tick = (now: number): void => {
        const progress = Math.min(1, (now - startedAt) / DURATION_MS);
        window.scrollTo(0, from + (target - from) * easeOutQuart(progress));
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
          return;
        }
        isAnimating = false;
        root.removeAttribute(SCROLLING_ATTRIBUTE);
      };
      frame = window.requestAnimationFrame(tick);
    };

    /** Where one step in `direction` leads, or `null` to let the browser scroll inside a tall scene. */
    const findTarget = (direction: 1 | -1): number | null => {
      const y = window.scrollY;
      const viewport = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewport;
      const scenes = readScenes();

      const current = scenes.find(
        (scene) => y >= scene.top - EDGE_PX && y < scene.top + scene.height - EDGE_PX
      );
      if (current && current.height > viewport * TALL_SCENE_RATIO) {
        const bottomStop = current.top + current.height - viewport;
        if (direction > 0 && y < bottomStop - EDGE_PX) return null;
        if (direction < 0 && y > current.top + EDGE_PX) return null;
      }

      const stops = scenes.flatMap((scene) =>
        scene.height > viewport + OVERFLOW_TOLERANCE_PX &&
        scene.height <= viewport * TALL_SCENE_RATIO
          ? [scene.top, scene.top + scene.height - viewport]
          : [scene.top]
      );
      stops.push(maxScroll);
      const sorted = [...new Set(stops.map((stop) => Math.min(Math.max(0, stop), maxScroll)))].sort(
        (a, b) => a - b
      );

      return direction > 0
        ? (sorted.find((stop) => stop > y + EDGE_PX) ?? null)
        : ([...sorted].reverse().find((stop) => stop < y - EDGE_PX) ?? null);
    };

    const handleWheel = (event: WheelEvent): void => {
      if (!media.matches || event.ctrlKey || event.deltaY === 0) return;
      if (document.querySelector('[role="dialog"]')) return;

      const delta = event.deltaMode === 1 ? event.deltaY * LINE_HEIGHT_PX : event.deltaY;
      if (Math.abs(delta) < 1) return;

      const direction = delta > 0 ? 1 : -1;
      const now = performance.now();
      const absDelta = Math.abs(delta);
      // A new gesture: the wheel paused, reversed, or flicked harder than the inertia before it.
      const isNewGesture =
        now - lastWheelAt > QUIET_GAP_MS ||
        direction !== lastDirection ||
        (absDelta >= SPIKE_MIN_PX && absDelta > lastAbsDelta * SPIKE_RATIO);
      lastWheelAt = now;
      lastDirection = direction;
      lastAbsDelta = absDelta;

      // Same-direction events while a step runs, or inertia after it, must not start another step.
      if (!isNewGesture || (isAnimating && direction === animationDirection)) {
        if (!isNativeGesture) event.preventDefault();
        return;
      }

      const target = findTarget(direction);
      isNativeGesture = target === null;
      if (target === null) return;

      event.preventDefault();
      animateTo(target);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.cancelAnimationFrame(frame);
      root.removeAttribute(SCROLLING_ATTRIBUTE);
    };
  }, []);
};
