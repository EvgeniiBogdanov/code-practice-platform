import { LineOperationResult, getLineOffsets, getSelectedLineRange } from "./line-operations";

export interface CommentSyntax {
  line: {
    prefix: string;
    suffix?: string;
  };
  block: {
    start: string;
    end: string;
  };
}

export const getCommentSyntax = (filepath = "main.jsx"): CommentSyntax => {
  const ext = filepath.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "html" || ext === "htm") {
    return {
      line: { prefix: "<!-- ", suffix: " -->" },
      block: { start: "<!-- ", end: " -->" },
    };
  }

  if (ext === "css") {
    return {
      line: { prefix: "/* ", suffix: " */" },
      block: { start: "/* ", end: " */" },
    };
  }

  if (ext === "sql") {
    return {
      line: { prefix: "-- " },
      block: { start: "/* ", end: " */" },
    };
  }

  return {
    line: { prefix: "// " },
    block: { start: "/* ", end: " */" },
  };
};

const isLineCommented = (line: string, syntax: CommentSyntax): boolean => {
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  const p = syntax.line.prefix.trim();
  if (!trimmed.startsWith(p)) return false;
  if (syntax.line.suffix) {
    const s = syntax.line.suffix.trim();
    return trimmed.endsWith(s);
  }
  return true;
};

const uncommentLine = (line: string, syntax: CommentSyntax): string => {
  const indent = line.match(/^(\s*)/)?.[1] ?? "";
  let rest = line.slice(indent.length);

  if (rest.startsWith(syntax.line.prefix)) {
    rest = rest.slice(syntax.line.prefix.length);
  } else if (rest.startsWith(syntax.line.prefix.trim())) {
    rest = rest.slice(syntax.line.prefix.trim().length);
  }

  if (syntax.line.suffix) {
    if (rest.endsWith(syntax.line.suffix)) {
      rest = rest.slice(0, -syntax.line.suffix.length);
    } else if (rest.endsWith(syntax.line.suffix.trim())) {
      rest = rest.slice(0, -syntax.line.suffix.trim().length);
    }
  }

  return indent + rest;
};

const commentLine = (line: string, syntax: CommentSyntax): string => {
  const indent = line.match(/^(\s*)/)?.[1] ?? "";
  const content = line.slice(indent.length);
  const suffix = syntax.line.suffix ?? "";
  return `${indent}${syntax.line.prefix}${content}${suffix}`;
};

export const toggleLineComment = (
  code: string,
  selectionStart: number,
  selectionEnd: number,
  filepath = "main.jsx"
): LineOperationResult => {
  const syntax = getCommentSyntax(filepath);
  const lines = code.split("\n");
  const offsets = getLineOffsets(code);
  const { startLine, endLine } = getSelectedLineRange(code, selectionStart, selectionEnd, offsets);

  const targetLines = lines.slice(startLine, endLine + 1);
  const nonEmpty = targetLines.filter((l) => l.trim().length > 0);
  const linesToCheck = nonEmpty.length > 0 ? nonEmpty : targetLines;
  const shouldUncomment = linesToCheck.every((l) => isLineCommented(l, syntax));

  const newLines = [...lines];
  let newSelStart = selectionStart;
  let newSelEnd = selectionEnd;

  for (let i = startLine; i <= endLine; i++) {
    const oldLine = lines[i];
    if (oldLine.trim().length === 0 && startLine !== endLine) {
      continue;
    }

    let newLine = oldLine;
    if (shouldUncomment) {
      newLine = uncommentLine(oldLine, syntax);
    } else if (!isLineCommented(oldLine, syntax)) {
      newLine = commentLine(oldLine, syntax);
    }

    if (oldLine === newLine) continue;

    const lineOffset = offsets[i];
    const indentLen = oldLine.match(/^(\s*)/)?.[1].length ?? 0;
    const changePos = lineOffset + indentLen;
    const charDiff = newLine.length - oldLine.length;

    if (charDiff > 0) {
      if (
        selectionStart > changePos ||
        (selectionStart === changePos && selectionStart === selectionEnd)
      ) {
        newSelStart += charDiff;
      }
      if (selectionEnd >= changePos) {
        newSelEnd += charDiff;
      }
    } else {
      const removedLen = -charDiff;
      if (selectionStart > changePos) {
        newSelStart -= Math.min(removedLen, selectionStart - changePos);
      }
      if (selectionEnd > changePos) {
        newSelEnd -= Math.min(removedLen, selectionEnd - changePos);
      }
    }

    newLines[i] = newLine;
  }

  return {
    newCode: newLines.join("\n"),
    newSelectionStart: Math.max(0, newSelStart),
    newSelectionEnd: Math.max(newSelStart, newSelEnd),
    changed: true,
  };
};

