import React, { Children, cloneElement, useEffect, useState, type Ref } from "react";
import { clsx } from "clsx";
import { animate, useReducedMotion } from "motion/react";
import { useInView } from "../../lib/hooks";
import styles from "./UiReveal.module.css";

export type UiRevealVariant = "rise" | "scale";
/** Stagger position: the reveal starts after `order × REVEAL_STEP_S`. */
export type UiRevealOrder = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const REVEAL_STEP_S = 0.08;
/** Critically damped: settles without overshoot, and `transform`/`opacity` run on the compositor. */
const REVEAL_SPRING = { type: "spring", visualDuration: 0.9, bounce: 0 } as const;
/**
 * The resting pose as an identity matrix, not `none`: the hidden pose computes to a matrix, and
 * Motion interpolates `matrix(…) → none` into a zero-scale matrix that collapses the element.
 * Once settled it becomes `none`, so no stray stacking context or fixed-position containing block remains.
 */
const REVEAL_TO = {
  opacity: 1,
  transform: "matrix(1, 0, 0, 1, 0, 0)",
  transitionEnd: { transform: "none" },
};

interface RevealableProps {
  className?: string;
  ref?: Ref<HTMLElement>;
}

export interface UiRevealProps {
  variant?: UiRevealVariant;
  order?: UiRevealOrder;
  /** A single DOM element: it receives the reveal classes itself, no wrapper is rendered. */
  children: React.ReactElement<RevealableProps>;
}

/**
 * Springs its child in once it scrolls into view. The hidden pose lives in CSS (first paint is
 * already hidden), the spring animates from it to the resting pose. Respects `prefers-reduced-motion`.
 */
export const UiReveal = ({
  variant = "rise",
  order = 0,
  children,
}: UiRevealProps): React.JSX.Element => {
  const [inViewRef, isInView] = useInView<HTMLElement>();
  const [node, setNode] = useState<HTMLElement | null>(null);
  const isReduced = useReducedMotion();
  const child = Children.only(children);
  const childRef = child.props.ref;

  useEffect(() => {
    if (!isInView || !node || isReduced) return;
    const controls = animate(node, REVEAL_TO, { ...REVEAL_SPRING, delay: order * REVEAL_STEP_S });
    return () => controls.stop();
  }, [isInView, isReduced, node, order]);

  return cloneElement(child, {
    ref: (element: HTMLElement | null) => {
      setNode(element);
      inViewRef(element);
      if (typeof childRef === "function") childRef(element);
      else if (childRef) childRef.current = element;
    },
    className: clsx(styles.reveal, styles[variant], child.props.className),
  });
};

UiReveal.displayName = "UiReveal";
