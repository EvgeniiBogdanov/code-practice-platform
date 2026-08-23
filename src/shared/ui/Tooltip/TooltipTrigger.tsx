import React, {
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  ReactNode,
  Ref,
  memo,
  useContext,
} from "react";
import { clsx } from "clsx";
import { TooltipContext } from "./types";
import styles from "./Tooltip.module.css";

export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  asChild?: boolean;
  fullWidth?: boolean;
}

type ChildWithRef = ReactElement<{
  ref?: Ref<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  onPointerDown?: React.PointerEventHandler;
  "aria-describedby"?: string;
}>;

const cloneTriggerElement = (
  child: ChildWithRef,
  triggerRef: MutableRefObject<HTMLElement | null>,
  isOpen: boolean,
  tooltipId: string,
  handleOpen: () => void,
  handleClose: () => void
) => {
  return React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const ref = child.props.ref;
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in ref) {
        (ref as MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    "aria-describedby": isOpen ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      handleOpen();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleClose();
      child.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      handleOpen();
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      handleClose();
      child.props.onBlur?.(e);
    },
    onPointerDown: (e: React.PointerEvent) => {
      handleClose();
      child.props.onPointerDown?.(e);
    },
  });
};

export const TooltipTrigger = memo(
  ({ children, asChild = true, fullWidth = false, className, ...props }: TooltipTriggerProps) => {
    const context = useContext(TooltipContext);
    if (!context) {
      throw new Error("TooltipTrigger must be used within a Tooltip or TooltipRoot");
    }

    const { isOpen, handleOpen, handleClose, triggerRef, tooltipId } = context;

    if (asChild && React.isValidElement(children)) {
      return cloneTriggerElement(
        children as ChildWithRef,
        triggerRef,
        isOpen,
        tooltipId,
        handleOpen,
        handleClose
      );
    }

    const wrapperClass = clsx(styles.triggerWrapper, fullWidth && styles.fullWidth, className);

    return (
      <span
        ref={(node) => {
          triggerRef.current = node;
        }}
        className={wrapperClass}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        onPointerDown={handleClose}
        {...props}
      >
        {children}
      </span>
    );
  }
);

TooltipTrigger.displayName = "TooltipTrigger";
