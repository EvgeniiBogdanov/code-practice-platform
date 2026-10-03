import { useEffect, useState } from "react";

export interface ScrollDirectionState {
  /** The page has left the very top. */
  isScrolled: boolean;
  /** The user scrolls down past the hero: the navigation may hide. */
  isHidden: boolean;
}

const REVEAL_ZONE = 120;
const DIRECTION_DELTA = 6;

export const useScrollDirection = (threshold = 12): ScrollDirectionState => {
  const [state, setState] = useState<ScrollDirectionState>({ isScrolled: false, isHidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      setState((prev) => {
        const isScrolled = y > threshold;
        let isHidden = prev.isHidden;
        if (y < REVEAL_ZONE) isHidden = false;
        else if (delta > DIRECTION_DELTA) isHidden = true;
        else if (delta < -DIRECTION_DELTA) isHidden = false;

        return prev.isScrolled === isScrolled && prev.isHidden === isHidden
          ? prev
          : { isScrolled, isHidden };
      });
    };

    const handleScroll = (): void => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
};
