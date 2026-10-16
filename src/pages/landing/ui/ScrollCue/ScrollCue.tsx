import React from "react";
import styles from "./ScrollCue.module.css";

export interface ScrollCueProps {
  /** Anchor id of the next scene. */
  targetId: string;
  /** Badge text: the name of the next scene. */
  label: string;
}

/** Bottom of a scene: a badge naming the next scene and an arrow that slides down out of its clip. */
export const ScrollCue = ({ targetId, label }: ScrollCueProps): React.JSX.Element => (
  <a className={styles.cue} href={`#${targetId}`}>
    <span className={styles.badge}>{label}</span>
    <span className={styles.arrowClip} aria-hidden="true">
      <svg className={styles.arrow} viewBox="0 0 16 40" fill="none">
        <path
          d="M8 2V37M2.5 31.5L8 37L13.5 31.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </a>
);
