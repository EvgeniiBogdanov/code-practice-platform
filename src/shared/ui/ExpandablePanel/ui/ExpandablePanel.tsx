import { useLayoutEffect, useRef, type JSX } from "react";
import { clsx } from "clsx";
import type { ExpandablePanelProps } from "../model/expandable-panel";
import styles from "./ExpandablePanel.module.css";

// A single DOM tree preserves expensive children when entering the browser's top layer.
export const ExpandablePanel = ({
  children,
  expanded,
  onCollapse,
  label,
  className,
}: ExpandablePanelProps): JSX.Element => {
  const panel = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = panel.current;
    if (!dialog) return;
    if (expanded) {
      dialog.close();
      dialog.showModal();
      dialog.scrollTop = 0;
    } else {
      // Inline display must not run show()'s autofocus steps.
      dialog.setAttribute("open", "");
    }
    return (): void => {
      if (expanded) dialog.close();
    };
  }, [expanded]);
  return (
    <dialog
      ref={panel}
      role={expanded ? "dialog" : "region"}
      aria-label={label}
      aria-modal={expanded ? true : undefined}
      className={clsx(styles.panel, expanded && styles.expanded, className)}
      onCancel={(event) => {
        event.preventDefault();
        onCollapse();
      }}
    >
      {children}
    </dialog>
  );
};
