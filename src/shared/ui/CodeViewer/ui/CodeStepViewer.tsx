import type { JSX } from "react";
import { clsx } from "clsx";
import type { CodeStepViewerProps } from "../model/code-step-viewer";
import { useCodeStepViewer } from "../model/use-code-step-viewer";
import { CodeStepToolbar } from "./CodeStepToolbar";
import styles from "./CodeStepViewer.module.css";

export const CodeStepViewer = (props: CodeStepViewerProps): JSX.Element => {
  const { code, language = "javascript", activeLine, className, fontSize = 14 } = props;
  const { normalizedCode, lines, containerRef } = useCodeStepViewer(code, language, activeLine);
  return (
    <div className={clsx(styles.container, styles[`font${fontSize}`], className)}>
      <CodeStepToolbar {...props} code={normalizedCode} />
      <pre
        ref={containerRef}
        className={styles.surface}
        tabIndex={0}
        onKeyDown={(event) => {
          const action = ["+", "="].includes(event.key)
            ? props.onIncreaseFontSize
            : ["-", "_"].includes(event.key)
              ? props.onDecreaseFontSize
              : event.key === "0"
                ? props.onResetFontSize
                : undefined;
          if (action) {
            event.preventDefault();
            action();
          }
        }}
        aria-label={props.ariaLabel ?? "Код с текущим шагом"}
      >
        <code>
          {lines.map((line) => (
            <span
              key={line.number}
              className={clsx(styles.line, line.number === activeLine && styles.active)}
              aria-current={line.number === activeLine ? "step" : undefined}
            >
              <span className={styles.number} aria-hidden="true">
                {line.number}
              </span>
              <span dangerouslySetInnerHTML={{ __html: line.html || " " }} />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};
