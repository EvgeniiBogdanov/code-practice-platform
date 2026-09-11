import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { highlightCode } from "../../../lib/code-editor";
import { cleanCode } from "../lib";

interface CodeStepView {
  readonly normalizedCode: string;
  readonly lines: readonly { readonly number: number; readonly html: string }[];
  readonly containerRef: RefObject<HTMLPreElement | null>;
}

export const useCodeStepViewer = (
  code: string,
  language: string,
  activeLine?: number
): CodeStepView => {
  const normalizedCode = useMemo(() => cleanCode(code), [code]);
  const lines = useMemo(
    () =>
      normalizedCode.split("\n").map((source, index) => ({
        number: index + 1,
        html: highlightCode(source, language),
      })),
    [normalizedCode, language]
  );
  const containerRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const viewport = containerRef.current;
    const line = viewport?.querySelector<HTMLElement>("[aria-current=step]");
    if (!viewport || !line) return;
    const top = line.offsetTop;
    if (
      top < viewport.scrollTop ||
      top + line.offsetHeight > viewport.scrollTop + viewport.clientHeight
    ) {
      viewport.scrollTop = Math.max(0, top - viewport.clientHeight / 2 + line.offsetHeight / 2);
    }
  }, [activeLine, normalizedCode]);
  return { normalizedCode, lines, containerRef };
};
