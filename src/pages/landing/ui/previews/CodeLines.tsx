import React, { useMemo } from "react";
import { clsx } from "clsx";
import { tokenizeSnippet, type CodeToken } from "../../lib/codeTokens";
import styles from "./CodeLines.module.css";

export interface CodeLinesProps {
  code: string;
  /** 1-based line rendered with the editor's active-line background. */
  activeLine?: number;
  /** Identifier shown as multi-cursor selections (each occurrence gets a caret). */
  selection?: string;
  className?: string;
}

const renderToken = (token: CodeToken, key: number, selection?: string): React.ReactNode => {
  if (!selection || !token.text.includes(selection)) {
    return (
      <span key={key} className={styles[token.kind]}>
        {token.text}
      </span>
    );
  }

  const parts = token.text.split(selection);
  return (
    <span key={key} className={styles[token.kind]}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className={styles.selection}>
              {selection}
              <span className={styles.cursor} />
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

/** Read-only code block coloured with the workspace syntax tokens (`--hl-*`). */
export const CodeLines = ({
  code,
  activeLine,
  selection,
  className,
}: CodeLinesProps): React.JSX.Element => {
  const lines = useMemo(() => tokenizeSnippet(code), [code]);

  return (
    <div className={clsx(styles.code, className)}>
      {lines.map((tokens, lineIndex) => (
        <div
          key={lineIndex}
          className={clsx(styles.line, activeLine === lineIndex + 1 && styles.activeLine)}
        >
          <span className={styles.gutter}>{lineIndex + 1}</span>
          <span className={styles.content}>
            {tokens.map((token, index) => renderToken(token, index, selection))}
          </span>
        </div>
      ))}
    </div>
  );
};