const unwrapSelectedBlock = (
  code: string,
  start: number,
  end: number,
  startTrim: string,
  endTrim: string
): LineOperationResult => {
  const selected = code.substring(start, end);
  const startIdx = selected.indexOf(startTrim);
  const endIdx = selected.lastIndexOf(endTrim);

  const contentStart =
    selected[startIdx + startTrim.length] === " "
      ? startIdx + startTrim.length + 1
      : startIdx + startTrim.length;
  const contentEnd = selected[endIdx - 1] === " " ? endIdx - 1 : endIdx;

  const unwrapped =
    selected.slice(0, startIdx) +
    selected.slice(contentStart, contentEnd) +
    selected.slice(endIdx + endTrim.length);

  const newCode = code.slice(0, start) + unwrapped + code.slice(end);
  return {
    newCode,
    newSelectionStart: start,
    newSelectionEnd: start + unwrapped.length,
    changed: true,
  };
};

const unwrapEnclosingBlock = (
  code: string,
  pos: number,
  lastStart: number,
  nextEnd: number,
  startTrim: string,
  endTrim: string
): LineOperationResult => {
  const contentStart =
    code[lastStart + startTrim.length] === " "
      ? lastStart + startTrim.length + 1
      : lastStart + startTrim.length;
  const contentEnd = code[nextEnd - 1] === " " ? nextEnd - 1 : nextEnd;
  const unwrapped = code.substring(contentStart, contentEnd);

  const newCode =
    code.substring(0, lastStart) + unwrapped + code.substring(nextEnd + endTrim.length);
  const removedBeforePos = contentStart - lastStart;
  const newPos = Math.max(lastStart, Math.min(newCode.length, pos - removedBeforePos));

  return {
    newCode,
    newSelectionStart: newPos,
    newSelectionEnd: newPos,
    changed: true,
  };
};

export const toggleBlockComment = (
  code: string,
  selectionStart: number,
  selectionEnd: number,
  filepath = "main.jsx"
): LineOperationResult => {
  const syntax = getCommentSyntax(filepath);
  const bStart = syntax.block.start;
  const bEnd = syntax.block.end;
  const bStartTrim = bStart.trim();
  const bEndTrim = bEnd.trim();

  if (selectionStart < selectionEnd) {
    const selected = code.substring(selectionStart, selectionEnd);
    const trimmed = selected.trim();
    const isWrapped =
      trimmed.startsWith(bStartTrim) &&
      trimmed.endsWith(bEndTrim) &&
      trimmed.length >= bStartTrim.length + bEndTrim.length;

    if (isWrapped) {
      return unwrapSelectedBlock(code, selectionStart, selectionEnd, bStartTrim, bEndTrim);
    }

    const wrapped = `${bStart}${selected}${bEnd}`;
    const newCode = code.slice(0, selectionStart) + wrapped + code.slice(selectionEnd);
    return {
      newCode,
      newSelectionStart: selectionStart,
      newSelectionEnd: selectionStart + wrapped.length,
      changed: true,
    };
  }

  const pos = selectionStart;
  const lastStart = code.lastIndexOf(bStartTrim, pos);
  const lastEndBefore = code.lastIndexOf(bEndTrim, pos);

  if (lastStart !== -1 && (lastEndBefore === -1 || lastStart > lastEndBefore)) {
    const nextEnd = code.indexOf(bEndTrim, pos);
    const nextStart = code.indexOf(bStartTrim, pos);
    if (nextEnd !== -1 && (nextStart === -1 || nextStart > nextEnd)) {
      return unwrapEnclosingBlock(code, pos, lastStart, nextEnd, bStartTrim, bEndTrim);
    }
  }

  const insertion = `${bStart}${bEnd}`;
  const newCode = code.substring(0, pos) + insertion + code.substring(pos);
  const newCursor = pos + bStart.length;

  return {
    newCode,
    newSelectionStart: newCursor,
    newSelectionEnd: newCursor,
    changed: true,
  };
};
