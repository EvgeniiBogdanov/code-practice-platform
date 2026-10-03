import { useEffect, useState } from "react";

type TypewriterPhase = "waiting" | "typing" | "holding" | "erasing";

interface TypewriterState {
  phraseIndex: number;
  length: number;
  phase: TypewriterPhase;
}

const START_DELAY_MS = 1800;
const HOLD_MS = 2200;
const ERASE_MS = 28;
const NEXT_PHRASE_MS = 380;

const getTypingDelay = (): number => 60 + Math.random() * 70;

const getNextState = (
  state: TypewriterState,
  phrases: readonly string[]
): [TypewriterState, number] => {
  const phrase = phrases[state.phraseIndex] ?? "";

  switch (state.phase) {
    case "waiting":
      return [{ ...state, phase: "typing" }, START_DELAY_MS];
    case "typing":
      return state.length < phrase.length
        ? [{ ...state, length: state.length + 1 }, getTypingDelay()]
        : [{ ...state, phase: "holding" }, HOLD_MS];
    case "holding":
      return [{ ...state, phase: "erasing" }, ERASE_MS];
    case "erasing":
      return state.length > 0
        ? [{ ...state, length: state.length - 1 }, ERASE_MS]
        : [
            { phraseIndex: (state.phraseIndex + 1) % phrases.length, length: 0, phase: "typing" },
            NEXT_PHRASE_MS,
          ];
  }
};

/** Types and erases demo phrases in a loop while `enabled`; returns the visible text. */
const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Types and erases demo phrases in a loop while `enabled`; returns the visible text.
 * With reduced motion the first phrase is shown statically.
 */
export const useTypewriter = (phrases: readonly string[], enabled: boolean): string => {
  const [isStatic] = useState(prefersReducedMotion);
  const [state, setState] = useState<TypewriterState>({
    phraseIndex: 0,
    length: 0,
    phase: "waiting",
  });

  useEffect(() => {
    if (!enabled || isStatic || phrases.length === 0) return;
    const [nextState, delay] = getNextState(state, phrases);
    const timer = window.setTimeout(() => setState(nextState), delay);
    return () => window.clearTimeout(timer);
  }, [enabled, isStatic, phrases, state]);

  const phrase = phrases[state.phraseIndex] ?? "";
  return isStatic ? phrase : phrase.slice(0, state.length);
};
