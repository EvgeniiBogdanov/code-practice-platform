import { createContext, MutableRefObject, ReactNode } from "react";
import { TooltipSide, TooltipAlign } from "./calculateTooltipPosition";

export interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  isWarm: boolean;
  setWarm: (warm: boolean) => void;
}

export const DEFAULT_TOOLTIP_DELAY_DURATION = 300;

export const TooltipProviderContext = createContext<TooltipProviderContextValue>({
  delayDuration: DEFAULT_TOOLTIP_DELAY_DURATION,
  skipDelayDuration: 300,
  isWarm: false,
  setWarm: () => {},
});

export interface TooltipContextValue {
  isOpen: boolean;
  disabled: boolean;
  triggerRef: MutableRefObject<HTMLElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  handleOpen: () => void;
  handleClose: () => void;
  tooltipId: string;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export interface TooltipProps {
  content?: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  position?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  delayDuration?: number;
  disabled?: boolean;
  arrow?: boolean;
  asChild?: boolean;
  fullWidth?: boolean;
  className?: string;
  contentClassName?: string;
}
