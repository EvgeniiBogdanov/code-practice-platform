import { getLanguageCapabilities, getLanguageId, getMarkupContext } from "@/shared/lib/code-editor";
import { LineOperationResult, getLineOffsets, getSelectedLineRange } from "./lineOperations";

/** A `{/* … *\/}` cannot wrap text that already contains `*\/`: it would end early. */
const unchanged = (code: string, start: number, end: number): LineOperationResult => ({
  newCode: code,
  newSelectionStart: start,
  newSelectionEnd: end,
  changed: false,
});

export const toggleJsxTextComment = (
  code: string,
  start: number,
  end: number,
  filepath: string,
  wholeLine: boolean
): LineOperationResult | null => {
  if (!getLanguageCapabilities(getLanguageId(filepath)).supportsJsx) return null;
  const commentPattern = /\{\/\*([\s\S]*?)\*\/\}/g;
  for (const match of code.matchAll(commentPattern)) {
    const commentStart = match.index;
    const commentEnd = commentStart + match[0].length;
    if (start < commentStart || end > commentEnd) continue;
    if (getMarkupContext(code.slice(0, commentStart), filepath).mode !== "text") continue;
    const replacement = match[1].replace(/^ /, "").replace(/ $/, "");
    const newCode = code.slice(0, commentStart) + replacement + code.slice(commentEnd);
    const cursor = commentStart + Math.min(start - commentStart, replacement.length);
    return { newCode, newSelectionStart: cursor, newSelectionEnd: cursor, changed: true };
  }

  const range = getMarkupContext(code, filepath).textRanges.find(
    (item) => item.start <= start && end <= item.end
  );
  if (!range) return null;
  const lineStart = code.lastIndexOf("\n", start - 1) + 1;
  const nextLine = code.indexOf("\n", start);
  const lineEnd = nextLine === -1 ? code.length : nextLine;
  const regionStart = wholeLine && start === end ? Math.max(lineStart, range.start) : start;
  const regionEnd = wholeLine && start === end ? Math.min(lineEnd, range.end) : end;
  const content = code.slice(regionStart, regionEnd);
  if (content.includes("*/")) return unchanged(code, start, end);
  const replacement = content ? `{/* ${content} */}` : "{/*  */}";
  const newCode = code.slice(0, regionStart) + replacement + code.slice(regionEnd);
  const cursor = regionStart + (content ? replacement.length : 4);
  return { newCode, newSelectionStart: cursor, newSelectionEnd: cursor, changed: true };
};

// One comment spanning the whole line: `{/* a */} b {/* c */}` is not one.
const JSX_LINE_COMMENT = /^(\{\/\*\s?)((?:(?!\*\/)[\s\S])*?)(\s?\*\/\})$/;

/**
 * VS Code comments JSX children with `{/* … *\/}`: a `//` there would render as
 * text. Applies when every selected line starts inside markup children.
 */
export const toggleJsxLineComments = (
  code: string,
  start: number,
  end: number,
  filepath: string
): LineOperationResult | null => {
  if (!getLanguageCapabilities(getLanguageId(filepath)).supportsJsx) return null;
  const offsets = getLineOffsets(code);
  const { startLine, endLine } = getSelectedLineRange(code, start, end, offsets);
  const lines = code.split("\n");
  const targets = new Map<number, number>();
  for (let index = startLine; index <= endLine; index++) {
    if (!lines[index].trim()) continue;
    const contentStart = offsets[index] + (/^\s*/.exec(lines[index])?.[0].length ?? 0);
    if (getMarkupContext(code.slice(0, contentStart), filepath).mode !== "text") return null;
    targets.set(index, contentStart);
  }
  if (!targets.size) return null;

  const uncomment = [...targets.keys()].every((index) =>
    JSX_LINE_COMMENT.test(lines[index].trim())
  );
  if (!uncomment && [...targets.keys()].some((index) => lines[index].includes("*/")))
    return unchanged(code, start, end);
  // Per changed line: its original span and the size change before/after the caret.
  const shifts: Array<{ contentStart: number; lineEnd: number; prefix: number; total: number }> =
    [];
  for (const [index, contentStart] of targets) {
    const indent = lines[index].slice(0, contentStart - offsets[index]);
    const content = lines[index].slice(indent.length).trimEnd();
    const match = JSX_LINE_COMMENT.exec(content);
    const next = uncomment && match ? match[2] : `{/* ${content} */}`;
    shifts.push({
      contentStart,
      lineEnd: offsets[index] + lines[index].length,
      prefix: uncomment && match ? -match[1].length : 4,
      total: next.length - (lines[index].length - indent.length),
    });
    lines[index] = indent + next;
  }
  const map = (position: number): number => {
    let delta = 0;
    for (const shift of shifts) {
      if (position < shift.contentStart) break;
      if (position > shift.lineEnd) {
        delta += shift.total;
        continue;
      }
      return Math.max(shift.contentStart, position + shift.prefix) + delta;
    }
    return position + delta;
  };
  return {
    newCode: lines.join("\n"),
    newSelectionStart: map(start),
    newSelectionEnd: map(end),
    changed: true,
  };
};
