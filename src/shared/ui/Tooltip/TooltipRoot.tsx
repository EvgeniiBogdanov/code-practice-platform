import { memo, ReactNode, useId, useRef } from "react";
import { TooltipContext } from "./types";
import { useTooltipOpenState } from "./useTooltipOpenState";

export interface TooltipRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disabled?: boolean;
}

export const TooltipRoot = memo(
  ({
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    delayDuration,
    disabled = false,
  }: TooltipRootProps) => {
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const tooltipId = useId();

    const { isOpen, handleOpen, handleClose } = useTooltipOpenState({
      open,
      defaultOpen,
      onOpenChange,
      delayDuration,
      disabled,
    });

    const contextValue = {
      isOpen,
      disabled,
      triggerRef,
      contentRef,
      handleOpen,
      handleClose,
      tooltipId,
    };

    return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
  }
);

TooltipRoot.displayName = "TooltipRoot";
