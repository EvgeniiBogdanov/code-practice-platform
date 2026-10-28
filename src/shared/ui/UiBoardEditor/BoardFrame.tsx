import { Suspense, type JSX, type ReactNode } from "react";
import { clsx } from "clsx";
import { ErrorBoundary } from "../ErrorBoundary";
import { UiFullscreenPanel } from "../UiFullscreenPanel";
import { UiLoader } from "../UiLoader";
import styles from "./BoardFrame.module.css";

export interface BoardFrameState {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

interface BoardFrameProps {
  /** Accessible name of the whole board. */
  label: string;
  /** The lazily loaded canvas: the drawing library is heavy, so it loads on first use. */
  children: (state: BoardFrameState) => ReactNode;
}

/** What the editor and the viewer share: fullscreen, the loading state and a fallback if the canvas fails. */
export const BoardFrame = ({ label, children }: BoardFrameProps): JSX.Element => (
  <UiFullscreenPanel label={label}>
    {({ isFullscreen, toggleFullscreen }) => (
      <div
        className={clsx(styles.host, isFullscreen && styles.fullscreen)}
        role="group"
        aria-label={label}
      >
        <ErrorBoundary
          fallback={() => (
            <p className={styles.problem} role="alert">
              Не удалось загрузить схему. Обновите страницу, чтобы попробовать снова.
            </p>
          )}
        >
          <Suspense fallback={<UiLoader size="sm" center label="Загружаем схему" showLabel />}>
            {children({ isFullscreen, toggleFullscreen })}
          </Suspense>
        </ErrorBoundary>
      </div>
    )}
  </UiFullscreenPanel>
);
