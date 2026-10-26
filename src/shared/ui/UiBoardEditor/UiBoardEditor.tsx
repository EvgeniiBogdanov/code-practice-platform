import { lazy, Suspense, type JSX } from "react";
import { clsx } from "clsx";
import { ErrorBoundary } from "../ErrorBoundary";
import { UiFullscreenPanel } from "../UiFullscreenPanel";
import { UiLoader } from "../UiLoader";
import type { UiBoardEditorProps } from "./boardTypes";
import styles from "./UiBoardEditor.module.css";

// The drawing library is heavy and only needed on a stage page, so it loads on first use.
const BoardCanvas = lazy(() =>
  import("./BoardCanvas").then((module) => ({ default: module.BoardCanvas }))
);

/** A board for drawing cards and arrows with text; the value is plain JSON the caller persists. */
export const UiBoardEditor = (props: UiBoardEditorProps): JSX.Element => (
  <UiFullscreenPanel label={props.label}>
    {({ isFullscreen, toggleFullscreen }) => (
      <div
        className={clsx(styles.host, isFullscreen && styles.fullscreen)}
        role="group"
        aria-label={props.label}
      >
        <ErrorBoundary
          fallback={() => (
            <p className={styles.problem} role="alert">
              Не удалось загрузить редактор схемы. Обновите страницу, чтобы попробовать снова.
            </p>
          )}
        >
          <Suspense
            fallback={<UiLoader size="sm" center label="Загружаем редактор схемы" showLabel />}
          >
            <BoardCanvas
              {...props}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    )}
  </UiFullscreenPanel>
);
