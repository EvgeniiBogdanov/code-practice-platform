import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

/**
 * Radix-inspired Tooltip Primitive System
 * Supports both compound primitive pattern (Provider -> Root -> Trigger -> Content)
 * and compact single-wrapper ergonomics (<Tooltip content="..." side="bottom">...</Tooltip>).
 */

const TooltipContext = createContext(null);
const TooltipProviderContext = createContext({
  delayDuration: 180,
  skipDelayDuration: 300,
  isWarm: false,
  setWarm: () => {},
});

/**
 * Global provider for managing warmup delay groups.
 */
export const TooltipProvider = ({
  children,
  delayDuration = 180,
  skipDelayDuration = 300,
}) => {
  const [isWarm, setIsWarm] = useState(false);
  const warmTimerRef = useRef(null);

  const setWarm = useCallback(
    (warm) => {
      if (warm) {
        if (warmTimerRef.current) clearTimeout(warmTimerRef.current);
        setIsWarm(true);
      } else {
        if (warmTimerRef.current) clearTimeout(warmTimerRef.current);
        warmTimerRef.current = setTimeout(() => {
          setIsWarm(false);
        }, skipDelayDuration);
      }
    },
    [skipDelayDuration]
  );

  return (
    <TooltipProviderContext.Provider
      value={{ delayDuration, skipDelayDuration, isWarm, setWarm }}
    >
      {children}
    </TooltipProviderContext.Provider>
  );
};

/**
 * Tooltip Root Context Provider
 */
