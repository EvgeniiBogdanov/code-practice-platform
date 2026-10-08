import type { JSX, ReactNode } from "react";
import { ViewModeToggle, type ViewMode } from "../ViewModeToggle";
import styles from "./ViewModeFrame.module.css";

export interface ViewModeFrameProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  /** Without a visual result there is nothing to switch to, so no toggle is shown. */
  hasToggle: boolean;
  children: ReactNode;
}

/**
 * Hosts the code window and its interface preview and floats the code/interface switch over
 * both, pinned to the top-right corner just below their title bars. It is the same spot in
 * either mode, so the switch never moves under the pointer when it is pressed.
 */
export const ViewModeFrame = ({
  mode,
  onChange,
  hasToggle,
  children,
}: ViewModeFrameProps): JSX.Element => (
  <div className={styles.frame}>
    {hasToggle && <ViewModeToggle mode={mode} onChange={onChange} className={styles.toggle} />}
    {children}
  </div>
);
