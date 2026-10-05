import React, { Children, cloneElement, type Ref } from "react";
import { clsx } from "clsx";
import { useInView } from "../../lib/hooks";
import styles from "./UiReveal.module.css";

export type UiRevealVariant = "rise" | "scale";
/** Stagger position: the reveal starts after `order × --reveal-step`. */
export type UiRevealOrder = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

/** Fades its child in once it scrolls into view. Respects `prefers-reduced-motion`. */
export const UiReveal = ({
  variant = "rise",
  order = 0,
  children,
}: UiRevealProps): React.JSX.Element => {
  const [ref, isInView] = useInView<HTMLElement>();
  const child = Children.only(children);
  const childRef = child.props.ref;

  return cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      ref(node);
      if (typeof childRef === "function") childRef(node);
      else if (childRef) childRef.current = node;
    },
    className: clsx(
      styles.reveal,
      styles[variant],
      styles[`order${order}`],
      isInView && styles.visible,
      child.props.className
    ),
  });
};

UiReveal.displayName = "UiReveal";
