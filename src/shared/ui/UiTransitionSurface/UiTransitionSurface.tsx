import { clsx } from "clsx";
import type { JSX, ReactNode } from "react";
import styles from "./UiTransitionSurface.module.css";

interface UiTransitionSurfaceProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

/** Pairs a working surface across layouts using the browser's native snapshots. */
export const UiTransitionSurface = ({
  children,
  className,
  active = true,
}: UiTransitionSurfaceProps): JSX.Element => (
  <div className={clsx(active && styles.surface, className)}>{children}</div>
);
