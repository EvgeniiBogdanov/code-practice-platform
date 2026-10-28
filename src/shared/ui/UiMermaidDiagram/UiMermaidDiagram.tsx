import { useEffect, useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "../Button";
import { CodeViewer } from "../CodeViewer";
import { UiFullscreenPanel } from "../UiFullscreenPanel";
import { UiSpinner } from "../UiSpinner";
import { useDocumentTheme } from "./useDocumentTheme";
import styles from "./UiMermaidDiagram.module.css";

export interface UiMermaidDiagramProps {
  /** Mermaid source: flowchart, sequenceDiagram, stateDiagram-v2, gantt… */
  code: string;
  /** Accessible name of the diagram. */
  label?: string;
}

interface DrawResult {
  /** The source the result was drawn for: a drawing of another diagram is never shown. */
  code: string;
  /** What the result was drawn for: the source, the theme and the attempt. */
  key: string;
  svg: string | null;
}

const ICON_SIZE = 16;
/** Used before the figure is laid out, e.g. in tests. */
const FALLBACK_WIDTH = 720;

/**
 * A Mermaid diagram in the colours of the design tokens. The library loads on the first diagram of a
 * page, a theme change draws it again, and if it cannot be drawn the reader gets its source text.
 */
export const UiMermaidDiagram = ({
  code,
  label = "Диаграмма",
}: UiMermaidDiagramProps): JSX.Element => {
  const theme = useDocumentTheme();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<DrawResult | null>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const key = `${theme}:${attempt}:${code}`;

  useEffect(() => {
    let cancelled = false;
    const width = canvasHost.current?.clientWidth || FALLBACK_WIDTH;
    import("./lib/renderMermaid")
      .then(({ renderMermaid }) => renderMermaid(code, width))
      .then((svg) => {
        if (!cancelled) setResult({ code, key, svg });
      })
      .catch(() => {
        if (!cancelled) setResult({ code, key, svg: null });
      });
    return (): void => {
      cancelled = true;
    };
  }, [code, key]);

  // A diagram drawn for the previous theme stays on screen until the new one is ready,
  // but the drawing of another source (the reader opened another article) is never shown.
  const svg = result?.code === code ? result.svg : null;
  const failed = result?.key === key && result.svg === null;

  return (
    <UiFullscreenPanel label={label}>
      {({ isFullscreen, toggleFullscreen }) => (
        <figure className={clsx(styles.figure, isFullscreen && styles.fullscreen)}>
          {failed ? (
            <div className={styles.problem}>
              <div className={styles.problemRow}>
                <p className={styles.problemText} role="status">
                  Не удалось нарисовать диаграмму, ниже её исходный текст.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<RotateCcw size={ICON_SIZE} />}
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Повторить
                </Button>
              </div>
              <CodeViewer code={code} language="text" />
            </div>
          ) : (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
                className={styles.expand}
                aria-label={isFullscreen ? "Свернуть диаграмму" : "Открыть диаграмму на весь экран"}
                title={isFullscreen ? "Свернуть" : "На весь экран"}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 size={ICON_SIZE} /> : <Maximize2 size={ICON_SIZE} />}
              </Button>
              <div ref={canvasHost} className={styles.canvasHost}>
                {svg ? (
                  <div
                    className={styles.canvas}
                    role="img"
                    aria-label={label}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                ) : (
                  <div className={styles.loading}>
                    <UiSpinner label="Рисуем диаграмму" />
                  </div>
                )}
              </div>
            </>
          )}
        </figure>
      )}
    </UiFullscreenPanel>
  );
};
