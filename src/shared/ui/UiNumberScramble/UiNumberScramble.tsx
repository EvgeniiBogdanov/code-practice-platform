import React, { useState, useEffect, useRef, memo } from "react";

export interface UiNumberScrambleProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const UiNumberScramble = memo(
  ({
    value,
    duration = 450,
    suffix = "",
    prefix = "",
    className,
  }: UiNumberScrambleProps): React.JSX.Element => {
    const [displayVal, setDisplayVal] = useState<number | string>(value);
    const prevValueRef = useRef<number>(value);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      // Respect user's motion preference or test environment without matchMedia
      if (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setDisplayVal(value);
        prevValueRef.current = value;
        return;
      }

      // If value has not changed (already cached / mounted with loaded data), do not trigger scramble
      if (prevValueRef.current === value) {
        return;
      }

      prevValueRef.current = value;

      const startTime = performance.now();
      const roundedVal = Math.round(value);
      const len = Math.max(1, String(roundedVal).length);
      const min = len === 1 ? 0 : Math.pow(10, len - 1);
      const max = Math.pow(10, len) - 1;

      let lastScrambleTime = 0;
      const scrambleInterval = 35;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        if (progress < 0.7) {
          if (now - lastScrambleTime >= scrambleInterval) {
            lastScrambleTime = now;
            const randomVal = Math.floor(Math.random() * (max - min + 1)) + min;
            setDisplayVal(randomVal);
          }
          animationFrameRef.current = requestAnimationFrame(tick);
        } else if (progress < 1) {
          const settleProgress = (progress - 0.7) / 0.3;
          const currentRandom = Math.floor(Math.random() * (max - min + 1)) + min;
          const interpolated = Math.round(
            currentRandom * (1 - settleProgress) + roundedVal * settleProgress
          );
          setDisplayVal(interpolated);
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayVal(value);
        }
      };

      if (typeof requestAnimationFrame === "function") {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayVal(value);
      }

      // Safety fallback timer to guarantee exact value settles even if rAF is paused
      timeoutIdRef.current = setTimeout(() => {
        setDisplayVal(value);
      }, duration + 50);

      return () => {
        if (animationFrameRef.current !== null && typeof cancelAnimationFrame === "function") {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (timeoutIdRef.current !== null) {
          clearTimeout(timeoutIdRef.current);
        }
      };
    }, [value, duration]);

    return (
      <span className={className}>
        {prefix}
        {displayVal}
        {suffix}
      </span>
    );
  }
);

UiNumberScramble.displayName = "UiNumberScramble";
