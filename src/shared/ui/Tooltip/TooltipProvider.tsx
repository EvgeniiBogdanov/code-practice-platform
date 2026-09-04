import { memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { TooltipProviderContext, DEFAULT_TOOLTIP_DELAY_DURATION } from "./types";

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disabled?: boolean;
}

export const TooltipProvider = memo(
  ({
    children,
    delayDuration = DEFAULT_TOOLTIP_DELAY_DURATION,
    skipDelayDuration = 300,
    disabled: explicitDisabled,
  }: TooltipProviderProps) => {
    const parentContext = useContext(TooltipProviderContext);
    const disabled =
      explicitDisabled !== undefined ? explicitDisabled : Boolean(parentContext.disabled);
    const [isWarm, setIsWarm] = useState(false);
    const warmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setWarm = useCallback(
      (warm: boolean) => {
        if (warmTimerRef.current) clearTimeout(warmTimerRef.current);
        if (warm) {
          setIsWarm(true);
        } else {
          warmTimerRef.current = setTimeout(() => {
            setIsWarm(false);
          }, skipDelayDuration);
        }
      },
      [skipDelayDuration]
    );

    // Reset warm state when user leaves tab/window
    useEffect(() => {
      const handleWindowBlur = () => {
        if (warmTimerRef.current) clearTimeout(warmTimerRef.current);
        setIsWarm(false);
      };

      window.addEventListener("blur", handleWindowBlur);
      document.addEventListener("visibilitychange", handleWindowBlur);
      return () => {
        window.removeEventListener("blur", handleWindowBlur);
        document.removeEventListener("visibilitychange", handleWindowBlur);
      };
    }, []);

    return (
      <TooltipProviderContext.Provider
        value={{ delayDuration, skipDelayDuration, isWarm, setWarm, disabled }}
      >
        {children}
      </TooltipProviderContext.Provider>
    );
  }
);

TooltipProvider.displayName = "TooltipProvider";
