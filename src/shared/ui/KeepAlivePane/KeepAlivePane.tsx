import { useLayoutEffect, useRef, type JSX, type ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./KeepAlivePane.module.css";

export interface KeepAlivePaneProps {
  isActive: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A pane that stays mounted while another one is shown.
 *
 * The browser skips a `content-visibility: hidden` subtree, and with it style recalculation, so
 * it keeps the colours it had when it was last shown. If the theme changed in the meantime,
 * showing the pane makes every themed property differ from that stale style and the pane's
 * transitions play from the old theme to the new one: a flash of the wrong colours.
 * For the first frames after the pane is shown its transitions are switched off.
 */
export const KeepAlivePane = ({
  isActive,
  children,
  className,
}: KeepAlivePaneProps): JSX.Element => {
  const paneRef = useRef<HTMLDivElement>(null);
  const wasActive = useRef(isActive);

  useLayoutEffect(() => {
    const pane = paneRef.current;
    const isRevealed = isActive && !wasActive.current;
    wasActive.current = isActive;
    if (!pane || !isRevealed) return undefined;

    // Set before the browser resolves the new styles, cleared once they are in place.
    pane.setAttribute("data-revealing", "");
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => pane.removeAttribute("data-revealing"));
    });
    return (): void => {
      cancelAnimationFrame(frame);
      pane.removeAttribute("data-revealing");
    };
  }, [isActive]);

  return (
    <div ref={paneRef} className={clsx(styles.pane, !isActive && styles.inactive, className)}>
      {children}
    </div>
  );
};
