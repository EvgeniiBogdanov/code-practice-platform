import { CSSProperties, HTMLAttributes, memo, ReactNode, useContext } from "react";
import { clsx } from "clsx";
import { createPortal } from "react-dom";
import { TooltipAlign, TooltipCoords, TooltipSide } from "./calculateTooltipPosition";
import { TooltipContext } from "./types";
import { useTooltipPosition } from "./useTooltipPosition";
import styles from "./Tooltip.module.css";

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  arrow?: boolean;
}

const buildDynamicStyles = (coords: TooltipCoords, style?: CSSProperties): CSSProperties => {
  return {
    top: `${coords.top}px`,
    left: `${coords.left}px`,
    visibility: coords.top === -9999 ? "hidden" : undefined,
    ...(coords.arrowLeft !== undefined && {
      ["--arrow-left" as string]: `${coords.arrowLeft}px`,
    }),
    ...(coords.arrowTop !== undefined && {
      ["--arrow-top" as string]: `${coords.arrowTop}px`,
    }),
    ...style,
  };
};

export const TooltipContent = memo(
  ({
    children,
    side = "bottom",
    align = "center",
    sideOffset = 6,
    arrow = true,
    className,
    style,
    ...props
  }: TooltipContentProps) => {
    const context = useContext(TooltipContext);
    if (!context) {
      throw new Error("TooltipContent must be used within a Tooltip or TooltipRoot");
    }

    const { isOpen, triggerRef, contentRef, tooltipId } = context;
    const coords = useTooltipPosition({
      isOpen,
      triggerRef,
      contentRef,
      side,
      align,
      sideOffset,
    });

    if (!isOpen || typeof document === "undefined") return null;

    const arrowClass = clsx(styles.arrow, styles[`arrow_${coords.actualSide}`]);

    return createPortal(
      <div
        ref={contentRef}
        id={tooltipId}
        role="tooltip"
        data-state={isOpen ? "open" : "closed"}
        data-side={coords.actualSide}
        className={clsx(styles.content, className)}
        style={buildDynamicStyles(coords, style)}
        {...props}
      >
        {children}
        {arrow && <div className={arrowClass} />}
      </div>,
      document.body
    );
  }
);

TooltipContent.displayName = "TooltipContent";