export const TooltipRoot = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayDuration: customDelay,
  disabled = false,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const provider = useContext(TooltipProviderContext);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutRef = useRef(null);
  const tooltipId = useId();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const delay =
    customDelay !== undefined
      ? customDelay
      : provider.isWarm
      ? 0
      : provider.delayDuration;

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

  return (
    <TooltipContext.Provider
      value={{
        isOpen,
        disabled,
        triggerRef,
        contentRef,
        handleOpen,
        handleClose,
        tooltipId,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

/**
 * Tooltip Trigger
 */
export const TooltipTrigger = ({
  children,
  asChild = false,
  className = "",
  ...props
}) => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipTrigger must be used within a Tooltip or TooltipRoot");
  }

  const { isOpen, handleOpen, handleClose, triggerRef, tooltipId } = context;

  const handlePointerDown = (e) => {
    handleClose();
    props.onPointerDown?.(e);
  };

  const handleMouseEnter = (e) => {
    handleOpen();
    props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    handleClose();
    props.onMouseLeave?.(e);
  };

  const handleFocus = (e) => {
    handleOpen();
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    handleClose();
    props.onBlur?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: (node) => {
        triggerRef.current = node;
        const { ref } = children;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      "aria-describedby": isOpen ? tooltipId : undefined,
      onMouseEnter: (e) => {
        handleMouseEnter(e);
        children.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e) => {
        handleMouseLeave(e);
        children.props.onMouseLeave?.(e);
      },
      onFocus: (e) => {
        handleFocus(e);
        children.props.onFocus?.(e);
      },
      onBlur: (e) => {
        handleBlur(e);
        children.props.onBlur?.(e);
      },
      onPointerDown: (e) => {
        handlePointerDown(e);
        children.props.onPointerDown?.(e);
      },
    });
  }

  return (
    <span
      ref={triggerRef}
      className={`radix-tooltip-trigger-wrapper ${className}`}
      aria-describedby={isOpen ? tooltipId : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerDown={handlePointerDown}
      style={{ display: "inline-flex" }}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Tooltip Content rendered via Portal with collision boundary handling
 */
export const TooltipContent = ({
  children,
  side = "bottom", // 'top' | 'bottom' | 'left' | 'right'
  align = "center", // 'start' | 'center' | 'end'
  sideOffset = 6,
  arrow = true,
  className = "",
  style = {},
  ...props
}) => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipContent must be used within a Tooltip or TooltipRoot");
  }

  const { isOpen, triggerRef, contentRef, tooltipId } = context;
  const [coords, setCoords] = useState({ top: -9999, left: -9999, actualSide: side });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let targetSide = side;
    let top = 0;
    let left = 0;

    // Check vertical collisions for top / bottom
    if (targetSide === "bottom" && triggerRect.bottom + sideOffset + contentRect.height > viewportHeight - 8) {
      if (triggerRect.top - sideOffset - contentRect.height > 8) {
        targetSide = "top";
      }
    } else if (targetSide === "top" && triggerRect.top - sideOffset - contentRect.height < 8) {
      if (triggerRect.bottom + sideOffset + contentRect.height < viewportHeight - 8) {
        targetSide = "bottom";
      }
    }

    // Compute coordinates
    if (targetSide === "bottom") {
      top = triggerRect.bottom + sideOffset;
    } else if (targetSide === "top") {
      top = triggerRect.top - contentRect.height - sideOffset;
    } else if (targetSide === "left") {
      left = triggerRect.left - contentRect.width - sideOffset;
    } else if (targetSide === "right") {
      left = triggerRect.right + sideOffset;
    }

    // Horizontal alignment
    if (targetSide === "top" || targetSide === "bottom") {
      if (align === "start") {
        left = triggerRect.left;
      } else if (align === "end") {
        left = triggerRect.right - contentRect.width;
      } else {
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
      }
    } else {
      // Vertical alignment for left/right
      if (align === "start") {
        top = triggerRect.top;
      } else if (align === "end") {
        top = triggerRect.bottom - contentRect.height;
      } else {
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
      }
    }

    // Clamp inside viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + contentRect.width > viewportWidth - padding) {
      left = viewportWidth - contentRect.width - padding;
    }

    if (top < padding) top = padding;
    if (top + contentRect.height > viewportHeight - padding) {
      top = viewportHeight - contentRect.height - padding;
    }

    const finalTop = Math.round(top);
    const finalLeft = Math.round(left);

    // Compute dynamic arrow position aligned with the trigger center
    let arrowLeft = null;
    let arrowTop = null;

    if (targetSide === "top" || targetSide === "bottom") {
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const rawArrowLeft = triggerCenterX - finalLeft;
      const minOffset = 10;
      const maxOffset = Math.max(minOffset, contentRect.width - 10);
      arrowLeft = Math.round(Math.max(minOffset, Math.min(maxOffset, rawArrowLeft)));
    } else {
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      const rawArrowTop = triggerCenterY - finalTop;
      const minOffset = 8;
      const maxOffset = Math.max(minOffset, contentRect.height - 8);
      arrowTop = Math.round(Math.max(minOffset, Math.min(maxOffset, rawArrowTop)));
    }

    setCoords({
      top: finalTop,
      left: finalLeft,
      actualSide: targetSide,
      arrowLeft,
      arrowTop,
    });
  }, [side, align, sideOffset, triggerRef, contentRef]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={contentRef}
      id={tooltipId}
      role="tooltip"
      data-state={isOpen ? "open" : "closed"}
      data-side={coords.actualSide}
      className={`radix-tooltip-content ${className}`}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        "--arrow-left": coords.arrowLeft ? `${coords.arrowLeft}px` : undefined,
        "--arrow-top": coords.arrowTop ? `${coords.arrowTop}px` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
      {arrow && <div className={`radix-tooltip-arrow arrow-${coords.actualSide}`} />}
    </div>,
    document.body
  );
};

export const TooltipArrow = ({ className = "" }) => {
  return <div className={`radix-tooltip-arrow ${className}`} />;
};

/**
 * Convenient all-in-one Tooltip component.
 * Usage:
 * <Tooltip content="Статистика" side="bottom">
 *   <button>...</button>
 * </Tooltip>
 */
export const Tooltip = ({
  content,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  delayDuration,
  disabled = false,
  arrow = true,
  asChild = true,
  className = "",
  contentClassName = "",
}) => {
  if (!content) return children;

  return (
    <TooltipRoot delayDuration={delayDuration} disabled={disabled}>
      <TooltipTrigger asChild={asChild} className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        arrow={arrow}
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

Tooltip.Provider = TooltipProvider;
Tooltip.Root = TooltipRoot;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;

export default Tooltip;
