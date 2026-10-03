import React, { useLayoutEffect } from "react";
import { clsx } from "clsx";
import { useParentSize } from "../../lib/hooks";
import styles from "./UiScaledCanvas.module.css";

export interface UiScaledCanvasProps {
  /** Design width of the composition in px. */
  width: number;
  /** Design height of the composition in px. */
  height: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Renders a fixed-size composition and scales it down (never up) to the available width,
 * keeping pixel-perfect product previews intact on narrow screens.
 */
export const UiScaledCanvas = ({
  width,
  height,
  className,
  children,
}: UiScaledCanvasProps): React.JSX.Element => {
  const [frameRef, { width: frameWidth }] = useParentSize<HTMLDivElement>();

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const scale = frameWidth > 0 ? Math.min(1, frameWidth / width) : 1;
    frame.style.setProperty("--canvas-width", `${width}px`);
    frame.style.setProperty("--canvas-height", `${height}px`);
    frame.style.setProperty("--canvas-scale", scale.toFixed(4));
  }, [frameRef, frameWidth, width, height]);

  return (
    <div ref={frameRef} className={clsx(styles.frame, className)}>
      <div className={styles.canvas}>{children}</div>
    </div>
  );
};

UiScaledCanvas.displayName = "UiScaledCanvas";
