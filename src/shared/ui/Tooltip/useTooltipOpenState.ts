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
  const isOpen = (isControlled ? controlledOpen : uncontrolledOpen) && !disabled;
  // A disabled tooltip must not reopen on its own once it is enabled again
  if (disabled && uncontrolledOpen) setUncontrolledOpen(false);
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

  const notifyClosed = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpenChange?.(false);
    provider.setWarm(false);
  }, [onOpenChange, provider]);

  const handleClose = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    notifyClosed();
  }, [isControlled, notifyClosed]);

  // Tell the owner and the provider when the tooltip is closed by becoming disabled
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !isOpen && disabled) notifyClosed();
    wasOpenRef.current = isOpen;
  }, [isOpen, disabled, notifyClosed]);

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
