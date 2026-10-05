import { useState, useCallback, useRef, useEffect } from "react";
import { type EditorDiagnostic, type TypeScriptHover } from "@/shared/lib/code-editor";
import { getCaretCoordinates, getOffsetFromPoint } from "../lib/caretCoordinates";
import type { ContentWidgetAnchor } from "./useContentWidgetLayout";

export interface HoverSignaturesState {
  hoverInfo: TypeScriptHover | null;
  /** Diagnostics under the pointer, shown above the symbol info like in VS Code. */
  hoverProblems: EditorDiagnostic[];
  /** Line of the hovered word: the card sits above it, or below when there is no room. */
  position: ContentWidgetAnchor;
  handleMouseMove: (e: React.MouseEvent<HTMLTextAreaElement>, code: string) => void;
  /** Starts the hiding delay; moving onto the card in time keeps it open (sticky hover). */
  handleMouseLeave: () => void;
  /** The pointer reached the card. */
  keepHover: () => void;
  closeHover: () => void;
}

interface HoverState {
  info: TypeScriptHover | null;
  problems: EditorDiagnostic[];
  position: ContentWidgetAnchor;
}

// VS Code defaults: `editor.hover.delay` and `editor.hover.hidingDelay`.
const SHOW_DELAY = 300;
const HIDE_DELAY = 300;
const NO_PROBLEMS: EditorDiagnostic[] = [];
const NO_POSITION: ContentWidgetAnchor = { top: 0, bottom: 0, left: 0 };
const IDENTIFIER_CHAR = /[\w$]/;

/** The word under the pointer, or the problem range when it is not on a word. */
const getHoverRange = (
  code: string,
  offset: number,
  problems: EditorDiagnostic[]
): { start: number; end: number } => {
  let start = offset;
  let end = offset;
  while (start > 0 && IDENTIFIER_CHAR.test(code[start - 1])) start--;
  while (end < code.length && IDENTIFIER_CHAR.test(code[end])) end++;
  if (end > start) return { start, end };
  const problem = problems[0];
  return problem ? { start: problem.start, end: problem.end } : { start: offset, end: offset + 1 };
};

export function useHoverSignatures(
  requestHover?: (position: number, code: string) => Promise<TypeScriptHover | null>,
  layerRef?: React.RefObject<HTMLElement | null>,
  getProblemsAt?: (offset: number) => EditorDiagnostic[]
): HoverSignaturesState {
  const [hover, setHover] = useState<HoverState | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverRequestId = useRef(0);
  const rangeRef = useRef<{ start: number; end: number } | null>(null);

  const clearTimer = (timer: React.RefObject<ReturnType<typeof setTimeout> | null>): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimer(showTimeoutRef);
      clearTimer(hideTimeoutRef);
    };
  }, []);

  const closeHover = useCallback(() => {
    hoverRequestId.current++;
    clearTimer(showTimeoutRef);
    clearTimer(hideTimeoutRef);
    rangeRef.current = null;
    setHover(null);
  }, []);

  const scheduleHide = useCallback(() => {
    if (!rangeRef.current || hideTimeoutRef.current) return;
    hideTimeoutRef.current = setTimeout(closeHover, HIDE_DELAY);
  }, [closeHover]);

  const keepHover = useCallback(() => clearTimer(hideTimeoutRef), []);

  const handleMouseLeave = useCallback(() => {
    hoverRequestId.current++;
    clearTimer(showTimeoutRef);
    scheduleHide();
  }, [scheduleHide]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>, code: string) => {
      const textarea = e.currentTarget;
      const { clientX, clientY } = e;
      const layer = layerRef?.current ?? null;
      const shown = rangeRef.current;

      // Inside the hovered word nothing changes; leaving it starts the hiding delay.
      if (shown) {
        const offset = getOffsetFromPoint(textarea, layer, clientX, clientY);
        if (offset !== null && offset >= shown.start && offset < shown.end) {
          keepHover();
          return;
        }
        scheduleHide();
      }

      clearTimer(showTimeoutRef);
      const requestId = ++hoverRequestId.current;
      showTimeoutRef.current = setTimeout(async () => {
        const offset = getOffsetFromPoint(textarea, layer, clientX, clientY);
        if (offset === null) return;
        const info = (await requestHover?.(offset, code)) ?? null;
        if (requestId !== hoverRequestId.current) return;
        const problems = getProblemsAt?.(offset) ?? NO_PROBLEMS;
        if (!info && problems.length === 0) return;
        const range = getHoverRange(code, offset, problems);
        const caret = getCaretCoordinates(textarea, range.start);
        clearTimer(hideTimeoutRef);
        rangeRef.current = range;
        setHover({
          info,
          problems,
          position: {
            top: caret.top - textarea.scrollTop,
            bottom: caret.lineBottom - textarea.scrollTop,
            left: caret.left - textarea.scrollLeft,
          },
        });
      }, SHOW_DELAY);
    },
    [requestHover, layerRef, getProblemsAt, keepHover, scheduleHide]
  );

  return {
    hoverInfo: hover?.info ?? null,
    hoverProblems: hover?.problems ?? NO_PROBLEMS,
    position: hover?.position ?? NO_POSITION,
    handleMouseMove,
    handleMouseLeave,
    keepHover,
    closeHover,
  };
}
