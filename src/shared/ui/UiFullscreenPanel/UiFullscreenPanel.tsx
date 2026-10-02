import { useEffect, useRef, useState, type JSX, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { clsx } from "clsx";
import { ExpandablePanel } from "../ExpandablePanel";
import { UiTransitionSurface } from "../UiTransitionSurface";
import { animatePanelBounds, getWorkspaceViewTransition, holdPanelSpace } from "./panel-animation";
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
  const [expanded, setExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const panel = useRef<HTMLDialogElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const space = useRef<Animation | null>(null);
  const pending = useRef(false);
  const animation = useRef<Animation | null>(null);

  useEffect(
    () => (): void => {
      animation.current?.cancel();
      space.current?.cancel();
    },
    []
  );

  const toggleFullscreen = (): void => {
    const dialog = panel.current;
    const container = anchor.current;
    if (!dialog || !container || pending.current) return;
    pending.current = true;
    const next = !expanded;
    const before = dialog.getBoundingClientRect();
    const padding = getComputedStyle(dialog).padding;
    const focus = document.activeElement;
    const motion = getWorkspaceViewTransition(next ? "expand" : "collapse");
    if (next) space.current = holdPanelSpace(container);
    setIsTransitioning(true);

    const update = (): void => {
      flushSync(() => setExpanded(next));
      if (!next) {
        space.current?.cancel();
        space.current = null;
      }
      if (focus instanceof HTMLElement && dialog.contains(focus)) {
        focus.focus({ preventScroll: true });
      }
    };

    const transition = async (): Promise<void> => {
      try {
        if (motion && typeof document.startViewTransition === "function") {
          const native = document.startViewTransition({
            ...motion,
            update,
          });
          await native.finished;
        } else {
          update();
          if (motion) {
            animation.current = animatePanelBounds(dialog, before, padding, next);
            await animation.current?.finished;
          }
        }
      } finally {
        pending.current = false;
        setIsTransitioning(false);
        animation.current = null;
      }
    };
    void transition().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("Не удалось завершить анимацию панели", error);
      }
    });
  };

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
