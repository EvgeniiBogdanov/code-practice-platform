import { highlightCode } from "@/shared/lib/code-editor";
import { getLanguageMeta } from "@/shared/ui";

export interface HighlightRange {
  from: number;
  to: number;
  className: string;
}

/**
 * Token ranges of `code` for the viewer's highlighter, so an editable code block is coloured
 * by the same engine as the read-only one. The highlighter returns markup; its text is the
 * code itself, so each text node maps back to an offset in `code`.
 * Returns no ranges for plain text, or if the markup does not reproduce the code exactly.
 */
export const getHighlightRanges = (code: string, language: string | null): HighlightRange[] => {
  if (!code || getLanguageMeta(language ?? undefined).isNotepad) return [];

  const container = document.createElement("div");
  container.innerHTML = highlightCode(code, language ?? undefined);
  if (container.textContent !== code) return [];

  const ranges: HighlightRange[] = [];
  let offset = 0;
  const walk = (node: Node, classes: string[]): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent?.length ?? 0;
      if (length > 0 && classes.length > 0) {
        ranges.push({ from: offset, to: offset + length, className: classes.join(" ") });
      }
      offset += length;
      return;
    }
    const own = node instanceof HTMLElement ? node.className.split(/\s+/).filter(Boolean) : [];
    node.childNodes.forEach((child) => walk(child, [...classes, ...own]));
  };
  walk(container, []);
  return ranges;
};
