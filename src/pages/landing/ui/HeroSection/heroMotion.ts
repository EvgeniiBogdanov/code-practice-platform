import type { Transition, Variants } from "motion/react";

/*
 * Hero choreography. Every pose animates `transform` and `opacity` only, written as transform
 * strings so Motion hands them to WAAPI: springs run on the compositor and stay smooth even while
 * the main thread is busy mounting the rest of the page.
 * Entrance poses start at opacity 0.01, not 0: Chrome skips fully transparent first paints as LCP
 * candidates, so the hero would never be reported (Lighthouse: NO_LCP).
 */

const SETTLE: Transition = { type: "spring", visualDuration: 1, bounce: 0 };
const SETTLE_SOFT: Transition = { type: "spring", visualDuration: 1.2, bounce: 0.12 };

/** Copy column: eyebrow, headline words, lead, actions and note follow one another. */
export const COPY_VARIANTS: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.1, staggerChildren: 0.075 } },
};

export const RISE_VARIANTS: Variants = {
  hidden: { opacity: 0.01, transform: "translateY(24px)" },
  shown: { opacity: 1, transform: "translateY(0px)", transition: SETTLE },
};

/** Headline words slide up out of their own clipping mask. */
export const WORD_VARIANTS: Variants = {
  hidden: { transform: "translateY(115%) rotate(5deg)" },
  shown: { transform: "translateY(0%) rotate(0deg)", transition: SETTLE },
};

/** Floating previews land after the headline, one by one. */
export const ARTIFACTS_VARIANTS: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.55, staggerChildren: 0.12 } },
};

export const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, transform: "translateY(64px) scale(0.9)" },
  shown: { opacity: 1, transform: "translateY(0px) scale(1)", transition: SETTLE_SOFT },
};

const FLOAT_AMPLITUDE_PX = 8;
/** The idle bobbing starts once the cards have landed. */
const FLOAT_START_S = 1.6;

/**
 * Idle bobbing while the card is on screen; off screen it parks instantly, so no endless animation
 * keeps the compositor busy. A closed loop rather than `repeatType: "mirror"`: Motion only hands
 * non-mirrored loops to WAAPI.
 */
export const getFloatVariants = (periodSeconds: number, phaseSeconds: number): Variants => ({
  float: {
    transform: ["translateY(0px)", `translateY(${-FLOAT_AMPLITUDE_PX}px)`, "translateY(0px)"],
    transition: {
      duration: periodSeconds,
      ease: "easeInOut",
      repeat: Infinity,
      delay: FLOAT_START_S + phaseSeconds,
    },
  },
  rest: { transform: "translateY(0px)", transition: { duration: 0 } },
});
