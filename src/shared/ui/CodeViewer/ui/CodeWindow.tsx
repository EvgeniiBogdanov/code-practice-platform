import type { JSX, ReactNode } from "react";
import { clsx } from "clsx";
import { calculateGutterWidth, getLanguageMeta } from "../lib";
import { CodeCopyButton } from "./CodeCopyButton";
import { CodeViewerGutter } from "./CodeViewerGutter";
import { CodeViewerHeader } from "./CodeViewerHeader";
import styles from "../CodeViewer.module.css";

export interface CodeWindowProps {
  language?: string;
  /** The text being shown, for the copy button. */
  code: string;
  linesCount: number;
  showLineNumbers?: boolean;
  /** Controls on the right of the header. */
  headerActions?: ReactNode;
  className?: string;
  /** The code itself: wrap it in `CodeWindowPre`. */
  children: ReactNode;
}

/**
 * The shell of a code window: language header, line numbers, copy button and the code area.
 * The viewer fills it with highlighted markup, an editor with live text. Everything but
 * `children` is marked non-editable, so it can sit inside a contenteditable node view.
 */
export const CodeWindow = ({
  language,
  code,
  linesCount,
  showLineNumbers = true,
  headerActions,
  className,
  children,
}: CodeWindowProps): JSX.Element => {
  const langMeta = getLanguageMeta(language);

  return (
    <div className={clsx(styles.codeViewer, className)}>
      <div className={styles.chrome} contentEditable={false}>
        <CodeViewerHeader
          langName={langMeta.name}
          color={langMeta.color}
          isNotepad={langMeta.isNotepad}
        >
          {headerActions}
        </CodeViewerHeader>
      </div>
      <div className={styles.surface}>
        {showLineNumbers && (
          <div className={styles.chrome} contentEditable={false}>
            <CodeViewerGutter
              linesCount={linesCount}
              gutterWidth={calculateGutterWidth(linesCount)}
            />
          </div>
        )}
        <div className={styles.canvas}>
          <span className={styles.chrome} contentEditable={false}>
            <CodeCopyButton code={code} />
          </span>
          {children}
        </div>
      </div>
    </div>
  );
};

/** The `<pre>` that holds the code inside a `CodeWindow`. */
export const CodeWindowPre = ({ children }: { children: ReactNode }): JSX.Element => (
  <pre className={styles.preOnly}>{children}</pre>
);
