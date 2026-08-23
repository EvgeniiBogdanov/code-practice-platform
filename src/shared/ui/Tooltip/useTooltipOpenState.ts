import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TooltipProviderContext } from "./types";

interface UseTooltipOpenStateParams {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disabled?: boolean;
}

export const useTooltipOpenState = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayDuration: customDelay,
  disabled = false,
}: UseTooltipOpenStateParams) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const provider = useContext(TooltipProviderContext);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const delay =
    customDelay !== undefined ? customDelay : provider.isWarm ? 0 : provider.delayDuration;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay === 0) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
      provider.setWarm(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        if (!isControlled) setUncontrolledOpen(true);
        onOpenChange?.(true);
        provider.setWarm(true);
      }, delay);
    }
  }, [disabled, delay, isControlled, onOpenChange, provider]);

  const handleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
    provider.setWarm(false);
  }, [isControlled, onOpenChange, provider]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isOpen, handleOpen, handleClose };
};
