import { useLayoutEffect, useRef, type JSX } from "react";
import { clsx } from "clsx";
import type { ExpandablePanelProps } from "../model/expandablePanel";
import styles from "./ExpandablePanel.module.css";

// A single DOM tree preserves expensive children when entering the browser's top layer.
export const ExpandablePanel = ({
  children,
  expanded,
  onCollapse,
  label,
  className,
  panelRef,
}: ExpandablePanelProps): JSX.Element => {
  const internalPanel = useRef<HTMLDialogElement>(null);
  const panel = panelRef ?? internalPanel;
  useLayoutEffect(() => {
    const dialog = panel.current;
    if (!dialog) return;
    if (expanded) {
      dialog.close();
      dialog.showModal();
    } else {
      // Inline display must not run show()'s autofocus steps.
      dialog.setAttribute("open", "");
    }
    return (): void => {
      if (expanded) dialog.close();
    };
  }, [expanded, panel]);
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
