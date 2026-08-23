import React, { memo } from "react";
import { clsx } from "clsx";
import { useAccordionState } from "./useAccordionState";
import { AccordionHeader } from "./AccordionHeader";
import { AccordionContent } from "./AccordionContent";
import styles from "./Accordion.module.css";

export type AccordionColor = "purple" | "orange" | "green" | "blue" | "default" | "gray";
export type AccordionSize = "xs" | "sm" | "md";

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  color?: AccordionColor;
  size?: AccordionSize;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: () => void;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const Accordion = memo(
  ({
    title,
    icon,
    color = "default",
    size = "md",
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onToggle,
    badge,
    children,
    className,
    headerClassName,
    contentClassName,
    ...props
  }: AccordionProps) => {
    const { isOpen, hasInteracted, handleToggle } = useAccordionState(
      controlledIsOpen,
      defaultOpen,
      onToggle
    );

    const colorClass = styles[`color-${color}`] || styles["color-default"];
    const sizeClass = styles[`size-${size}`] || styles["size-md"];
    const cardClasses = clsx(styles.accordionCard, colorClass, sizeClass, className);

    return (
      <div className={cardClasses} {...props}>
        <AccordionHeader
          title={title}
          icon={icon}
          badge={badge}
          size={size}
          isOpen={isOpen}
          hasInteracted={hasInteracted}
          onClick={handleToggle}
          className={headerClassName}
        />
        <AccordionContent
          isOpen={isOpen}
          hasInteracted={hasInteracted}
          contentClassName={contentClassName}
        >
          {children}
        </AccordionContent>
      </div>
    );
  }
);

Accordion.displayName = "Accordion";
