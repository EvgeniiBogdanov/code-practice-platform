import React, { useLayoutEffect, useState } from "react";
import { clsx } from "clsx";
import { getCaretCoordinates, type CaretCoordinates } from "../../lib/caret-coordinates";
import styles from "./EditorDecorations.module.css";

export interface EditorDecorationsProps {
  /** Secondary carets of a multi-cursor edit. */
  carets: ReadonlyArray<number>;
  /** Offsets of the bracket pair around the caret. */
  brackets: ReadonlyArray<number>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Anything that moves text on screen: content, font size, wrapping. */
  layoutKey: string;
}

interface Decoration extends CaretCoordinates {
  kind: "caret" | "bracket";
}

const sameDecorations = (a: Decoration[], b: Decoration[]): boolean =>
  a.length === b.length &&
  a.every(
    (mark, index) =>
      mark.kind === b[index].kind &&
      mark.top === b[index].top &&
      mark.left === b[index].left &&
      mark.lineHeight === b[index].lineHeight
  );

/**
 * Caret-anchored marks rendered inside the highlight layer, so they scroll with
 * the text without re-highlighting the document on every caret move.
 */
export const EditorDecorations = ({
  carets,
  brackets,
  textareaRef,
  layoutKey,
}: EditorDecorationsProps): React.JSX.Element => {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  // Resizing a panel rewraps the text without changing it, which moves every mark.
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setWidth(textarea.clientWidth));
    observer.observe(textarea);
    return (): void => observer.disconnect();
  }, [textareaRef]);

  // Measure after commit: the mirror reads the textarea value React just rendered.
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const measure = (offset: number, kind: Decoration["kind"]): Decoration => ({
      ...getCaretCoordinates(textarea, offset),
      kind,
    });
    const next = [
      ...carets.map((offset) => measure(offset, "caret")),
      ...brackets.map((offset) => measure(offset, "bracket")),
    ];
    setDecorations((current) => (sameDecorations(current, next) ? current : next));
  }, [carets, brackets, textareaRef, layoutKey, width]);

  return (
    <>
      {decorations.map((decoration) => (
        <span
          key={`${decoration.kind}:${decoration.top}:${decoration.left}`}
          className={clsx(styles.mark, styles[decoration.kind])}
          style={
            {
              "--mark-top": `${decoration.top}px`,
              "--mark-left": `${decoration.left}px`,
              "--mark-height": `${decoration.lineHeight}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
};
