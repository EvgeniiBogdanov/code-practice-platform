import type { JSX, ReactNode } from "react";
import { clsx } from "clsx";
import { ExpandablePanel } from "../ExpandablePanel";
import { UiTransitionSurface } from "../UiTransitionSurface";
import { useFullscreenPanel } from "./useFullscreenPanel";
import styles from "./UiFullscreenPanel.module.css";

export interface FullscreenPanelState {
  isFullscreen: boolean;
  isTransitioning: boolean;
  toggleFullscreen: () => void;
}

interface UiFullscreenPanelProps {
  label: string;
  children: (state: FullscreenPanelState) => ReactNode;
  active?: boolean;
}

/** Keep one live editor/canvas in the native top layer, including during collapse. */
export const UiFullscreenPanel = ({
  label,
  children,
  active = true,
}: UiFullscreenPanelProps): JSX.Element => {
  const { expanded, isTransitioning, panel, anchor, toggleFullscreen } = useFullscreenPanel();

  return (
    <div ref={anchor} className={styles.anchor}>
      <ExpandablePanel
        panelRef={panel}
        expanded={expanded}
        onCollapse={toggleFullscreen}
        label={label}
      >
        <UiTransitionSurface
          active={active}
          className={clsx(styles.surface, expanded && styles.fullscreen)}
        >
          {children({ isFullscreen: expanded, isTransitioning, toggleFullscreen })}
        </UiTransitionSurface>
      </ExpandablePanel>
    </div>
  );
};
