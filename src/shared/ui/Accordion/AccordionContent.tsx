import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./Accordion.module.css";

export interface AccordionContentProps {
  isOpen: boolean;
  hasInteracted: boolean;
  children: React.ReactNode;
  contentClassName?: string;
}

export const AccordionContent = memo(
  ({ isOpen, hasInteracted, children, contentClassName }: AccordionContentProps) => {
    return (
      <div
        className={clsx(
          styles.contentCollapse,
          isOpen && styles.expanded,
          !hasInteracted && styles.noTransition
        )}
      >
        <div className={styles.contentInner}>
          <div className={clsx(styles.contentBody, contentClassName)}>{children}</div>
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";
