import { memo, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { TooltipProviderContext } from "./types";

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export const TooltipProvider = memo(
  ({ children, delayDuration = 600, skipDelayDuration = 300 }: TooltipProviderProps) => {
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
        value={{ delayDuration, skipDelayDuration, isWarm, setWarm }}
      >
        {children}
      </TooltipProviderContext.Provider>
    );
  }
);

TooltipProvider.displayName = "TooltipProvider";
