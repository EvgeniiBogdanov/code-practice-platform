import React from "react";
import styles from "./ScrollCue.module.css";

export interface ScrollCueProps {
  /** Anchor id of the next scene. */
  targetId: string;
  /** Badge text: the name of the next scene. */
  label: string;
}

/** Bottom of a scene: a badge naming the next scene and an arrow that draws itself downwards. */
export const ScrollCue = ({ targetId, label }: ScrollCueProps): React.JSX.Element => (
  <a className={styles.cue} href={`#${targetId}`}>
    <span className={styles.badge}>{label}</span>
    <svg className={styles.arrow} viewBox="0 0 16 40" fill="none" aria-hidden="true">
      {/* One continuous stroke: the shaft is drawn down and ends in the arrowhead */}
      <path
        d="M8 2V37M2.5 31.5L8 37L13.5 31.5"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>
);
