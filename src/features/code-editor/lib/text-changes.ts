export interface TextChange {
  start: number;
  end: number;
  newText: string;
}

export interface AppliedTextChanges {
  code: string;
  /** Maps an offset in the original code to the edited code. */
  mapOffset: (offset: number) => number;
}

/** Applies non-overlapping edits computed against the same source (TS code fixes). */
export const applyTextChanges = (
  code: string,
  changes: ReadonlyArray<TextChange>
): AppliedTextChanges => {
  const sorted = [...changes].sort((a, b) => a.start - b.start);
  let result = "";
  let cursor = 0;
  for (const change of sorted) {
    result += code.slice(cursor, change.start) + change.newText;
    cursor = change.end;
  }
  result += code.slice(cursor);
  return {
    code: result,
    mapOffset: (offset) =>
      sorted.reduce(
        (mapped, change) =>
          offset >= change.end
            ? mapped + change.newText.length - (change.end - change.start)
            : offset > change.start
              ? mapped + (change.start + change.newText.length - offset)
              : mapped,
        offset
      ),
  };
};
