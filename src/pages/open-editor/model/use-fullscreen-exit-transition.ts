import { useCallback, useRef, useTransition } from "react";

export interface UseFullscreenExitTransitionReturn {
  isFullscreenExiting: boolean;
  startFullscreenExit: (onExit: () => Promise<void>) => void;
}

export const useFullscreenExitTransition = (): UseFullscreenExitTransitionReturn => {
  const [isFullscreenExiting, startTransition] = useTransition();
  const isFullscreenExitingRef = useRef(false);

  const startFullscreenExit = useCallback(
    (onExit: () => Promise<void>): void => {
      if (isFullscreenExitingRef.current) return;

      isFullscreenExitingRef.current = true;
      startTransition(async () => {
        try {
          await onExit();
        } finally {
          isFullscreenExitingRef.current = false;
        }
      });
    },
    [startTransition]
  );

  return { isFullscreenExiting, startFullscreenExit };
};
