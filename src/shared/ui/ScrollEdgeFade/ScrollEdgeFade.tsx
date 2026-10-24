import React from "react";
import { clsx } from "clsx";
import styles from "./ScrollEdgeFade.module.css";

export interface ScrollEdgeFadeProps {
  /** Shown once the content has scrolled away from the top edge. */
  isVisible: boolean;
}

/**
 * A soft edge at the top of a scroller: place it as the first child of the scroll container.
 * The fill is `--edge-fade-color`, so the surface around the scroller should set it.
 */
export const ScrollEdgeFade = ({ isVisible }: ScrollEdgeFadeProps): React.JSX.Element => (
  <div aria-hidden="true" className={clsx(styles.edgeFade, isVisible && styles.edgeFadeVisible)} />
);
