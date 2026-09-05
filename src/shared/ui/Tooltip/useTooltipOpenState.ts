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
  disabled: localDisabled = false,
}: UseTooltipOpenStateParams) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const provider = useContext(TooltipProviderContext);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disabled = localDisabled || Boolean(provider.disabled);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const delay =
    customDelay !== undefined ? customDelay : provider.isWarm ? 0 : provider.delayDuration;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (typeof document !== "undefined" && document.hidden) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay === 0) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
      provider.setWarm(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        if (typeof document !== "undefined" && document.hidden) return;
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

  // Close immediately if disabled becomes true while open
  useEffect(() => {
    if (disabled && isOpen) {
      handleClose();
    }
  }, [disabled, isOpen, handleClose]);

  // Close tooltip on window blur or tab visibility change (tab switch)
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityOrBlur = () => {
      if (document.hidden || !document.hasFocus()) {
        handleClose();
      }
    };

    window.addEventListener("blur", handleVisibilityOrBlur);
    document.addEventListener("visibilitychange", handleVisibilityOrBlur);
    return () => {
      window.removeEventListener("blur", handleVisibilityOrBlur);
      document.removeEventListener("visibilitychange", handleVisibilityOrBlur);
    };
  }, [isOpen, handleClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isOpen, handleOpen, handleClose };
};
