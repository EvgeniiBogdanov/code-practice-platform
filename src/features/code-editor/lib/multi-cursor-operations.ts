export interface TextRange {
  start: number;
  end: number;
}

export interface WordAtPosition extends TextRange {
  word: string;
}

export interface MultiEditResult {
  newCode: string;
  newSelections: TextRange[];
  changed: boolean;
}

export const isWordChar = (char: string): boolean => {
  return /[a-zA-Z0-9_$]/.test(char);
};

export const findWordAtPosition = (code: string, pos: number): WordAtPosition | null => {
  if (!code || pos < 0 || pos > code.length) return null;

  let checkPos = pos;
  if (checkPos > 0 && !isWordChar(code.charAt(checkPos)) && isWordChar(code.charAt(checkPos - 1))) {
    checkPos = pos - 1;
  }

  if (!isWordChar(code.charAt(checkPos))) {
    return null;
  }

  let start = checkPos;
  while (start > 0 && isWordChar(code.charAt(start - 1))) {
    start--;
  }

  let end = checkPos;
  while (end < code.length && isWordChar(code.charAt(end))) {
    end++;
  }

  const word = code.substring(start, end);
  if (!word) return null;

  return { start, end, word };
};

export const findAllMatches = (
  code: string,
  target: string,
  matchCase = true
): TextRange[] => {
  if (!code || !target) return [];

  const matches: TextRange[] = [];
  const searchCode = matchCase ? code : code.toLowerCase();
  const searchTarget = matchCase ? target : target.toLowerCase();
  const targetLen = target.length;

  let idx = searchCode.indexOf(searchTarget, 0);
  while (idx !== -1) {
    matches.push({ start: idx, end: idx + targetLen });
    idx = searchCode.indexOf(searchTarget, idx + targetLen);
  }

  return matches;
};

export const findNextMatch = (
  code: string,
  target: string,
  existingSelections: TextRange[],
  matchCase = true
): TextRange | null => {
  const allMatches = findAllMatches(code, target, matchCase);
  if (allMatches.length === 0) return null;

  const isSelected = (m: TextRange) =>
    existingSelections.some((s) => s.start === m.start && s.end === m.end);

  if (existingSelections.length === 0) {
    return allMatches[0];
  }

  const sortedSelections = [...existingSelections].sort((a, b) => a.start - b.start);
  const lastSel = sortedSelections[sortedSelections.length - 1];

  const nextMatch = allMatches.find((m) => m.start > lastSel.start && !isSelected(m));
  if (nextMatch) {
    return nextMatch;
  }

  const wrappedMatch = allMatches.find((m) => !isSelected(m));
  return wrappedMatch || null;
};

export const applyMultiTextInsert = (
  code: string,
  selections: TextRange[],
  insertedText: string,
  preserveSelectionRanges = false
): MultiEditResult => {
  if (selections.length === 0) {
    return { newCode: code, newSelections: selections, changed: false };
  }

  const sorted = [...selections].sort((a, b) => a.start - b.start);

  let newCode = code;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const { start, end } = sorted[i];
    newCode = newCode.substring(0, start) + insertedText + newCode.substring(end);
  }

  let cumulativeShift = 0;
  const newSelections: TextRange[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const { start, end } = sorted[i];
    const originalLen = end - start;
    const newStart = start + cumulativeShift;
    const newEnd = preserveSelectionRanges
      ? newStart + insertedText.length
      : newStart + insertedText.length;
    const finalStart = preserveSelectionRanges ? newStart : newEnd;

    newSelections.push({ start: finalStart, end: newEnd });
    cumulativeShift += insertedText.length - originalLen;
  }

  return {
    newCode,
    newSelections,
    changed: true,
  };
};

export const applyMultiBackspace = (
  code: string,
  selections: TextRange[]
): MultiEditResult => {
  if (selections.length === 0) {
    return { newCode: code, newSelections: selections, changed: false };
  }

  const hasRangeSelection = selections.some((s) => s.start < s.end);

  if (hasRangeSelection) {
    return applyMultiTextInsert(code, selections, "");
  }

  const sorted = [...selections].sort((a, b) => a.start - b.start);
  const rangesToDelete: TextRange[] = sorted.map((s) => ({
    start: Math.max(0, s.start - 1),
    end: s.start,
  }));

  return applyMultiTextInsert(code, rangesToDelete, "");
};

export const applyMultiDelete = (
  code: string,
  selections: TextRange[]
): MultiEditResult => {
  if (selections.length === 0) {
    return { newCode: code, newSelections: selections, changed: false };
  }

  const hasRangeSelection = selections.some((s) => s.start < s.end);

  if (hasRangeSelection) {
    return applyMultiTextInsert(code, selections, "");
  }

  const sorted = [...selections].sort((a, b) => a.start - b.start);
  const rangesToDelete: TextRange[] = sorted.map((s) => ({
    start: s.start,
    end: Math.min(code.length, s.start + 1),
  }));

  return applyMultiTextInsert(code, rangesToDelete, "");
};
