export interface LineOperationResult {
  newCode: string;
  newSelectionStart: number;
  newSelectionEnd: number;
  changed: boolean;
}

export const getLineOffsets = (code: string): number[] => {
  const offsets: number[] = [0];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "\n") {
      offsets.push(i + 1);
    }
  }
  return offsets;
};

export const getLineIndexFromOffset = (offsets: number[], pos: number): number => {
  let low = 0;
  let high = offsets.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (offsets[mid] <= pos) {
      if (mid === offsets.length - 1 || offsets[mid + 1] > pos) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return 0;
};

export const getSelectedLineRange = (
  code: string,
  selectionStart: number,
  selectionEnd: number,
  offsets: number[]
): { startLine: number; endLine: number } => {
  const startLine = getLineIndexFromOffset(offsets, selectionStart);
  let endLine = getLineIndexFromOffset(offsets, selectionEnd);

  // If selection ends at column 0 of a subsequent line (right after \n),
  // exclude that subsequent line from the selection block (VS Code behavior).
  if (selectionEnd > selectionStart && offsets[endLine] === selectionEnd && endLine > startLine) {
    endLine -= 1;
  }

  return { startLine, endLine };
};

export const moveLines = (
  code: string,
  selectionStart: number,
  selectionEnd: number,
  direction: "up" | "down"
): LineOperationResult => {
  const lines = code.split("\n");
  const offsets = getLineOffsets(code);
  const { startLine, endLine } = getSelectedLineRange(code, selectionStart, selectionEnd, offsets);

  if (direction === "up") {
    if (startLine === 0) {
      return {
        newCode: code,
        newSelectionStart: selectionStart,
        newSelectionEnd: selectionEnd,
        changed: false,
      };
    }

    const targetLine = startLine - 1;
    const targetLineLength = lines[targetLine].length + 1;
    const selectedBlock = lines.slice(startLine, endLine + 1);
    const targetLineContent = lines[targetLine];

    const newLines = [
      ...lines.slice(0, targetLine),
      ...selectedBlock,
      targetLineContent,
      ...lines.slice(endLine + 1),
    ];

    return {
      newCode: newLines.join("\n"),
      newSelectionStart: selectionStart - targetLineLength,
      newSelectionEnd: selectionEnd - targetLineLength,
      changed: true,
    };
  }

  if (endLine >= lines.length - 1) {
    return {
      newCode: code,
      newSelectionStart: selectionStart,
      newSelectionEnd: selectionEnd,
      changed: false,
    };
  }

  const targetLine = endLine + 1;
  const targetLineLength = lines[targetLine].length + 1;
  const selectedBlock = lines.slice(startLine, endLine + 1);
  const targetLineContent = lines[targetLine];

  const newLines = [
    ...lines.slice(0, startLine),
    targetLineContent,
    ...selectedBlock,
    ...lines.slice(targetLine + 1),
  ];

  return {
    newCode: newLines.join("\n"),
    newSelectionStart: selectionStart + targetLineLength,
    newSelectionEnd: selectionEnd + targetLineLength,
    changed: true,
  };
};

export const duplicateLines = (
  code: string,
  selectionStart: number,
  selectionEnd: number,
  direction: "up" | "down"
): LineOperationResult => {
  const lines = code.split("\n");
  const offsets = getLineOffsets(code);
  const { startLine, endLine } = getSelectedLineRange(code, selectionStart, selectionEnd, offsets);

  const selectedBlock = lines.slice(startLine, endLine + 1);
  const blockLength = selectedBlock.join("\n").length + 1;

  if (direction === "up") {
    const newLines = [
      ...lines.slice(0, startLine),
      ...selectedBlock,
      ...lines.slice(startLine),
    ];

    return {
      newCode: newLines.join("\n"),
      newSelectionStart: selectionStart,
      newSelectionEnd: selectionEnd,
      changed: true,
    };
  }

  const newLines = [
    ...lines.slice(0, endLine + 1),
    ...selectedBlock,
    ...lines.slice(endLine + 1),
  ];

  return {
    newCode: newLines.join("\n"),
    newSelectionStart: selectionStart + blockLength,
    newSelectionEnd: selectionEnd + blockLength,
    changed: true,
  };
};
