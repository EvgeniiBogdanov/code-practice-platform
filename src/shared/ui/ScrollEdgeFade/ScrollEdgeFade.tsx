import React from "react";
import styles from "./ScrollEdgeFade.module.css";

/**
 * A soft top edge of a scroller: place it as the first child of the scroll container.
 * It sticks to the top of the scroller, so content fades out as it scrolls under it,
 * and sticky panels with a higher z-index stay above it.
 * The fill is `--edge-fade-color`, so the surface around the scroller should set it.
 */
export const ScrollEdgeFade = (): React.JSX.Element => (
  <div aria-hidden="true" className={styles.edgeFade} />
);
