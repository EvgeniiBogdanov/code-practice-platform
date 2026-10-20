import type { ComponentProps, JSX } from "react";
import { m, useIsPresent, type Transition } from "motion/react";

/** The curve of `--transition-standard`; a popover leaves quicker than it arrives. */
const ENTER: Transition = { duration: 0.15, ease: [0.2, 0, 0, 1] };
const EXIT: Transition = { duration: 0.1, ease: [0.4, 0, 1, 1] };

/*
 * Only opacity and a short drift animate: scaling a popover resamples its text on every frame,
 * which makes it swim. Transforms are written as strings, so Motion runs them on the compositor.
 */
const DRIFT = {
  initial: { opacity: 0, transform: "translateY(-4px)" },
  animate: { opacity: 1, transform: "translateY(0px)", transition: ENTER },
  exit: { opacity: 0, transform: "translateY(-4px)", transition: EXIT },
};

/** A transform would also move every child measured against the popover, so this one only fades. */
const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: ENTER },
  exit: { opacity: 0, transition: EXIT },
};

export type UiPopoverSurfaceProps = Omit<
  ComponentProps<typeof m.div>,
  "initial" | "animate" | "exit"
> & {
  /** Fades without drifting: for a popover whose submenus position themselves against it. */
  isStill?: boolean;
};

/**
 * The animated box of a menu or popover. Needs a `LazyMotion` above it; inside `AnimatePresence`
 * it fades out on removal and takes no input while it leaves.
 */
export const UiPopoverSurface = ({
  isStill = false,
  ...props
}: UiPopoverSurfaceProps): JSX.Element => {
  const isPresent = useIsPresent();
  return <m.div {...(isStill ? FADE : DRIFT)} inert={!isPresent} {...props} />;
};
