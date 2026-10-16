import type React from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react";

/** Soft and slightly heavy: the card leans after the pointer and settles back without a snap. */
const MAGNET_SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

export interface HoverMagnet {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * While a mouse hovers the element, it is pulled towards the pointer by up to `strengthPx`;
 * on leave it springs back. Touch and reduced motion keep the element still.
 */
export const useHoverMagnet = (strengthPx: number): HoverMagnet => {
  const isReduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAGNET_SPRING);
  const y = useSpring(rawY, MAGNET_SPRING);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>): void => {
    if (isReduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    // -1…1 from the element's centre to its edges
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * strengthPx);
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * strengthPx);
  };

  const onPointerLeave = (): void => {
    rawX.set(0);
    rawY.set(0);
  };

  return { x, y, onPointerMove, onPointerLeave };
};
