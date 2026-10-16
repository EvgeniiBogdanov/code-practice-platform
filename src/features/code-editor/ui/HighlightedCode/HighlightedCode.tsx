import React, { memo, useLayoutEffect, useRef } from "react";
import styles from "./HighlightedCode.module.css";

export interface HighlightedCodeProps {
  /** Highlighted markup of each source line, balanced on its own. */
  lines: ReadonlyArray<string>;
  /** The `code` element; its children are the rendered lines, in order. */
  codeRef: React.RefObject<HTMLElement | null>;
}

const createLine = (html: string): HTMLDivElement => {
  const line = document.createElement("div");
  line.className = styles.line;
  line.innerHTML = `${html}\n`;
  return line;
};

/**
 * Renders highlighted lines and, on every edit, rewrites only the lines that changed:
 * the unchanged head and tail of the document keep their DOM, so typing costs the same
 * in a long file as in a short one. Each line ends with its newline, which keeps the
 * text of the layer identical to the document for hit-testing and marks.
 */
export const HighlightedCode = memo(
  ({ lines, codeRef }: HighlightedCodeProps): React.JSX.Element => {
    const renderedRef = useRef<ReadonlyArray<string>>([]);

    useLayoutEffect(() => {
      const root = codeRef.current;
      if (!root) return;
      const previous = renderedRef.current;
      let start = 0;
      while (start < previous.length && start < lines.length && previous[start] === lines[start]) {
        start++;
      }
      let previousEnd = previous.length;
      let nextEnd = lines.length;
      while (
        previousEnd > start &&
        nextEnd > start &&
        previous[previousEnd - 1] === lines[nextEnd - 1]
      ) {
        previousEnd--;
        nextEnd--;
      }

      const reused = Math.min(previousEnd, nextEnd) - start;
      for (let index = start; index < start + reused; index++) {
        root.children[index].innerHTML = `${lines[index]}\n`;
      }
      if (nextEnd > previousEnd) {
        const added = document.createDocumentFragment();
        for (let index = start + reused; index < nextEnd; index++)
          added.append(createLine(lines[index]));
        root.insertBefore(added, root.children[previousEnd] ?? null);
      } else {
        for (let index = previousEnd - 1; index >= start + reused; index--)
          root.children[index].remove();
      }
      renderedRef.current = lines;
    }, [lines, codeRef]);

    return <code ref={codeRef} className={styles.code} />;
  }
);

HighlightedCode.displayName = "HighlightedCode";
